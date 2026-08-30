import type { Metadata } from "next";
import { SiteNav } from "@/components/SiteNav";
import { QuizMode } from "@/components/quiz/QuizMode";

export const metadata: Metadata = {
  title: "Vamanan's Challenge — Vamanan GPT",
};

export default function QuizPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteNav />
      <main className="paper-texture relative flex-1">
        <QuizMode />
      </main>
    </div>
  );
}
