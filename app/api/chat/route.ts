import { NextRequest, NextResponse } from "next/server";
import { buildSystemPrompt } from "@/lib/ai/prompt";
import { localReply } from "@/lib/ai/local";

export const runtime = "nodejs";
export const maxDuration = 30;

/* ── Input validation ─────────────────────────────────────────── */
function validate(body: unknown): { ok: true; message: string; history: Msg[]; memory?: Mem; mode: string } | { ok: false; error: string } {
  if (typeof body !== "object" || body === null) return { ok: false, error: "invalid body" };
  const b = body as Record<string, unknown>;
  const message = typeof b.message === "string" ? b.message.trim() : "";
  if (!message) return { ok: false, error: "message required" };
  if (message.length > 2000) return { ok: false, error: "message too long" };
  const mode = typeof b.mode === "string" && b.mode.length < 20 ? b.mode : "chat";
  const history = Array.isArray(b.history)
    ? b.history
        .filter(
          (h): h is { role: "user" | "vamanan"; text: string } =>
            typeof h === "object" &&
            h !== null &&
            (h.role === "user" || h.role === "vamanan") &&
            typeof (h as Record<string, unknown>).text === "string"
        )
        .slice(-10)
        .map((h) => ({ role: h.role, text: h.text.slice(0, 2000) }))
    : [];
  const memory =
    typeof b.memory === "object" && b.memory !== null
      ? sanitizeMemory(b.memory as Record<string, unknown>)
      : undefined;
  return { ok: true, message, history, memory, mode };
}

function sanitizeMemory(m: Record<string, unknown>): Mem | undefined {
  const out: Mem = {};
  if (typeof m.name === "string" && m.name.length <= 32) out.name = m.name.slice(0, 32);
  if (m.language === "english" || m.language === "malayalam" || m.language === "mixed") out.language = m.language;
  if (Array.isArray(m.interests)) {
    out.interests = m.interests
      .filter((i): i is string => typeof i === "string" && i.length > 0 && i.length <= 32)
      .slice(0, 6);
  }
  if (Array.isArray(m.previousTopics)) {
    out.previousTopics = m.previousTopics
      .filter((t): t is string => typeof t === "string" && t.length <= 60)
      .slice(0, 8);
  }
  if (typeof m.quizScore === "number" && m.quizScore >= 0 && m.quizScore <= 10) out.quizScore = m.quizScore;
  return Object.keys(out).length ? out : undefined;
}

type Mem = {
  name?: string;
  language?: "english" | "malayalam" | "mixed";
  interests?: string[];
  previousTopics?: string[];
  quizScore?: number;
};
type Msg = { role: "user" | "vamanan"; text: string };

/* ── Rate limiting (in-memory, per-IP, best-effort) ────────────── */
const RATE_LIMIT = 20; // requests
const RATE_WINDOW = 60_000; // per minute
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const list = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW);
  if (list.length >= RATE_LIMIT) {
    hits.set(ip, list);
    return true;
  }
  list.push(now);
  hits.set(ip, list);
  // occasionally clean the map so it does not grow unbounded
  if (hits.size > 5000) {
    for (const [k, v] of hits) {
      if (v.every((t) => now - t >= RATE_WINDOW)) hits.delete(k);
    }
  }
  return false;
}

/* ── Gemini call ──────────────────────────────────────────────── */
async function callGemini(
  systemPrompt: string,
  history: Msg[],
  message: string,
  apiKey: string,
  model: string
): Promise<string | null> {
  const contents = [
    ...history.map((h) => ({
      role: h.role === "user" ? "user" : "model",
      parts: [{ text: h.text }],
    })),
    { role: "user", parts: [{ text: message }] },
  ];

  async function attempt(): Promise<Response> {
    return fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemPrompt }] },
          contents,
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 700,
          },
        }),
        signal: AbortSignal.timeout(15_000),
      }
    );
  }

  let res = await attempt();
  // 429 = per-minute quota blip — one short retry covers most windows;
  // anything else (or a second 429) falls through to the local engine
  if (res.status === 429) {
    console.warn("[chat] gemini 429 — retrying once after backoff");
    await new Promise((r) => setTimeout(r, 2_500));
    res = await attempt();
  }

  if (!res.ok) {
    console.error("[chat] gemini error:", res.status, (await res.text().catch(() => "")).slice(0, 200));
    return null;
  }
  const data = await res.json();
  const text =
    data?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text ?? "").join("") ?? "";
  const trimmed = text.trim();
  if (!trimmed) return null;
  return trimmed;
}

/* ── POST /api/chat ───────────────────────────────────────────── */
export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const parsed = validate(body);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }
  const { message, history, memory, mode } = parsed;

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json(
      { reply: "The winds are a little restless right now. Give it a moment and try again.", source: "local" },
      { status: 200 }
    );
  }

  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";

  if (apiKey) {
    try {
      const systemPrompt = buildSystemPrompt({
        memory: {
          name: memory?.name,
          language: memory?.language ?? "english",
          interests: memory?.interests ?? [],
          quizScore: memory?.quizScore,
        },
        mode,
      });
      const reply = await callGemini(systemPrompt, history, message, apiKey, model);
      if (reply) {
        return NextResponse.json({ reply, source: "gemini" });
      }
    } catch (err) {
      console.error("[chat] gemini error:", err instanceof Error ? err.message : err);
    }
  } else {
    console.warn("[chat] GEMINI_API_KEY not set — using local Vamanan engine");
  }

  // Local fallback — never show a dead chat to a visitor.
  // Recent assistant replies are passed in so the engine can rotate
  // variants and continue topics instead of parroting itself.
  const recentAssistant = history
    .filter((h) => h.role === "vamanan")
    .slice(-4)
    .map((h) => h.text);
  const local = localReply(message, {
    name: memory?.name,
    recent: recentAssistant,
  });
  return NextResponse.json({
    reply: local.reply,
    annotation: local.annotation,
    source: "local",
  });
}
