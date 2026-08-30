# Vamanan GPT 🌾

**Meet Vamanan — an interactive AI storyteller from Kerala's Onam tradition.**

An interactive AI experience that brings the Onam legend to life through
conversation, story, and play. Talk to Vamanan about Mahabali, pookalam,
sadya and snake-boat races; hear the five-scene story of Onam; take the
ten-question challenge — in English, Malayalam, or a friendly mix.

> The heart of it is a promise. Mahabali kept his word even when it cost
> him his kingdom — and Onam is the day he comes home.

## Try it

- **Talk to Vamanan** — free-form conversation with a character who
  remembers your name, speaks Malayalam, and stays in character.
- **The Story of Mahabali** — five hand-illustrated scenes, from the
  golden age to the flowers that remember it.
- **Vamanan's Challenge** — ten questions of Kerala, with gentle
  verdicts and a final reaction from Vamanan himself.

No account needed — every journey starts with a question.

## How it works

```text
Browser (Next.js + React + TypeScript + Tailwind)
   │
   ├── /chat ──────► /api/chat ──► Gemini API (character prompt
   │                                  + curated cultural knowledge)
   │                                  │
   │                                  └─ on failure or missing key
   ├── /story ─────► static content  ► local Vamanan engine
   ├── /quiz ──────► static content
   │
   └── session memory (name, language, topics, quiz score) → localStorage
```

- **Character engine** — a layered system prompt (identity, personality,
  voice, cultural rules, session memory, current mode) keeps Vamanan in
  character without turning every reply into a costume.
- **Curated knowledge** — Onam, Mahabali, Vamana, pookalam, sadya, vallam
  kali: verified content the model is grounded in, with explicit
  instruction to express uncertainty rather than invent tradition.
- **Local fallback** — chat falls back to a hand-written local engine if
  the API key is missing or the network fails; story and quiz are fully
  static. The demo never breaks.
- **Session memory** — your name, language preference, recent topics and
  quiz score persist in `localStorage` — lightweight, private, opt-out-able.

## Run it locally

```bash
git clone <your-repo-url>
cd vamanan-gpt
npm install

# Optional — enables live Gemini chat. Without it, the local
# Vamanan engine still answers.
cp .env.example .env.local   # then add your GEMINI_API_KEY

npm run dev                  # http://localhost:3000
```

Get a free Gemini API key at [aistudio.google.com/apikey](https://aistudio.google.com/apikey).

## Deploy

Deploys cleanly to Vercel (or any Next.js host):

1. Push the repo to GitHub.
2. Import it on Vercel.
3. Add `GEMINI_API_KEY` as an environment variable (optional but recommended).
4. Ship it.

The API key is only ever read server-side — it never reaches client code.

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js (App Router) + TypeScript |
| UI | React 19 + Tailwind CSS v4 |
| Fonts | Fraunces (display) + Inter (UI) |
| AI | Google Gemini (`gemini-2.5-flash`) + local fallback engine |
| Memory | localStorage (session) |
| Art | Hand-drawn SVG — no stock images |

## Design

Warm ivory paper, deep forest green, muted marigold, restrained coral.
Editorial serif headlines, quiet sans UI. Every illustration is
hand-crafted SVG in the same motif language: pookalam rings, banana
leaves, a small storyteller with a coconut-shell umbrella.

See [design.md](./design.md) for the full design system.

## Project structure

```text
app/
├── page.tsx              # landing — hero, paths, cultural threads
├── chat/page.tsx         # conversation with Vamanan
├── story/page.tsx        # five-scene storybook
├── quiz/page.tsx         # ten-question challenge
├── about/page.tsx        # how it works + cultural care
├── api/chat/route.ts     # Gemini + local fallback, rate-limited
├── layout.tsx            # fonts, metadata
└── globals.css           # tokens, texture, motion, a11y

components/
├── SiteNav.tsx, SiteFooter.tsx
├── ui/buttons.tsx        # Button, ButtonLink, Chip
├── vamanan/               # avatar (SVG, 5 states), presence, greeting
├── chat/                  # ChatWindow, ChatMessage, PromptChips, ChatInput
├── story/StoryMode.tsx
└── quiz/QuizMode.tsx

lib/
├── ai/prompt.ts           # layered character prompt + knowledge base
├── ai/local.ts            # hand-written fallback engine
├── memory/sessionMemory.ts# localStorage session memory
├── content/story.ts       # five scenes
├── content/quiz.ts        # ten questions
└── types.ts
```

## Accessibility

- Keyboard support everywhere (chat, story arrows, quiz)
- Visible focus states, semantic HTML, ARIA live regions for chat
- `prefers-reduced-motion` respected — all animation is optional
- Quiz feedback never relies on color alone

## Cultural note

The Mahabali legend is presented as tradition, not verified history.
Vamanan is instructed to distinguish folklore from fact and to admit what
he doesn't know rather than invent it. Onam ashamsakal! 🌸
