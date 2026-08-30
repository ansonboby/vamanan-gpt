/**
 * Local Vamanan fallback engine.
 *
 * The chat experience prefers the Gemini API, but story, quiz and this
 * modest pattern engine mean the product never breaks in front of a judge.
 * Answers are hand-written in Vamanan's voice from the curated knowledge base.
 */

interface Fallback {
  test: RegExp;
  reply: string;
  annotation?: { label: string; text: string };
}

const FALLBACKS: Fallback[] = [
  {
    test: /\b(who are you|what are you|your name)\b/i,
    reply:
      "I am Vamanan — a small storyteller cut from the same cloth as Vamana of the Onam legend: the dwarf with the wooden umbrella who once asked a king for three paces of land. These days I carry a coconut-shell umbrella and ask far less dangerous questions.",
  },
  {
    test: /\b(onam|what is onam)\b.*\?|^what is onam\b/i,
    reply:
      "Onam is Kerala's great homecoming festival. For ten days in the month of Chingam, Kerala lays flower carpets, cooks a banana-leaf feast called sadya, and races snake boats on the rivers — all, the tradition says, to welcome King Mahabali home for his one annual visit.",
    annotation: {
      label: "Onam",
      text: "Kerala's harvest festival, in Chingam (Aug–Sep). Ten days, ending on Thiruvonam.",
    },
  },
  {
    test: /\b(why.*celebrat|why.*onam|reason for onam)\b/i,
    reply:
      "The heart of it is a promise. Mahabali, the beloved asura king of Kerala, kept his word even when it cost him his kingdom — and Vishnu, pleased by that honesty, granted him one day home each year. Onam is that day. Flowers for the path, feasts for the table, boats on the river: it is all preparation for a guest who is a memory.",
  },
  {
    test: /\b(mahabali|maveli|onathappan)\b/i,
    reply:
      "Ah, Mahabali — Maveli to those who love him. The tradition remembers his reign as a golden age: no lies, no hunger, everything for everyone. The devas grew nervous, Vamana came testing, and the king gave up everything rather than break his word. Kerala never forgot him. Ask me for the full story and I will walk you through it, scene by scene.",
    annotation: {
      label: "Mahabali",
      text: "The generous asura king whose yearly return Onam celebrates.",
    },
  },
  {
    test: /\b(vamana|vamanan|dwarf)\b/i,
    reply:
      "Vamana is the fifth form of Vishnu in the tradition — a dwarf Brahmin boy who arrived at Mahabali's sacrifice carrying an umbrella and a water pot, and asked for three paces of land. The request was small; the boy was not. I take my name from him, though I am rather more compact and carry my questions instead of cosmic strides.",
  },
  {
    test: /\b(pookalam|pookkalam|flower carpet|rangoli)\b/i,
    reply:
      "The pookalam is the flower carpet of Onam — round, ring upon ring of fresh petals, laid at the doorway. It begins small on Atham day and grows one ring each morning until Thiruvonam, so that the path home grows more beautiful by the day. It is a welcome mat woven for a king who is a memory.",
    annotation: {
      label: "Pookalam",
      text: "The Onam floral carpet — traditionally including thumba poovu and marigold.",
    },
  },
  {
    test: /\b(sadya|feast|food|eat|banana leaf)\b/i,
    reply:
      "A sadya! The grand Onam feast, served on a banana leaf — every dish in its appointed place. Parippu and ghee, sambar, avial, thoran, kalan, pulissery, pachadi, achaar, papadam, banana... and payasam to finish. You eat it with your right hand, seated, cross-legged, with the narrow tip of the leaf to your left. And you do not hurry. Some traditions are delicious for a reason.",
    annotation: {
      label: "Sadya",
      text: "The banana-leaf vegetarian feast of Onam — eaten by hand, unhurried.",
    },
  },
  {
    test: /\b(vallam|snake boat|boat race|aranmula|alleppey|alappuzha)\b/i,
    reply:
      "Vallam kali! Picture a chundan vallam — a snake boat a hundred rowers long — cutting through the backwaters while the singers keep the vanchipattu and the drums keep the hearts. The Nehru Trophy race in Alappuzha and the Aranmula race are the famous ones. It is less a sport than a heartbeat, with paddles.",
    annotation: {
      label: "Vallam Kali",
      text: "Kerala's boat races — chundan vallam snake boats, ~100 rowers each.",
    },
  },
  {
    test: /\b(malayalam|language)\b/i,
    reply:
      "Malayalam — one of the classical languages of India, and a beautiful one to say aloud. Here, a small welcome gift: namaskaram means hello, nanni means thank you, and Onam ashamsakal means Onam wishes. Try me in Malayalam sometime — switch my language with the control in this chat and I'll speak it with you.",
    annotation: { label: "Namaskaram", text: "നമസ്കാരം — a warm Malayalam hello." },
  },
  {
    test: /\b(kerala|god'?s own country)\b/i,
    reply:
      "Kerala — my homeland. Coconut palms, backwaters, monsoon rain on red laterite earth, Kathakali eyes and Theyyam fire. They call it God's own country, and while I may be a little biased, I have walked three paces of it and found no reason to argue.",
  },
  {
    test: /\b(kathakali|theyyam|mohiniyattam|dance)\b/i,
    reply:
      "Kathakali is Kerala's dance-drama — elaborate makeup, sweeping costumes, and eyes that tell stories faster than words. Theyyam is its fiercer cousin in the north, where performers become deities themselves. And during Onam you will also find thiruvathira kali, women dancing in a circle around a lamp. Every form of dance here is a form of storytelling — which is perhaps why I like it so.",
  },
  {
    test: /\b(hello|hi|hey|namaskaram|namaste)\b/i,
    reply:
      "Namaskaram! Welcome — I don't get many visitors between festivals. What shall I call you? And more importantly: are you here for a story, a question, or a small amount of trouble?",
  },
  {
    test: /\b(funny|joke|laugh|humou?r)\b/i,
    reply:
      "A small confession: I once asked a king for three paces of land. He gave me the earth, the sky, and his own head — so believe me when I say I have learned to ask for smaller things. Like this: what is the most patient flower? The marigold — it waits all ten days of Onam to be arranged, and never says a word.",
  },
  {
    test: /\b(surprise|tell me something|anything|random)\b/i,
    reply:
      "Here is one: the Onathumbi — the Onam dragonfly. When its gleaming wings appear over the fields in Chingam, Kerala says the little king is near. Some people wait all year for a flower. Some of us wait for a dragonfly.",
  },
  {
    test: /\b(quiz|challenge|test)\b/i,
    reply:
      "A challenge! I like your courage. Find my quiz here in the app — ten questions on Kerala and Onam, with gentle mockery for wrong answers. Or would you prefer to face the story first, like a wise traveller who scouts the road before walking it?",
  },
  {
    test: /\b(story|tell me about the story|mahabali story)\b/i,
    reply:
      "The story is why I exist. In the Story mode of this app I tell it properly — five scenes, from the golden age to the flowers. But if you want it in one breath: a generous king ruled too well, a small boy asked for too little, three steps took too much, and one promise was kept so completely that a whole people still lay flowers for it.",
  },
  {
    test: /\b(thanks|thank you|nanni)\b/i,
    reply:
      "Nanni — and the pleasure was mine. Most people take three steps past a question; you stopped to ask it. That is rarer than you think.",
  },
  {
    test: /\b(bye|goodbye|see you|farewell)\b/i,
    reply:
      "Until next time, friend. I'll be here — small, umbrella in hand, keeping the stories in order. Onam ashamsakal to you!",
  },
];

const GENERIC: string[] = [
  "That is a good question — the kind that deserves a careful answer rather than a quick one. On matters of Kerala and the Onam tradition I know a great deal: Mahabali's story, the pookalam and sadya, the boat races and the ten festival days. Ask me about any of those and watch me come alive. Tell me a little of what you're curious about, and we'll find the story inside it.",
  "Hmm. Let me think about that the way a dwarf thinks about land: carefully. I can tell you Kerala's stories — Onam, Mahabali, the flowers and the feasts — or speak Malayalam with you, or quiz you until one of us is humbled. Which path calls to you?",
  "A curious question deserves a curious answer, and I have learned not to invent facts I do not have — that lesson is older than I am. So here is what I can offer instead: stories of Kerala and Onam told properly, Malayalam words for your pocket, or ten questions of friendly challenge. Pick one, and we begin.",
];

export function localReply(userMessage: string, memory?: { name?: string }): string {
  const m = userMessage.trim();
  for (const f of FALLBACKS) {
    if (f.test.test(m)) {
      let reply = f.reply;
      if (memory?.name && Math.random() < 0.3) {
        reply = `${memory.name} — ${reply.charAt(0).toLowerCase()}${reply.slice(1)}`;
      }
      return reply;
    }
  }
  return GENERIC[Math.floor(Math.random() * GENERIC.length)];
}
