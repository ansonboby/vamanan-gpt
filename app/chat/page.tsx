import type { Metadata } from "next";
import { SiteNav } from "@/components/SiteNav";
import { ChatWindow } from "@/components/chat/ChatWindow";

export const metadata: Metadata = {
  title: "Talk to Vamanan — Vamanan GPT",
};

export default function ChatPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteNav />
      <main className="paper-texture relative flex-1">
        <ChatWindow />
      </main>
    </div>
  );
}
