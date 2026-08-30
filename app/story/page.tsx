import type { Metadata } from "next";
import { SiteNav } from "@/components/SiteNav";
import { StoryMode } from "@/components/story/StoryMode";

export const metadata: Metadata = {
  title: "The Story of Mahabali — Vamanan GPT",
};

export default function StoryPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteNav />
      <main className="paper-texture relative flex-1">
        <StoryMode />
      </main>
    </div>
  );
}
