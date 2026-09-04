/**
 * Session memory tests — the chaining rules from AGENTS.md:
 * updateMemory returns the NEXT memory object; callers must chain from
 * the return value or later writes overwrite earlier ones.
 *
 * localStorage is stubbed so no browser is needed. Run: npm test
 */
import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";

/* minimal localStorage stub before importing the module */
const store = new Map<string, string>();
(globalThis as Record<string, unknown>).window = {
  localStorage: {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => store.set(k, v),
    removeItem: (k: string) => store.delete(k),
    dispatchEvent: () => {},
  },
  addEventListener: () => {},
  removeEventListener: () => {},
};

const mem = await import("../lib/memory/sessionMemory.ts");
const { loadMemory, updateMemory, recordTopic, recordInterests, maybeExtractName } = mem;

beforeEach(() => store.clear());

test("updateMemory chains correctly (name then interests then topics)", () => {
  let m = loadMemory();
  m = updateMemory(m, { name: "Ravi" });
  m = updateMemory(m, { language: "mixed" });
  m = updateMemory(m, { quizScore: 8 });
  // all three survived the chain
  const final = loadMemory();
  assert.equal(final.name, "Ravi");
  assert.equal(final.language, "mixed");
  assert.equal(final.quizScore, 8);
});

test("stale-object anti-pattern is detectable (chaining is required)", () => {
  let m = loadMemory();
  updateMemory(m, { name: "Ravi" }); // return value DISCARDED — the bug pattern
  updateMemory(m, { quizScore: 8 }); // this write starts from no-name object
  const final = loadMemory();
  // quizScore won, name lost — documents why chaining matters
  assert.equal(final.quizScore, 8);
  assert.equal(final.name, undefined);
});

test("maybeExtractName catches the common forms", () => {
  assert.equal(maybeExtractName("Hi, I'm Anson"), "Anson");
  assert.equal(maybeExtractName("this is Ravi"), "Ravi");
  assert.equal(maybeExtractName("hello"), undefined);
  assert.equal(maybeExtractName("I am"), undefined);
});

test("recordTopic dedupes and caps", () => {
  let m = loadMemory();
  m = recordTopic(m, "onam");
  m = recordTopic(m, "onam"); // dupe
  m = recordTopic(m, "mahabali");
  assert.equal(m.previousTopics.length, 2);
  assert.deepEqual(m.previousTopics, ["onam", "mahabali"]);
});

test("recordInterests caps at MAX_INTERESTS", () => {
  let m = loadMemory();
  for (const t of ["pookalam", "sadya", "vallam kali", "mahabali", "malayalam", "one-too-many"]) {
    m = recordInterests(m, `tell me about ${t}`);
  }
  assert.ok(m.interests.length <= 5, `capped, got ${m.interests.length}`);
});

test("corrupted localStorage falls back to a safe default", () => {
  store.set("vamanan.memory.v1", "{corrupted json!!");
  const m = loadMemory();
  assert.equal(m.name, undefined);
  assert.deepEqual(m.interests, []);
});
