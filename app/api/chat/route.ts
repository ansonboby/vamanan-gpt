import { NextRequest, NextResponse } from "next/server";
import { buildSystemPrompt } from "@/lib/ai/prompt";
import { localReply } from "@/lib/ai/local";

export const runtime = "nodejs";
export const maxDuration = 60;

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

/* Fallback model chain (after GEMINI_MODEL, default 2.5-flash): each
 * has a separate free-tier daily bucket, so exhausting one rolls to
 * the next — the chat stays a real AI conversation far longer before
 * the hand-written local engine takes over. */
const MODEL_CHAIN = ["gemini-flash-latest", "gemini-3.1-flash-lite"];

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
  model: string,
  /** absolute function deadline (ms epoch) shared with the GLM path —
   * the chain must finish inside it or hand off to the local engine */
  functionDeadline: number
): Promise<string | null> {
  const contents = [
    ...history.map((h) => ({
      role: h.role === "user" ? "user" : "model",
      parts: [{ text: h.text }],
    })),
    { role: "user", parts: [{ text: message }] },
  ];

  /** attempt one Gemini model — timeout clamped to whatever budget is
   * left, so a late-chain attempt can never push past the deadline */
  async function attempt(m: string): Promise<Response> {
    const budget = Math.max(1_000, Math.min(15_000, deadline - Date.now()));
    return fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${apiKey}`,
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
        signal: AbortSignal.timeout(budget),
      }
    );
  }

  /* Model chain — each has its own free-tier daily bucket, so exhausting
   * one (or the per-minute blip) falls to the next instead of dead-ending
   * the chat in canned local replies during a demo.
   *
   * Budget guard: the whole chain must finish inside the serverless
   * 60s cap — the deadline is computed ONCE at request start (in POST)
   * so the GLM path's spend counts against it too. Each attempt checks
   * it, and the 429 retry is skipped when the budget is spent; the
   * worst case is a clean local-engine answer — never a kill mid-chain. */
  const deadline = functionDeadline;
  const chain = [model, ...MODEL_CHAIN.filter((m) => m !== model)];
  for (const m of chain) {
    const remaining = deadline - Date.now();
    if (remaining < 5_000) {
      console.warn(`[chat] budget spent before ${m} — local engine`);
      break;
    }
    let res: Response;
    try {
      res = await attempt(m);
    } catch {
      // network throw / abort — this model is unreachable, try the next
      console.warn(`[chat] ${m} fetch threw — trying next model`);
      continue;
    }
    // per-minute blip — one retry only if the full 2.5s backoff + 15s
    // attempt still fits inside the function budget
    if (res.status === 429 && deadline - Date.now() > 18_000) {
      console.warn(`[chat] ${m} 429 — retrying once after backoff`);
      await new Promise((r) => setTimeout(r, 2_500));
      try {
        res = await attempt(m);
      } catch {
        console.warn(`[chat] ${m} retry threw — trying next model`);
        continue;
      }
    }
    if (!res.ok) {
      console.error(`[chat] ${m} error:`, res.status, (await res.text().catch(() => "")).slice(0, 200));
      continue; // next model in the chain
    }
    const data = await res.json();
    const text =
      data?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text ?? "").join("") ?? "";
    const trimmed = text.trim();
    if (trimmed) return trimmed;
    console.warn(`[chat] ${m} returned empty — trying next model`);
  }
  return null;
}

/* ── POST /api/chat ───────────────────────────────────────────── */
/* Post-validation gate — runs on every AI reply before it reaches the
 * client. A reply that breaks character is worse than no reply: reject
 * it and let the next model (or the local engine) answer instead.
 * Local-engine replies are hand-written, so they skip the gate. */
const ASSISTANT_SPEAK =
  /\b(i'?m here to help|i would be happy to|as an ai|i'?m sorry, but i (?:can'?t|cannot)|let me know if you|i don'?t have personal (?:experiences|opinions))/i;
const PROMPT_LEAK =
  /system prompt|your instructions\b|these instructions|i'?m (?:giving|following) you (?:the )?(?:instructions|rules)/i;

function acceptableReply(text: string): boolean {
  if (ASSISTANT_SPEAK.test(text)) {
    console.warn("[chat] gate: rejected assistant-speak —", text.slice(0, 120));
    return false;
  }
  if (PROMPT_LEAK.test(text)) {
    console.warn("[chat] gate: rejected prompt leak —", text.slice(0, 120));
    return false;
  }
  // hard truncation (cut mid-word/mid-sentence at the token budget)
  if (text.length > 400 && !/[.!?…”"']$/.test(text.trim())) {
    console.warn("[chat] gate: rejected truncated reply —", text.slice(-60));
    return false;
  }
  return true;
}

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

  // absolute function deadline — computed BEFORE the GLM attempt so
  // its spend counts against the Gemini chain too (10s headroom under
  // the 60s serverless cap for parsing + the local-engine finish)
  const deadline = Date.now() + 50_000;

  const systemPrompt = buildSystemPrompt({
    memory: {
      name: memory?.name,
      language: memory?.language ?? "english",
      interests: memory?.interests ?? [],
      quizScore: memory?.quizScore,
    },
    mode,
  });

  /* ── GLM 5.3 via tokenrouter — primary ─────────────────────
   * Free, generous daily quota, genuinely strong character voice.
   * Tradeoff: it reasons before answering (typically 5-25s, but ~1 in 4
   * calls hangs), so it gets a 30s budget — on any miss (cold start,
   * timeout, error) fall straight through to Gemini, which answers in
   * 2-5s. The client's thinking trace covers the wait either way. */
  const glmKey = process.env.TOKENROUTER_API_KEY;
  if (glmKey) {
    try {
      const messages = [
        { role: "system", content: systemPrompt },
        ...history.map((h) => ({
          role: h.role === "user" ? ("user" as const) : ("assistant" as const),
          content: h.text,
        })),
        { role: "user" as const, content: message },
      ];
      const res = await fetch("https://api.tokenrouter.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${glmKey}`,
        },
        body: JSON.stringify({
          model: "z-ai/glm-5.3-free",
          messages,
          // GLM spends reasoning tokens before the visible reply — for
          // Malayalam it reasons at length, so the budget must cover both
          max_tokens: 2000,
          temperature: 0.8,
        }),
        signal: AbortSignal.timeout(30_000),
      });
      if (res.ok) {
        const data = await res.json();
        const text: string = data?.choices?.[0]?.message?.content ?? "";
        if (text.trim() && acceptableReply(text)) {
          return NextResponse.json({ reply: text.trim(), source: "glm" });
        }
      } else {
        console.warn("[chat] glm error:", res.status, (await res.text().catch(() => "")).slice(0, 150));
      }
    } catch (err) {
      console.error("[chat] glm error:", err instanceof Error ? err.message : err);
    }
  }

  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";

  if (apiKey) {
    try {
      const reply = await callGemini(systemPrompt, history, message, apiKey, model, deadline);
      if (reply && acceptableReply(reply)) {
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
    language: memory?.language ?? "english",
  });
  return NextResponse.json({
    reply: local.reply,
    annotation: local.annotation,
    source: "local",
  });
}
