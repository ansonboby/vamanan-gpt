# Vamanan GPT — Google Stitch Prompt Pack

## How to use this document

Use Google Stitch to generate the UI from the prompts below.

Stitch can generate UI from natural-language descriptions and image inputs, and it supports conversational iteration and exporting/passing designs into development workflows. Use that iterative loop: generate the main screen, critique it, then refine spacing, typography, hierarchy, responsive behavior, and component consistency rather than trying to perfect everything in one prompt.

Recommended workflow:

```text
Prompt 01 → Homepage
Prompt 02 → Chat
Prompt 03 → Story
Prompt 04 → Quiz
Prompt 05 → Mobile
Prompt 06 → Design system refinement
Prompt 07 → Accessibility refinement
Prompt 08 → Final consistency pass
```

---

# Prompt 01 — Main visual direction

```text
Design a premium responsive web app called “Vamanan GPT”.

Concept:
A modern interactive AI experience that brings Vamanan from the Onam cultural
tradition into a contemporary digital experience.

The design should feel like:
warm Kerala festival culture + editorial storytelling + modern AI product design.

Visual mood:
warm, human, intelligent, playful, culturally grounded, elegant, tactile.

Do NOT make it look like a generic SaaS dashboard.
Do NOT use futuristic neon AI visuals.
Do NOT use excessive glassmorphism.
Do NOT fill every area with cultural decorations.

Use a warm ivory paper-like base, deep forest green for primary actions,
muted marigold/yellow as an accent, and restrained coral as a secondary accent.
Use near-black charcoal for text.

Typography:
modern clean sans-serif for UI text,
editorial serif/display typography for major headings.

Use subtle pookalam-inspired geometry and floral details as edge decoration.
Keep the central content extremely readable.

Create:
- desktop layout
- tablet adaptation
- mobile adaptation

The visual hierarchy must be obvious within 3 seconds.
```

---

# Prompt 02 — Homepage

```text
Design the Vamanan GPT landing page.

Hero section:
- small editorial eyebrow
- large headline: “Meet Vamanan.”
- supporting line about asking, listening, and exploring
- primary CTA: “Meet Vamanan”
- secondary CTA: “Explore Onam”
- large elegant Vamanan character illustration on the right
- subtle pookalam-inspired decorative geometry around the illustration

Below the hero:
a horizontal/stacked “Choose your path” section with three large cards:
1. Talk to Vamanan
2. Hear the Story of Mahabali
3. Take the Onam Challenge

Add a smaller cultural exploration section:
- Pookalam
- Sadya
- Vallam Kali
- Malayalam

Use generous editorial whitespace.
Avoid excessive rounded cards.
Cards should feel tactile and premium.

The interface should feel like a cultural storybook redesigned as a modern
interactive product.
```

---

# Prompt 03 — Chat interface

```text
Design the main Vamanan GPT chat interface.

Desktop:
Use a two-column composition.

Left column:
- Vamanan illustration/presence
- small status label such as “Ready to talk”
- short character introduction
- three compact action controls:
  “Story”
  “Quiz”
  “Malayalam”

Right column:
- chat header with “Vamanan”
- conversation area
- Vamanan messages
- user messages
- suggested prompt chips
- large bottom input area with send button

Important:
Vamanan messages should have more visual personality than user messages.
Do not use a generic ChatGPT clone layout.

Empty state:
Display:
“The story begins with a question.”

Suggested prompts:
“Tell me the Mahabali story”
“Why do people celebrate Onam?”
“Teach me a Malayalam word”
“Quiz me”
“Surprise me”

Use warm ivory surfaces, forest green accents, charcoal text,
and subtle marigold details.

Include states for:
- loading/thinking
- long response
- error
- empty conversation
```

---

# Prompt 04 — Story mode

```text
Design an immersive “Story of Mahabali” experience for Vamanan GPT.

This should look like a digital editorial storybook, not a game dashboard.

Layout:
- top-left: back button
- top-center: “Story of Mahabali”
- top-right: “03 / 05”
- large central illustration area
- scene title
- story text in comfortable reading width
- progress dots
- previous and next controls

Create visual hierarchy for:
Scene 1 — The King
Scene 2 — The Promise
Scene 3 — The Three Steps
Scene 4 — The Moment
Scene 5 — What Onam Remembers

Use warm paper texture, forest green, muted marigold,
and subtle pookalam geometry.

Add gentle scene transitions and a clear completed-story state.

Do not overwhelm the text with decoration.
```

---

# Prompt 05 — Quiz

```text
Design “Vamanan’s Challenge”, an Onam cultural quiz.

Create:
- quiz title
- progress indicator such as 04 / 10
- one question per screen
- four large answer choices
- immediate correct/incorrect feedback
- final score screen

Visual tone:
playful but elegant, culturally rooted, not childish.

After the final result, create a Vamanan reaction area with:
- score
- short personalized message
- “Talk to Vamanan”
- “Play Again”

Use the same design language as the homepage and chat.
```

---

# Prompt 06 — Mobile-first refinement

```text
Refine the entire Vamanan GPT product for mobile.

Target narrow phone widths.

Requirements:
- compact top navigation
- single-column layout
- sticky bottom chat input
- touch-friendly buttons
- large readable type
- no horizontal scrolling
- decorative elements reduced rather than simply hidden
- story images become portrait-friendly
- quiz choices remain comfortable for thumbs
- preserve the premium editorial feel

Prioritize usability over decorative density.
```

---

# Prompt 07 — Visual design system

```text
Create a consistent design system for Vamanan GPT based on the existing screens.

Define:
- color tokens
- type scale
- spacing scale
- button variants
- card variants
- input styles
- badges/chips
- navigation
- message styles
- progress indicators
- icon treatment
- focus states
- disabled states
- loading states
- error states

Use:
warm ivory background
deep forest green
muted marigold
restrained coral
charcoal text

Keep the system editorial and modern.
Avoid generic AI design patterns.
```

---

# Prompt 08 — Character presence

```text
Improve the Vamanan character presence across the application.

Vamanan should feel like a recurring character, not decorative clip art.

Create subtle states for:
- idle
- speaking
- thinking
- storytelling
- celebrating

Use restrained motion:
small breathing movement,
subtle expression changes,
gentle transition between states.

The character should support the interaction without dominating the interface.

Keep the visual representation respectful and culturally appropriate.
```

---

# Prompt 09 — Empty, loading, error states

```text
Create polished UI states for Vamanan GPT.

Empty chat:
“The story begins with a question.”

Loading:
Vamanan appears to be thinking, with a subtle animated indicator.

Error:
“The winds are a little restless. Try that again.”

Story loading:
show scene placeholder and progress.

Quiz completion:
show score and Vamanan reaction.

Ensure all states are visually consistent with the core design.
```

---

# Prompt 10 — Accessibility pass

```text
Audit and refine the Vamanan GPT UI for accessibility.

Improve:
- text contrast
- keyboard focus
- button labels
- heading hierarchy
- touch target sizes
- readable line lengths
- reduced-motion option
- accessible chat updates
- status messaging
- color-independent feedback

Do not make the design visually dull.
Preserve the existing cultural/editorial design.
```

---

# Prompt 11 — Final polish

```text
Review the entire Vamanan GPT interface as a senior product designer.

Find and fix:
- inconsistent spacing
- unnecessary cards
- weak hierarchy
- generic AI patterns
- excessive decoration
- inconsistent button sizes
- weak mobile behavior
- typography inconsistencies
- poor visual rhythm

The final experience should feel like a competition-ready product.

The first impression should communicate:
Vamanan + Kerala + Onam + AI + storytelling

without needing a long explanation.
```

---

# Prompt 12 — If using the supplied reference screenshot

```text
Use the uploaded reference screenshot only as a visual-quality reference for
layout density, whitespace, navigation simplicity, and editorial card treatment.

Do NOT copy its branding, wording, assets, or exact layout.

Create a new Vamanan GPT visual identity:
warm Kerala festival palette,
editorial typography,
Vamanan character presence,
storytelling,
interactive cultural exploration,
modern responsive web UI.

Keep the interface original.
```

---

# Stitch iteration checklist

After each generation, inspect:

```text
[ ] Is the hierarchy obvious?
[ ] Does it look like a generic AI app?
[ ] Is there too much decoration?
[ ] Is the Vamanan character integrated into the UX?
[ ] Does mobile still work?
[ ] Are buttons large enough?
[ ] Is the typography readable?
[ ] Are the colors culturally suggestive without becoming cliché?
[ ] Do story and quiz look like parts of the same product?
[ ] Does the design feel finished rather than AI-generated?
```

---

# Important implementation note

Treat Stitch output as a design accelerator, not as the final product architecture.

After exporting/bringing the design into code:
- clean component structure;
- replace placeholders;
- connect real interactions;
- wire the actual AI API;
- test responsive behavior;
- test accessibility;
- test failures and loading states.
