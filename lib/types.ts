export type LanguageMode = "english" | "malayalam" | "mixed";

export type InteractionMode = "chat" | "story" | "quiz" | "malayalam" | "discover";

export interface SessionMemory {
  name?: string;
  language: LanguageMode;
  interests: string[];
  previousTopics: string[];
  quizScore?: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "vamanan";
  text: string;
  /** Optional cultural annotation card shown under a Vamanan message */
  annotation?: { label: string; text: string };
  failed?: boolean;
  /** Reasoning steps Vamanan "showed" before this reply (Claude-style trace) */
  thinking?: string[];
  /** How long the reply took, in ms — powers the "Thought for Ns" chip */
  thinkingMs?: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

export interface StoryScene {
  id: string;
  number: string;
  title: string;
  text: string;
  caption?: string;
}

export function defaultMemory(): SessionMemory {
  return {
    language: "english",
    interests: [],
    previousTopics: [],
  };
}
