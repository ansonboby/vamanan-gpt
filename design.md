# Vamanan GPT — Design System & UI Specification

## 1. Design direction

### Concept

**“A living Onam story, brought into the modern world.”**

The design should combine:
- Kerala festival warmth;
- storytelling;
- modern AI interaction;
- tactile, almost paper-like visual materials;
- restrained motion.

It should feel **crafted**, not like a template.

### Keywords

```text
Warm
Human
Cultural
Playful
Story-driven
Modern
Editorial
Tactile
Elegant
Interactive
```

---

# 2. Brand personality

Vamanan GPT is:

- clever, not childish;
- playful, not silly;
- traditional, not old-fashioned;
- modern, not sterile;
- welcoming, not noisy.

Avoid:
- generic chatbot aesthetics;
- futuristic neon;
- sci-fi dashboards;
- excessive gold;
- excessive lotus/temple clip-art;
- cartoon overload.

---

# 3. Color tokens

Use CSS variables.

```css
:root {
  --background: #F6F1E7;
  --surface: #FFFDF8;
  --surface-muted: #EEE7D9;

  --ink: #161616;
  --ink-muted: #6E695F;

  --forest: #163B32;
  --forest-soft: #E1ECE7;

  --marigold: #E8B84B;
  --marigold-soft: #F7EAC2;

  --coral: #D85D4E;
  --coral-soft: #F5D9D4;

  --line: #DDD5C6;
}
```

These are starting values, not mandatory final values.

---

# 4. Background treatment

Main background:

```text
warm ivory
+
extremely subtle grid/paper grain
+
occasional floral/mandala geometry
```

The texture must remain behind content and never reduce readability.

Keep decoration near the edges.

---

# 5. Typography

### UI font

Use a clean contemporary sans-serif.

Purpose:
- navigation;
- body;
- buttons;
- form fields;
- metadata.

### Display font

Use a high-quality serif/editorial face.

Purpose:
- logo;
- story titles;
- hero headings;
- quote moments.

Rule:

> Display typography creates atmosphere. UI typography preserves usability.

---

# 6. Spacing

Use an 8-point base system.

```text
4   micro
8   tight
12  compact
16  standard
24  comfortable
32  section
48  major section
64  hero spacing
96  large editorial spacing
```

---

# 7. Radius

Use a restrained radius system.

```text
sm   8px
md   12px
lg   18px
xl   24px
pill 999px
```

Use larger radii for:
- major interactive cards;
- chat shell;
- story panels.

Avoid putting every element in a rounded rectangle.

---

# 8. Shadows

Use soft, low-contrast shadows only.

Preferred:

```css
box-shadow:
  0 10px 30px rgba(22, 22, 22, 0.06);
```

Avoid heavy shadows.

---

# 9. Global navigation

Desktop:

```text
┌────────────────────────────────────────────────────────────┐
│ VAMANAN GPT     Explore   Story   Quiz   About     Meet ↗ │
└────────────────────────────────────────────────────────────┘
```

Mobile:

```text
┌─────────────────────────────┐
│ VAMANAN       ☰             │
└─────────────────────────────┘
```

Navigation should remain quiet.

---

# 10. Landing page

## Hero

Layout:

```text
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  small eyebrow                                               │
│  A story from Kerala, reimagined with AI                    │
│                                                              │
│  Meet Vamanan.                                               │
│  Ask. Listen. Explore.                                       │
│                                                              │
│  short paragraph                                             │
│                                                              │
│  [ Meet Vamanan ]  [ Explore Onam ]                         │
│                                                              │
│                            Vamanan illustration               │
│                            + floral geometry                  │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

Hero should not look like a generic SaaS product.

---

# 11. Chat screen

Desktop:

```text
┌──────────────────────────────────────────────────────────────┐
│ ← Home                         VANAMAN                      ⋯ │
├───────────────────────┬──────────────────────────────────────┤
│                       │                                      │
│   Vamanan presence    │  CHAT                                │
│                       │                                      │
│   illustration        │  Vamanan message                     │
│                       │                                      │
│   “Ask me about       │                User message          │
│    Onam…”             │                                      │
│                       │  Vamanan message                     │
│                       │                                      │
│                       │                                      │
│                       │  [prompt chips]                      │
│                       │                                      │
│                       │  ┌────────────────────────────────┐  │
│                       │  │ Ask Vamanan...                 │  │
│                       │  └────────────────────────────────┘  │
└───────────────────────┴──────────────────────────────────────┘
```

Mobile:

```text
┌──────────────────────────┐
│ ←  Vamanan          ⋯    │
├──────────────────────────┤
│                          │
│   message                │
│                 message  │
│                          │
│   message                │
│                          │
│  [Story] [Quiz] [Malay.] │
│                          │
├──────────────────────────┤
│ Ask Vamanan...       ↑   │
└──────────────────────────┘
```

---

# 12. Chat message design

### Vamanan

Use:
- small avatar;
- name;
- message;
- optional cultural annotation/card;
- subtle reveal.

### User

Use a simpler message treatment.

The Vamanan message should visually feel like the primary voice.

Do not create giant speech bubbles for every message.

---

# 13. Prompt chips

Use chips for discovery:

```text
Tell me the Mahabali story
Why is Onam celebrated?
Teach me Malayalam
Quiz me
Surprise me
```

They should disappear or condense after the conversation becomes active.

---

# 14. Story mode

Visual concept:

```text
┌──────────────────────────────────────────────────────────┐
│  STORY OF MAHABALI                               03/05   │
│                                                          │
│                 large scene artwork                      │
│                                                          │
│              THE THREE STEPS                             │
│                                                          │
│  story paragraph                                         │
│                                                          │
│  ● ● ● ○ ○                                               │
│                                                          │
│      [ ← ]                                  [ → ]         │
└──────────────────────────────────────────────────────────┘
```

The visual should feel like an editorial storybook rather than a game UI.

---

# 15. Quiz mode

```text
┌─────────────────────────────────────────┐
│ VAMANAN'S CHALLENGE             04/10   │
│                                         │
│ Which of these is associated with       │
│ Onam celebrations?                       │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ Pookalam                            │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ Option B                            │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ Option C                            │ │
│ └─────────────────────────────────────┘ │
│                                         │
└─────────────────────────────────────────┘
```

After answering, use immediate but restrained feedback.

---

# 16. Vamanan presence

The avatar should not dominate every page.

States:

```text
idle
thinking
speaking
celebrating
storytelling
quiz
```

Motion:
- tiny breathing/idle movement;
- expression change where appropriate;
- no distracting bouncing.

---

# 17. Cultural visual language

Use subtle cues:

- pookalam-inspired geometry;
- banana-leaf shapes;
- hand-drawn floral marks;
- warm paper textures;
- restrained festival motifs.

Avoid decorative clichés everywhere.

A single strong motif used consistently is better than 20 unrelated motifs.

---

# 18. Components

## Button

Primary:
```text
dark forest fill
warm text
```

Secondary:
```text
transparent/ivory
dark border
```

Accent:
```text
marigold
dark ink
```

## Card

```text
warm surface
subtle border
soft radius
very light shadow
```

## Input

Large, comfortable:

```text
height: 56–64px
```

On mobile it should remain thumb-friendly.

---

# 19. Responsive rules

### Mobile

- single column;
- sticky chat input;
- compressed navigation;
- story artwork becomes portrait/stacked;
- decorative elements reduced;
- no horizontal scrolling.

### Tablet

- hybrid layout;
- moderate side panel;
- preserve story visual.

### Desktop

- two-column chat layout;
- large editorial hero;
- persistent Vamanan presence.

---

# 20. Accessibility

Required:
- visible keyboard focus;
- semantic buttons;
- correct heading order;
- accessible chat updates;
- sufficient contrast;
- reduced-motion support;
- no information conveyed through color alone.

---

# 21. Microcopy

Prefer:

```text
Meet Vamanan
Begin the story
Ask Vamanan
Tell me more
Quiz me
Take me somewhere unexpected
```

Avoid:

```text
Initialize chatbot
Generate response
Submit query
Execute
AI Assistant
```

---

# 22. Empty states

Chat:

> “The story begins with a question.”

Then chips.

Story:

> “Every story has a first step.”

Quiz:

> “Let us see how much of Kerala you remember.”

---

# 23. Error states

Never show raw API errors.

Use:

> “The winds are a little restless. Try that again.”

Button:

> Try again

Keep the cause technically logged for developers.

---

# 24. Design acceptance test

The UI is ready when:

- the product is recognizable without the logo;
- the chat feels like a character interaction;
- story and quiz are clearly distinct modes;
- mobile is not an afterthought;
- visual hierarchy is obvious within 3 seconds;
- no component feels like generic SaaS UI pasted into an Onam theme.
