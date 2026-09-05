/**
 * Local fallback engine tests — the "demo never breaks" guarantee.
 *
 * Zero-dependency (node:test) so CI proves the fallback works without
 * any API key or network. Run: npm test
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { localReply } from "../lib/ai/local.ts";

/* ── intent coverage ─────────────────────────────────────────── */
test("answers 'what is onam' without any API", () => {
  const { reply } = localReply("What is Onam?");
  assert.ok(reply.length > 40, "substantial reply");
  assert.ok(/onam/i.test(reply), "mentions Onam");
  // no AI-assistant leakage
  assert.ok(!/as an ai|i cannot|language model/i.test(reply), "stays in character");
});

test("answers 'what is pookalam'", () => {
  const { reply } = localReply("What is a pookalam?");
  assert.ok(/pookalam|flower/i.test(reply));
});

test("answers sadya / vallam kali / mahabali intents", () => {
  for (const q of ["What's in a sadya?", "Tell me about vallam kali", "Who is Mahabali?"]) {
    const { reply } = localReply(q);
    assert.ok(reply.length > 30, `fallback for: ${q}`);
  }
});

/* ── character rules ─────────────────────────────────────────── */
test("never breaks character on unknown input", () => {
  const { reply } = localReply("asdfgh qwerty zxcvb 832974");
  assert.ok(reply.length > 20, "graceful redirect, not silence");
  assert.ok(!/i (?:don'?t|cannot) (?:know|help)/i.test(reply), "no assistant-speak");
});

/* ── script-awareness (regression: Malayalam ≠ gibberish) ──────── */
test("Malayalam input is not treated as numbers/gibberish", () => {
  // the old [\s\d\W] regex matched ALL Malayalam as "gibberish" because
  // \W means non-ASCII-word — this pins the Unicode-aware fix
  const { reply } = localReply("ഓണം?");
  assert.ok(!/numbers|my specialty begins at ten/i.test(reply), "no numbers-joke for Malayalam");
});

test("digits-only input gets the short playful reply", () => {
  const { reply } = localReply("123");
  assert.ok(/days of Onam|numbers/i.test(reply), "short numbers reply");
  assert.ok(reply.length < 160, "short, not a wall of text");
});

test("Malayalam-script questions hit curated intents, not generic", () => {
  const onam = localReply("ഓണം എന്തിന്?");
  assert.ok(!/kettichal|I do not know/i.test(onam.reply), "matched an intent (not generic)");
  const pookalam = localReply("പൂക്കളം");
  assert.ok(/pookalam|flower/i.test(pookalam.reply), "pookalam intent matched");
  const greet = localReply("നമസ്‌കാരം");
  assert.ok(/namaskaram|welcome|hello/i.test(greet.reply), "greeting intent matched");
});

test("greeting uses the visitor's name when known", () => {
  const { reply } = localReply("hi", { name: "Ravi" });
  assert.ok(/ravi/i.test(reply), "personalized");
});

/* ── anti-repetition (the rotation layer) ────────────────────── */
test("does not parrot the same reply twice in a row", () => {
  const first = localReply("What is Onam?").reply;
  const second = localReply("What is Onam?", { recent: [first] }).reply;
  assert.notEqual(first, second, "variant rotation kicks in");
});

/* ── continuation ("tell me more") ───────────────────────────── */
test("'tell me more' continues the last topic", () => {
  const first = localReply("What is Onam?").reply;
  const more = localReply("Tell me more", { recent: [first] });
  assert.ok(more.reply.length > 20);
  assert.notEqual(more.reply, first, "follow-up is new content");
});
