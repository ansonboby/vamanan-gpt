# Vamanan GPT — Detailed Build Guide

## 0. Product goal

Build a hosted AI experience that feels like **meeting Vamanan**, not like opening a generic AI chatbot with an Onam-themed background.

The product should:
- keep Vamanan in character;
- make Kerala/Onam culture the center of the experience;
- tell the Mahabali–Vamana story well;
- support natural conversation;
- remember lightweight session details;
- provide interactive features such as a story mode and quiz;
- work smoothly on desktop and mobile;
- be simple enough to finish and polish before submission.

### North-star test

A judge should be able to use the app for 60–90 seconds and say:

> “This is a real Vamanan experience, not just an LLM wrapper.”

---

# 1. Scope: MVP first, polish second

## P0 — must work

1. Landing page
2. Chat with Vamanan
3. Strong character/persona prompt
4. Onam/Mahabali knowledge
5. Malayalam mode
6. Interactive story mode
7. Onam quiz
8. Lightweight conversation memory
9. Responsive UI
10. Production deployment
11. Clean GitHub repository
12. Demo path that takes less than 90 seconds

## P1 — high-value polish

1. Vamanan avatar/illustration
2. Typing animation
3. Story scene transitions
4. Quiz score and feedback
5. Suggested prompts
6. Pookalam visual section
7. Audio affordance / optional text-to-speech
8. “Surprise me” interaction
9. Reduced-motion accessibility
10. Good empty, loading, error, and offline states

## P2 — only after the above is stable

1. Persistent accounts
2. Advanced analytics
3. Complex databases
4. Multi-user profiles
5. Admin dashboard
6. Large RAG pipeline
7. Huge content library

Do not allow P2 work to delay a working P0 product.

---

# 2. Recommended technical architecture

Keep the architecture understandable.

```text
Browser
   |
   v
Next.js / React UI
   |
   +-------------------------+
   |                         |
   v                         v
Chat Controller          Experience State
   |                         |
   v                         +--> quiz state
LLM API                      +--> story state
   |                         +--> session memory
   v
Response Guard
   |
   v
Vamanan response
```

Suggested stack:

```text
Framework      Next.js + React + TypeScript
Styling        Tailwind CSS
Components     shadcn/ui or lightweight custom components
AI             Gemini API or another suitable LLM API
Deployment     Vercel or equivalent
Storage        localStorage for MVP session memory
Repo           GitHub
```

The exact stack can change. The experience should not depend on the framework.

---

# 3. Project structure

```text
vamanan-gpt/
├── app/
│   ├── page.tsx
│   ├── chat/
│   │   └── page.tsx
│   ├── story/
│   │   └── page.tsx
│   ├── quiz/
│   │   └── page.tsx
│   └── api/
│       └── chat/
│           └── route.ts
│
├── components/
│   ├── ui/
│   ├── vamanan/
│   │   ├── VamananAvatar.tsx
│   │   ├── VamananGreeting.tsx
│   │   └── VamananPresence.tsx
│   ├── chat/
│   │   ├── ChatWindow.tsx
│   │   ├── ChatMessage.tsx
│   │   ├── PromptChips.tsx
│   │   └── ChatInput.tsx
│   ├── story/
│   │   ├── StoryProgress.tsx
│   │   └── StoryScene.tsx
│   └── quiz/
│       ├── QuizCard.tsx
│       └── QuizResult.tsx
│
├── lib/
│   ├── ai/
│   │   ├── prompt.ts
│   │   ├── context.ts
│   │   └── safety.ts
│   ├── memory/
│   │   └── sessionMemory.ts
│   └── content/
│       ├── onam.ts
│       ├── mahabali.ts
│       ├── vamanan.ts
│       └── kerala.ts
│
├── public/
│   ├── images/
│   └── icons/
│
├── knowledge/
│   ├── onam.md
│   ├── mahabali.md
│   ├── vamanan.md
│   ├── pookalam.md
│   ├── sadya.md
│   ├── vallam-kali.md
│   └── kerala-culture.md
│
├── README.md
├── design.md
├── prd.md
├── stitch-prompts.md
└── .env.example
```

---

# 4. The character engine

This is the highest-priority engineering task.

## Character identity

Vamanan should have:

- warmth;
- playfulness;
- intelligence;
- confidence;
- gentle mischief;
- storyteller energy;
- cultural grounding.

Do not force every sentence to contain Malayalam or mythological references. That becomes artificial.

## System prompt structure

Use a layered prompt:

```text
1. Identity
2. Personality
3. Voice
4. Cultural knowledge
5. Behavioral rules
6. Conversation memory
7. Current mode
8. User request
```

Example core prompt:

```text
You are Vamanan, a character inspired by the Vamana tradition and the
Kerala Onam cultural story.

Your job is to create an engaging, respectful, culturally grounded
conversation in Vamanan's voice.

PERSONALITY:
- playful
- clever
- warm
- curious
- confident
- poetic when telling stories
- lightly mischievous

VOICE:
- natural conversational English by default
- use Malayalam naturally when the user asks for it or when it improves
  authenticity
- do not overuse Malayalam
- do not sound like a textbook
- do not sound like a generic AI assistant

CHARACTER RULES:
- stay in character as Vamanan
- answer directly before adding flourish
- use storytelling when appropriate
- ask occasional follow-up questions
- remember lightweight details supplied during the session
- never claim to be a real divine being in the physical world
- never pretend to have experiences outside the conversation

CULTURAL RULES:
- prioritize accurate information
- distinguish traditional belief, folklore, and historical fact when the
  distinction matters
- avoid inventing rituals, quotations, or historical claims
- never disrespect Kerala traditions

INTERACTION MODES:
CHAT = normal Vamanan conversation
STORY = structured storytelling
QUIZ = quizmaster
MALAYALAM = Malayalam-first conversation
DISCOVER = short cultural facts and interactive exploration
```

---

# 5. Memory design

You do not need a complex database for the first version.

Store:

```ts
type SessionMemory = {
  name?: string;
  interests: string[];
  languagePreference?: "english" | "malayalam" | "mixed";
  quizScore?: number;
  previousTopics: string[];
};
```

Example:

```text
Vamanan: What shall I call you?

User: Anson.

Memory:
name = Anson
```

Later:

```text
Vamanan:
Anson, since you enjoy building things, shall I give you a rather
different challenge?
```

Memory should make the conversation feel continuous, not invasive.

---

# 6. Knowledge base

Start with a curated set of small documents.

## onam.md

Include:
- what Onam is;
- common traditions;
- celebration context;
- important terminology;
- regional variation;
- food and family/community aspects.

## mahabali.md

Include:
- the traditional Mahabali narrative;
- relationship to Onam;
- important story beats;
- distinctions between mythology, tradition, and historical claims.

## vamanan.md

Include:
- Vamana in the relevant traditional context;
- relationship to Mahabali;
- vocabulary and terminology.

## pookalam.md

Include:
- meaning;
- common practice;
- flowers;
- cultural significance;
- variation in designs.

## sadya.md

Include:
- what a sadya is;
- serving tradition;
- common dishes;
- cultural context.

## vallam-kali.md

Include:
- what it is;
- cultural significance;
- basic terminology.

Don't dump the entire internet into the model. A small, curated knowledge base is easier to verify.

---

# 7. Chat flow

## First visit

```text
Hero
  ↓
Meet Vamanan
  ↓
Vamanan asks user's name
  ↓
User enters name
  ↓
Chat opens
```

## Returning in same browser session

```text
Hero
  ↓
Continue Journey
  ↓
Chat restored
```

## Empty chat

Show 4–6 action chips:

```text
Tell me the story of Mahabali
Teach me about Onam
Quiz me
Speak to me in Malayalam
Surprise me
```

---

# 8. Story mode

Story mode should not be one huge paragraph.

Use scenes.

```text
Scene 1 — The King
Scene 2 — The Promise
Scene 3 — The Three Steps
Scene 4 — The Moment
Scene 5 — What Onam Remembers
```

UI:

```text
[← previous]     03 / 05     [next →]

           Scene title

       Vamanan illustration

       Story paragraph

     ● ● ● ○ ○
```

Each scene should have:
- short text;
- one visual;
- one optional interaction;
- progress indicator.

---

# 9. Quiz mode

MVP:
- 8–10 questions;
- one question per screen;
- 4 choices;
- immediate feedback;
- final score;
- Vamanan reaction.

Example final:

```text
8 / 10

Vamanan:
"Ah, not bad. You have been paying attention."

[Return to Vamanan]
```

The score should not dominate the product. It is an interaction loop, not the main purpose.

---

# 10. Malayalam mode

Three useful controls:

```text
English
Malayalam
Mixed
```

Use actual language preference in the prompt.

Do not randomly inject Malayalam just to make the interface look culturally themed.

---

# 11. UI states you must design

Do not only design the “happy path”.

Design:

1. Initial loading
2. AI thinking
3. AI response
4. Empty chat
5. Long response
6. Error
7. Offline/network failure
8. Quiz correct
9. Quiz incorrect
10. Quiz completed
11. Story loading
12. Story completed
13. Mobile layout
14. Reduced motion

---

# 12. Visual system

Suggested aesthetic:

```text
Mood:
Warm Kerala festival + contemporary digital product

Base:
Warm ivory / off-white

Primary:
Deep forest green

Accent:
Muted marigold / turmeric yellow

Secondary accent:
Festival coral/red

Ink:
Deep charcoal / near-black

Surfaces:
Warm paper-like whites with subtle texture
```

Use color intentionally.

Avoid:
- excessive gradients;
- neon colors;
- generic “AI purple”;
- excessive glassmorphism;
- huge shadows;
- too many decorative elements.

The interface should feel rooted in Kerala without becoming visually noisy.

---

# 13. Typography

Use a modern sans-serif for UI.

Add one display serif/characterful face for:
- Vamanan GPT;
- story titles;
- major section headings.

Do not use decorative type everywhere.

Recommended hierarchy:

```text
Display       56–72 px
H1            40–56 px
H2            28–36 px
Body          16–18 px
Secondary     14 px
Caption       12–13 px
```

Adjust responsively.

---

# 14. Animation

Animation should communicate state, not decorate everything.

Good:
- Vamanan subtle breathing/idle motion;
- message reveal;
- story scene transitions;
- quiz answer feedback;
- floating flower/mandala details.

Bad:
- continuous parallax everywhere;
- huge entrance animations;
- moving backgrounds behind text;
- slow transitions that make the app feel sluggish.

Target transition timing:

```text
Micro interaction   120–180 ms
Standard            180–280 ms
Scene transition    300–500 ms
```

Support `prefers-reduced-motion`.

---

# 15. Accessibility

Minimum:

- keyboard navigation;
- visible focus states;
- readable contrast;
- semantic buttons;
- labels for icon buttons;
- alternative text for meaningful images;
- large enough touch targets;
- reduced motion support;
- screen-reader-friendly chat updates.

---

# 16. Build order

## Phase 1 — Foundation

1. Create project
2. Install styling/component system
3. Create base layout
4. Add fonts
5. Set design tokens
6. Create navigation
7. Build responsive shell

## Phase 2 — Vamanan

1. Avatar
2. Greeting
3. Chat window
4. Message components
5. Input
6. Loading state
7. Error state

## Phase 3 — AI

1. Server-side API route
2. Character prompt
3. User message handling
4. Context assembly
5. Session memory
6. Error fallback
7. Rate-limit/basic abuse protection as appropriate

Never expose the model API key in client-side code.

## Phase 4 — Signature experiences

1. Story mode
2. Quiz
3. Malayalam mode
4. Suggested prompts

## Phase 5 — Polish

1. Animation
2. Empty states
3. Responsive fixes
4. Accessibility
5. Performance
6. Copywriting
7. Favicon/metadata
8. 404 page

## Phase 6 — Submission

1. Production deploy
2. Test on desktop
3. Test on mobile
4. Test network failure
5. Test API failure
6. Verify repository
7. Add README screenshots
8. Record 60–90 second demo
9. Verify final URL
10. Submit live link + GitHub repo

---

# 17. Testing checklist

## Character tests

Ask:

```text
Who are you?
Tell me about Mahabali.
Why is Onam celebrated?
What is a pookalam?
Speak Malayalam.
Tell me something funny.
Give me a normal technical answer.
```

The last test is important: Vamanan should remain Vamanan even when the question is unexpected.

## Hallucination tests

Ask:
- obscure historical questions;
- fake rituals;
- fake quotations;
- made-up dates.

The system should avoid confidently inventing cultural facts.

## UI tests

Check:
- 360px mobile width;
- tablet;
- laptop;
- large desktop;
- long messages;
- empty state;
- failed requests;
- keyboard-only navigation.

---

# 18. Demo script

Aim for 60–90 seconds.

```text
00:00 — Open landing page
00:08 — Click “Meet Vamanan”
00:15 — Give name
00:20 — Ask “Why do people celebrate Onam?”
00:32 — Click “Tell me the story”
00:45 — Show animated story transition
00:55 — Click “Quiz me”
01:05 — Answer two questions
01:15 — Show result + Vamanan reaction
01:25 — End
```

The judge should see:
- character;
- culture;
- AI;
- interaction;
- visual polish;
- originality.

---

# 19. Deployment checklist

Before submitting:

```text
[ ] Production URL opens
[ ] No API keys in GitHub
[ ] .env.example exists
[ ] Mobile layout works
[ ] Chat works
[ ] Story works
[ ] Quiz works
[ ] Malayalam mode works
[ ] Loading states work
[ ] Error states work
[ ] README has live link
[ ] README has screenshots
[ ] README explains architecture
[ ] Git history is clean enough to inspect
```

---

# 20. Judge-oriented quality rubric

Use this internally:

| Area | Target |
|---|---:|
| Character authenticity | 10/10 |
| Cultural depth | 10/10 |
| AI response quality | 10/10 |
| Original interaction | 9/10 |
| Visual design | 9/10 |
| UX clarity | 9/10 |
| Reliability | 10/10 |
| Mobile quality | 8/10 |
| Accessibility | 8/10 |
| Repository quality | 8/10 |

The objective is not to maximize features. It is to maximize **quality per feature**.

---

# 21. Final implementation principle

Build the smallest system that makes Vamanan feel alive.

A beautiful landing page with a weak chatbot loses.

A technically complex backend with a boring experience loses.

A focused product with:
- excellent character,
- culturally grounded answers,
- one memorable story mode,
- one good quiz,
- polished UI,
- and a flawless demo

has a much stronger chance of standing out.
