import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 30;

/**
 * POST /api/voice — speak a Vamanan reply with Gemini TTS.
 *
 * Takes { text }, returns audio/wav bytes. The delivery style is directed
 * here ("warm, unhurried storyteller") so every voice sounds like Vamanan.
 * Falls back with a clean 503 so the client can try browser speech.
 */

/* ── rate limiting (shared shape with /api/chat) ─────────────── */
const WINDOW_MS = 60_000;
const MAX_REQ = 30;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const arr = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (arr.length >= MAX_REQ) {
    hits.set(ip, arr);
    return true;
  }
  arr.push(now);
  hits.set(ip, arr);
  // occasionally clean the map so it does not grow unbounded
  if (hits.size > 2000) {
    for (const [k, v] of hits) {
      if (v.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
    }
  }
  return false;
}

/* ── PCM → WAV wrapper ──────────────────────────────────────────
 * Gemini TTS returns raw 24kHz 16-bit mono PCM as base64. Browsers
 * can't play raw PCM, so we prepend a minimal WAV header.
 */
function pcmToWav(pcm: Buffer, sampleRate = 24000): Buffer {
  const header = Buffer.alloc(44);
  header.write("RIFF", 0);
  header.writeUInt32LE(36 + pcm.length, 4);
  header.write("WAVE", 8);
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16); // PCM chunk size
  header.writeUInt16LE(1, 20); // PCM format
  header.writeUInt16LE(1, 22); // mono
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(sampleRate * 2, 28); // byte rate (16-bit mono)
  header.writeUInt16LE(2, 32); // block align
  header.writeUInt16LE(16, 34); // bits per sample
  header.write("data", 36);
  header.writeUInt32LE(pcm.length, 40);
  return Buffer.concat([header, pcm]);
}

const STYLE = [
  "Say this warmly and slowly, like a gentle storyteller from Kerala telling a tale to a friend.",
  "Unhurried pace, slight smile in the voice, natural pauses at punctuation.",
].join(" ");

/* two TTS models with separate quota buckets — try newest first */
const TTS_MODELS = ["gemini-3.1-flash-tts-preview", "gemini-2.5-flash-preview-tts"];

async function ttsFetch(model: string, apiKey: string, prompt: string): Promise<Response> {
  return fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseModalities: ["AUDIO"],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: "Kore" },
            },
          },
        },
      }),
      signal: AbortSignal.timeout(20_000),
    }
  );
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const raw =
    typeof body === "object" && body !== null
      ? (body as Record<string, unknown>).text
      : undefined;
  if (typeof raw !== "string") {
    return NextResponse.json({ error: "text required" }, { status: 400 });
  }
  const text = raw.trim();
  if (!text) return NextResponse.json({ error: "text required" }, { status: 400 });
  if (text.length > 700) {
    return NextResponse.json({ error: "text too long" }, { status: 400 });
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json({ error: "rate limited" }, { status: 200 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "voice unavailable" }, { status: 200 });
  }

  try {
    const prompt = `${STYLE}\n\n${text}`;
    let res = await ttsFetch(TTS_MODELS[0], apiKey, prompt);
    // quota exhausted on the first model → try the second bucket
    if (!res.ok && res.status === 429) {
      res = await ttsFetch(TTS_MODELS[1], apiKey, prompt);
    }

    if (!res.ok) {
      console.error("[voice] tts error:", res.status, (await res.text().catch(() => "")).slice(0, 200));
      return NextResponse.json({ error: "tts failed" }, { status: 200 });
    }

    const data = await res.json();
    const b64 =
      data?.candidates?.[0]?.content?.parts?.find((p: { inlineData?: { data?: string } }) =>
        p.inlineData?.data
      )?.inlineData?.data;

    if (!b64) {
      return NextResponse.json({ error: "no audio" }, { status: 200 });
    }

    const pcm = Buffer.from(b64, "base64");
    const wav = pcmToWav(pcm);
    return new NextResponse(new Uint8Array(wav), {
      headers: {
        "Content-Type": "audio/wav",
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (err) {
    console.error("[voice] error:", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "tts failed" }, { status: 200 });
  }
}
