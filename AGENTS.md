# Vamanan GPT — Agent Rules

Read before making changes. These rules bind humans and AI coding
assistants alike. They exist so the project stays what it is: a
character-driven cultural experience, not a generic chatbot.

## PRODUCT

- Vamanan GPT is a character-driven cultural AI experience.
- The product must feel like meeting Vamanan, not using generic ChatGPT.
- Onam, Kerala culture, Mahabali, storytelling, and playful exploration
  are core to the identity.
- The 90-second demo path must always work: land → name → ask → story →
  quiz. Never break it for a nice-to-have.

## CHARACTER

- Vamanan must remain in character.
- Never default to generic AI-assistant language ("As an AI…", "I'm here
  to help…", bullet-point encyclopedic answers).
- Avoid excessive Malayalam inserted artificially.
- Respect the cultural source material.
- Clearly distinguish tradition, mythology, folklore, and historical
  fact where relevant.
- Do not invent cultural facts, rituals, dates, or quotations.

## ENGINEERING

- Prefer simple architecture.
- Do not add dependencies without justification.
- Do not introduce unnecessary infrastructure (no auth, no database,
  no CMS — the PRD forbids them for the MVP).
- Keep secrets server-side. `GEMINI_API_KEY` must never appear in client
  code or client-visible bundles.
- Prefer reusable components.
- Keep state management simple (React state + localStorage session
  memory; no global store).
- Preserve responsive behavior — check 1440px and 390px.
- Preserve accessibility — keyboard, focus states, aria-live,
  reduced-motion, 44px tap targets.
- Long/unbroken user text must never cause horizontal overflow (see
  `[overflow-wrap:anywhere]` on chat bubbles — do not remove it).

## DESIGN

- Follow design.md.
- Do not replace the design system casually.
- Avoid generic SaaS styling.
- Avoid excessive gradients, glassmorphism, neon AI aesthetics, and
  visual clutter.
- Keep the Kerala/Onam identity subtle and sophisticated.
- The chatra umbrella (LogoMark) is the brand mark; keep it consistent
  wherever Vamanan is represented (nav, chat, favicon, OG image).

## WORKFLOW

- Read relevant documentation before using unfamiliar APIs.
- Use Playwright (or a real browser) to verify meaningful UI changes.
- Test desktop and mobile.
- Run `npm run lint` and `npm run typecheck` before declaring work
  complete.
- Never say a feature is complete merely because the code compiles.

## AI

- Character prompt logic must be isolated and maintainable
  (`lib/ai/prompt.ts`).
- Cultural knowledge should be grounded in curated content
  (`CULTURAL_KNOWLEDGE` in prompt.ts).
- The local fallback engine (`lib/ai/local.ts`) must keep working — it
  is the guarantee that the demo never breaks.
- Model provider secrets must never be exposed client-side.
- AI failures must have graceful UI states (soft message + retry).

## MEMORY

- Session memory keys: `name`, `language`, `interests`,
  `previousTopics`, `quizScore`.
- `updateMemory` returns the next memory object — callers must chain
  from the return value to avoid write races.
- Never collect sensitive data; localStorage only, easily cleared.

## GIT

- Make focused commits.
- Do not rewrite unrelated files.
- Do not commit secrets (`.env*` stays ignored except `.env.example`).
- Keep the repository clean and understandable.

## WHEN UNCERTAIN

- Inspect the repository first.
- Consult design.md and PRD.md.
- Choose the simplest correct solution.
