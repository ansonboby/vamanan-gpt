/**
 * Design tokens for the demo video — mirrors app/globals.css exactly.
 */
export const C = {
  background: "#f6f1e7",
  surface: "#fffdf8",
  surfaceMuted: "#eee7d9",
  ink: "#161616",
  inkMuted: "#6e695f",
  forest: "#163b32",
  forestSoft: "#e1ece7",
  marigold: "#e8b84b",
  marigoldSoft: "#f7eac2",
  coral: "#d85d4e",
  coralSoft: "#f5d9d4",
  line: "#ddd5c6",
  paperOnForest: "#F6F1E7",
} as const;

export const FONT_DISPLAY = "Fraunces, Georgia, serif";
export const FONT_SANS = "Inter, system-ui, sans-serif";

/** Standard ease used across the app UI. */
export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** frame helpers */
export const fps = 30;
export const s = (seconds: number) => Math.round(seconds * fps);
