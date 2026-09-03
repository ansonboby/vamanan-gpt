/**
 * Scene script — timings in frames @30fps.
 * All Vamanan reply text is REAL, captured from the live API
 * (see commit message / capture notes). Nothing is fabricated.
 */
import { s } from "./tokens";

/* Real replies captured from https://vamanan-gpt.vercel.app/api/chat (Gemini) */
export const REAL_REPLIES = {
  onamWhy:
    "Namaskaram, Anson! It's a pleasure to meet you.\n\nOnam is celebrated to welcome King Mahabali, our beloved ancient ruler, who returns once a year to visit his people and see how they are doing. It's a joyful remembrance of a golden age, and a way to honour his kindness.",
  welcomeBack:
    "Namaskaram, Anson! Welcome back to my little corner of Kerala. The kettle is on, the stories are in order. Where shall we wander today?",
};

/* Story scene 3 — the actual app text, abridged for the video */
export const STORY_BEAT = {
  title: "The Three Steps",
  number: "03",
  text: "Then the boy began to grow. And grow. And grow — until he filled the sky… One step covered the whole earth. The second step spanned the heavens. The king, who kept his word even when it cost him the world, bowed his head and offered the only ground he had left: himself.",
};

/* Real quiz question from the app */
export const QUIZ_BEAT = {
  question: "Onam is the annual festival of which Indian state?",
  options: ["Tamil Nadu", "Kerala", "Karnataka", "Andhra Pradesh"],
  correct: 1,
  verdict: "A fine start. Kerala it is — where the king still comes home.",
};

export const T = {
  // act 1 — cold open
  intro: { start: 0, dur: s(5) },
  // act 2 — chat demo (greeting types 0.3–4.8s, user 5.2s, reply 7s → 15s, hold to 18s)
  chat: { start: s(5), dur: s(18) },
  // act 3 — pookalam
  pookalam: { start: s(23), dur: s(10) },
  // act 4 — story
  story: { start: s(33), dur: s(9) },
  // act 5 — quiz
  quiz: { start: s(42), dur: s(9) },
  // act 6 — malayalam + memory (switch 0–6.5s, back 6.5–16s)
  language: { start: s(51), dur: s(16) },
  // act 7 — montage
  montage: { start: s(67), dur: s(7) },
  // act 8 — end card
  end: { start: s(74), dur: s(7) },
  total: s(81),
};
