# Vamanan GPT — Product Requirements Document

## 1. Product summary

**Product:** Vamanan GPT

**One-line description:**

> An interactive AI experience that brings Vamanan to life through Onam storytelling, Kerala culture, conversation, and playful exploration.

---

# 2. Problem

A generic AI chatbot can answer questions about Onam, but it does not automatically create a convincing cultural character or memorable experience.

The product should close that gap by combining:
- character-driven AI;
- cultural knowledge;
- storytelling;
- interactive learning;
- polished visual design.

---

# 3. Goals

## Primary goals

1. Make users feel like they are speaking with Vamanan.
2. Make Onam and Kerala culture central to the experience.
3. Create at least one memorable interaction beyond ordinary chat.
4. Be usable immediately without an account.
5. Work on desktop and mobile.
6. Be reliably hosted and easy to demo.
7. Provide a clear GitHub/code artifact.

## Secondary goals

1. Encourage exploration.
2. Teach cultural concepts without sounding like a textbook.
3. Demonstrate thoughtful use of AI.

---

# 4. Non-goals

Not required for the first release:

- social networking;
- payments;
- complex user profiles;
- public chat rooms;
- enterprise administration;
- advanced analytics;
- large-scale recommendation engine.

---

# 5. Target users

## Primary

People participating in or viewing the event who want:
- a fun cultural AI experience;
- a quick Onam story;
- an interactive chatbot;
- something visually engaging.

## Secondary

Judges/organizers evaluating:
- creativity;
- cultural relevance;
- technical implementation;
- polish;
- originality.

---

# 6. Core user journeys

## Journey A — First conversation

```text
Open website
→ Meet Vamanan
→ Enter name
→ Ask a question
→ Receive in-character answer
→ Continue conversation
```

Success condition:
The user immediately recognizes that Vamanan is a character.

---

## Journey B — Mahabali story

```text
Open website
→ Meet Vamanan
→ “Tell me the story”
→ Story mode
→ 5 scenes
→ Complete story
→ Return to chat
```

Success condition:
The user completes the story without confusion or excessive reading friction.

---

## Journey C — Quiz

```text
Open website
→ Quiz me
→ answer 8–10 questions
→ receive score
→ Vamanan reacts
→ continue exploring
```

Success condition:
The quiz is easy to understand and feels like part of the Vamanan world.

---

## Journey D — Malayalam

```text
Open chat
→ choose Malayalam
→ Vamanan responds in Malayalam
→ switch back
```

Success condition:
Language switching feels immediate and natural.

---

# 7. Feature requirements

## FR-01 Landing page

The landing page MUST:
- explain the concept within one viewport;
- provide a clear primary CTA;
- show Vamanan;
- expose at least 3 ways to interact.

## FR-02 Character chat

The chatbot MUST:
- accept free-form messages;
- maintain conversational context;
- answer in Vamanan's voice;
- support suggested prompts;
- show loading state;
- show usable error state.

## FR-03 Character fidelity

The AI MUST:
- remain in character;
- avoid generic “I am an AI assistant” behavior;
- use appropriate storytelling;
- avoid fabricated cultural facts.

## FR-04 Cultural knowledge

The app MUST include grounded knowledge for:
- Onam;
- Mahabali;
- Vamana/Vamanan context;
- pookalam;
- sadya;
- vallam-kali;
- related Kerala cultural topics.

## FR-05 Story mode

The app MUST:
- have multiple scenes;
- show progress;
- allow previous/next navigation;
- preserve a coherent story.

## FR-06 Quiz

The app MUST:
- show one question at a time;
- provide 4 choices;
- provide immediate feedback;
- calculate a score;
- provide completion feedback.

## FR-07 Language mode

The app SHOULD provide:
- English;
- Malayalam;
- mixed mode.

## FR-08 Memory

The app MAY persist lightweight session data:
- name;
- language preference;
- interests;
- recent topics;
- quiz score.

No unnecessary sensitive data collection.

## FR-09 Responsive design

The app MUST work on:
- mobile;
- tablet;
- desktop.

## FR-10 Deployment

The app MUST:
- run from a stable public URL;
- protect API secrets;
- provide a production-safe error path.

---

# 8. UX requirements

## First 10 seconds

The user should understand:
1. this is Vamanan;
2. this is interactive;
3. they can start immediately.

## First 60 seconds

The user should encounter:
- character;
- cultural knowledge;
- at least one interactive mode.

---

# 9. AI requirements

## Context assembly

Build model input using:

```text
SYSTEM CHARACTER
+
CULTURAL CONTEXT
+
SESSION MEMORY
+
CURRENT MODE
+
RECENT MESSAGES
+
USER MESSAGE
```

## Response rules

Responses should:
- answer the actual question;
- stay concise unless storytelling is requested;
- be culturally respectful;
- avoid fake certainty;
- avoid unnecessary repetition;
- occasionally invite continuation.

---

# 10. Data model

Minimal session state:

```ts
interface SessionMemory {
  name?: string;
  language: "english" | "malayalam" | "mixed";
  interests: string[];
  previousTopics: string[];
  quizScore?: number;
}
```

Quiz:

```ts
interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}
```

Story:

```ts
interface StoryScene {
  id: string;
  title: string;
  text: string;
  image: string;
  nextId?: string;
}
```

---

# 11. Non-functional requirements

## Performance

- landing page should feel immediate;
- avoid giant media files;
- lazy-load story imagery where reasonable;
- keep animations lightweight.

## Reliability

- AI failure must not crash the page;
- quiz should work independently from the AI API;
- story mode should be mostly static/content-driven so it remains reliable.

## Security

- never expose provider API keys in client code;
- validate server inputs;
- avoid logging sensitive user content unnecessarily.

## Accessibility

- keyboard support;
- focus states;
- semantic HTML;
- reduced motion;
- screen-reader-compatible controls.

---

# 12. Analytics (optional)

Track only non-sensitive product events, for example:

```text
landing_cta_clicked
chat_started
story_started
story_completed
quiz_started
quiz_completed
language_changed
```

Do not let analytics become a development blocker.

---

# 13. Acceptance criteria

The MVP passes when:

```text
[ ] User can open the homepage
[ ] User can start a conversation
[ ] Vamanan stays in character
[ ] Onam/Mahabali questions receive useful answers
[ ] Story mode works from start to finish
[ ] Quiz works from start to finish
[ ] Malayalam mode works
[ ] Session memory works
[ ] Mobile layout works
[ ] Loading and error states work
[ ] Production URL works
[ ] README explains the project
[ ] GitHub repository is presentable
```

---

# 14. Release plan

## Release 0.1

- landing;
- chat;
- character engine.

## Release 0.2

- story;
- quiz;
- Malayalam.

## Release 0.3

- animation;
- accessibility;
- mobile polish;
- performance.

## Release 1.0

- production deploy;
- demo flow;
- documentation;
- final QA.

---

# 15. Success definition

The strongest signal is not raw feature count.

Success means:

> A first-time user interacts with Vamanan for one minute and voluntarily explores a second feature.
