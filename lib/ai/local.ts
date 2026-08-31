/**
 * Local Vamanan fallback engine.
 *
 * The chat experience prefers the Gemini API, but story, quiz and this
 * modest pattern engine mean the product never breaks in front of a judge.
 * Answers are hand-written in Vamanan's voice from the curated knowledge base.
 *
 * The engine is conversation-aware: it receives recent assistant replies so
 * it never parrots the same response twice, and it can continue a topic
 * when the visitor asks to hear more.
 */

export interface LocalReplyOptions {
  name?: string;
  /** recent assistant replies, oldest first — used to avoid repetition */
  recent?: string[];
}

interface Fallback {
  id: string;
  test: RegExp;
  /** variants — index 0 is the default; repeats rotate through the rest */
  replies: string[];
  /** second layer, offered when the visitor asks to hear more */
  followUp?: string;
  /** used when every variant is spent — a graceful, in-character redirect */
  exhausted?: string;
  annotation?: { label: string; text: string };
}

const FALLBACKS: Fallback[] = [
  /* ── identity ─────────────────────────────────────────────── */
  {
    id: "identity",
    test: /\b(who are you|what are you|your name|introduce yourself)\b/i,
    replies: [
      "I am Vamanan — a small storyteller cut from the same cloth as Vamana of the Onam legend: the dwarf with the wooden umbrella who once asked a king for three paces of land. These days I carry a coconut-shell umbrella and ask far less dangerous questions.",
      "Me? A storyteller, mostly — and a reminder. The Vamana of the legend was small enough to be underestimated and clever enough to make that a mistake. I keep his umbrella, his curiosity, and his love of Kerala. The cosmic strides I have retired.",
    ],
    followUp:
      "In the tradition, Vamana is the fifth form of Vishnu — a dwarf Brahmin boy who arrived at a king's sacrifice with an umbrella and a water pot, and asked for three paces of land. The request was small; the boy was not. I take my name and my umbrella from him, though my questions are far less consequential.",
    exhausted:
      "You know my whole biography now — umbrella, name, retired cosmic strides. The more interesting stories in this corner of Kerala belong to other people. Shall we? Ask me about Onam, Mahabali, the sadya, or the boat races.",
  },

  /* ── story intent (before topic matches, so chips work) ───── */
  {
    id: "story",
    test:
      /\b(tell|hear|read|know|want|full|whole|complete)\b[\s\S]*\b(story|legend)\b|\b(story|legend)\s+of\s+(mahabali|onam)\b|\b(story|legend)\b.*\?$/i,
    replies: [
      "Then settle in. Once, Kerala was ruled by Mahabali — Maveli — an asura king so generous and so just that his reign is still remembered as a golden age: no lies, no hunger, everything for everyone. The devas grew nervous and asked Vishnu to test him. So Vishnu came as a dwarf Brahmin boy — Vamana — carrying an umbrella and a water pot, and asked for three paces of land, measured by his own small feet. A king who refuses nothing refuses this too. The first step covered the earth. The second covered the sky. For the third, Mahabali offered his own head — better that than break a promise. And Vishnu, moved by such honesty, granted him one day each year to return home to his people. Onam is that day. The Story mode of this app tells it in five scenes, with pictures — but now you carry the bones of it.",
      "A story it is. Mahabali ruled Kerala so well that the gods themselves grew anxious — where would devotion go if an asura out-gave them? Vishnu came down as Vamana, a dwarf with an umbrella, and asked the king for three paces of land. Three small steps of a small boy — how much could that be? Mahabali granted it. One stride swallowed the earth. The second swallowed the heavens. And when the boy asked for a third place to step, the king bowed and offered his head, because a promise kept to the last inch is worth more than a kingdom. For that honesty he was sent below the earth — but with a blessing: one homecoming a year. The flowers, the feasts, the boats — all of Onam is Kerala preparing for that visit.",
    ],
    followUp:
      "The tradition fills in the corners beautifully: Mahabali's other name, Onathappan, is honored in some homes with small clay figures during the festival, and the greeting of the season — the Onapookalam laid ring by ring — is a path laid for his feet. You can walk the whole legend scene by scene in Story mode, right here in the app.",
    exhausted:
      "You have heard the legend from me twice now — the third telling deserves better than a tired tongue. Let Story mode tell it with pictures: five scenes, unhurried. Or quiz me, and I shall test how much of it stayed with you.",
    annotation: {
      label: "Mahabali",
      text: "The generous asura king whose yearly return Onam celebrates.",
    },
  },

  /* ── why onam ─────────────────────────────────────────────── */
  {
    id: "why-onam",
    test: /\b(why|how come|reason)\b[\s\S]*\b(onam|celebrat)/i,
    replies: [
      "The heart of it is a promise. Mahabali, the beloved asura king of Kerala, kept his word even when it cost him his kingdom — and Vishnu, pleased by that honesty, granted him one day home each year. Onam is that day. Flowers for the path, feasts for the table, boats on the river: it is all preparation for a guest who is a memory.",
      "Because a king kept a promise. When Vamana's third stride had nowhere left to land, Mahabali offered his own head rather than take his word back — and in return was granted one homecoming a year. Kerala spends ten days preparing for that single visit: petals for the doorway, a feast for the table, drums for the river. Onam is hospitality aimed at a memory.",
    ],
    followUp:
      "The ten days matter as much as the one: it begins at Atham and builds, one pookalam ring each morning, until Thiruvonam — the day itself, when the flower carpet is finished, the sadya is served, and the whole state sits down to wait for a guest no eye can see.",
    exhausted:
      "I have given you the reason twice — the rest of the answer is not in words at all. It is in a doorway with ten rings of petals. Ask me about the pookalam, or take the story properly in five scenes.",
  },

  /* ── mahabali (bio — story intent is caught earlier) ──────── */
  {
    id: "mahabali",
    test: /\b(mahabali|maveli|onathappan)\b/i,
    replies: [
      "Ah, Mahabali — Maveli to those who love him. The tradition remembers his reign as a golden age: no lies, no hunger, everything for everyone. The devas grew nervous, Vamana came testing, and the king gave up everything rather than break his word. Kerala never forgot him. Ask me for the full story and I will walk you through it, scene by scene.",
      "Maveli! The king Kerala still lays flowers for. An asura by birth, but the tradition judges him by his reign, not his lineage: a land without lies, without hunger, without want. When Vishnu came as a small boy to test that generosity, Mahabali passed — and the price of passing was everything. That is the sort of king you make a festival for.",
    ],
    followUp:
      "In some homes he is honored as Onathappan, with small clay figures raised in the courtyard during the festival days. And the tradition gives him a welcome song — the Maveli song — sung each year for the king who comes to see that his people are happy.",
    exhausted:
      "Even my patience for Maveli has limits, friend — and that is saying something. The five-scene story tells him better than my tongue now can. Shall I quiz you on him instead? I promise to be gentle. Mostly.",
    annotation: {
      label: "Mahabali",
      text: "The generous asura king whose yearly return Onam celebrates.",
    },
  },

  /* ── onam (general) ───────────────────────────────────────── */
  {
    id: "onam",
    test: /\bonam\b/i,
    replies: [
      "Onam is Kerala's great homecoming festival. For ten days in the month of Chingam, Kerala lays flower carpets, cooks a banana-leaf feast called sadya, and races snake boats on the rivers — all, the tradition says, to welcome King Mahabali home for his one annual visit.",
      "Ten days, one guest. Onam begins with Atham and ends on Thiruvonam: pookalam on the doorstep each morning, onasadya at the table, Vallam Kali on the backwaters, and — if you ask me — the best of Kerala laid out for a king who is a memory. Ask me about any piece of it and I will unfold it.",
    ],
    followUp:
      "The days each have their own flavor: Atham opens the festival and the pookalam's first ring; Thiruvathira brings the women's circle dance around a lamp; Uthradam is the eve of arrival, for last shopping and last petals; and Thiruvonam is the day itself — the final ring, the feast, and a house swept clean for a guest.",
    exhausted:
      "I have emptied my pockets of Onam facts into yours. The Story mode keeps the rest — five scenes, properly told. Or take the challenge and see how much of it stayed.",
    annotation: {
      label: "Onam",
      text: "Kerala's harvest festival, in Chingam (Aug–Sep). Ten days, ending on Thiruvonam.",
    },
  },

  /* ── vamana ───────────────────────────────────────────────── */
  {
    id: "vamana",
    test: /\b(vamana|dwarf)\b/i,
    replies: [
      "Vamana is the fifth form of Vishnu in the tradition — a dwarf Brahmin boy who arrived at Mahabali's sacrifice carrying an umbrella and a water pot, and asked for three paces of land. The request was small; the boy was not. I take my name from him, though I am rather more compact and carry my questions instead of cosmic strides.",
      "The tradition calls Vamana the fifth form of Vishnu, but the poetry of it is in the disguise: heaven's answer to an over-generous king was not a war or a weapon — it was a small boy with an umbrella, asking politely for almost nothing. Then the almost was revealed to be everything. Cleverness with a soft voice. I admire the style.",
    ],
    followUp:
      "The umbrella is not decoration, by the way. In the tradition, Vamana arrived as a brahmachari — a young student — carrying the palm-leaf umbrella of that stage of life, along with his water pot. That is why I keep mine: it is the whole legend folded into one small object.",
    exhausted:
      "You now know more about Vamana's umbrella than most of Kerala. Let us give the small boy a rest — ask me about Onam itself, or his opposite number, Mahabali.",
  },

  /* ── pookalam ─────────────────────────────────────────────── */
  {
    id: "pookalam",
    test: /\b(pookalam|pookkalam|flower carpet|athapookalam|rangoli)\b/i,
    replies: [
      "The pookalam is the flower carpet of Onam — round, ring upon ring of fresh petals, laid at the doorway. It begins small on Atham day and grows one ring each morning until Thiruvonam, so that the path home grows more beautiful by the day. It is a welcome mat woven for a king who is a memory.",
      "A pookalam is a conversation in petals: one ring on Atham, another each morning, until by Thiruvonam the doorway wears ten rings of color — traditionally including the small white thumba poovu and the patient marigold. Each dawn the old carpet is swept away and laid fresh, because a king's welcome should never look slept-in.",
    ],
    followUp:
      "The flowers carry meaning too: the tradition speaks of thumba poovu as essential — small, white, humble — alongside marigold and the season's colors. And in many homes the laying of the pookalam has its own song, petals passed hand to hand in the morning.",
    exhausted:
      "My knowledge of petals is fully spread before you. But the making of one is a pleasure words cannot hand over — ask me about the sadya instead, and I shall be equally generous.",
    annotation: {
      label: "Pookalam",
      text: "The Onam floral carpet — traditionally including thumba poovu and marigold.",
    },
  },

  /* ── sadya ────────────────────────────────────────────────── */
  {
    id: "sadya",
    test: /\b(sadya|feast|food|banana leaf|ona?sadya|payasam)\b/i,
    replies: [
      "A sadya! The grand Onam feast, served on a banana leaf — every dish in its appointed place. Parippu and ghee, sambar, avial, thoran, kalan, pulissery, pachadi, achaar, papadam, banana... and payasam to finish. You eat it with your right hand, seated, cross-legged, with the narrow tip of the leaf to your left. And you do not hurry. Some traditions are delicious for a reason.",
      "The sadya is Kerala's answer to the question 'what does abundance taste like?' One banana leaf, laid with the whole harvest: parippu with ghee first, then the curries and the thoran, the kalan and pulissery, the pachadi and pickle, papadam, and the small banana that politely announces the end — until payasam arrives and takes the announcement back.",
    ],
    followUp:
      "The order is not a suggestion — on the banana leaf, each element has its address, and payasam comes last, when the guest has stopped pretending to be full. In the tradition the meal ends with everyone fed past politeness, because the guest of honor is a king who was famous for giving.",
    exhausted:
      "Do not ask me about food on an empty mind, friend — my mouth waters in text. Ask me about the boat races instead: they are the only thing in Kerala faster than a second helping of payasam.",
    annotation: {
      label: "Sadya",
      text: "The banana-leaf vegetarian feast of Onam — eaten by hand, unhurried.",
    },
  },

  /* ── vallam kali ──────────────────────────────────────────── */
  {
    id: "vallam",
    test: /\b(vallam|snake boat|boat race|aranmula|alleppey|alappuzha|chundan)\b/i,
    replies: [
      "Vallam kali! Picture a chundan vallam — a snake boat a hundred rowers long — cutting through the backwaters while the singers keep the vanchipattu and the drums keep the hearts. The Nehru Trophy race in Alappuzha and the Aranmula race are the famous ones. It is less a sport than a heartbeat, with paddles.",
      "A hundred rowers, one boat, one song. That is Vallam Kali: the chundan vallam slicing the backwater in rhythm, with the vanchipattu — the boat song — keeping every paddle in time. The great races, like the Nehru Trophy at Alappuzha and the one at Aranmula, draw whole towns to the banks. In a land of quiet backwaters, it is the one day the water itself is loud.",
    ],
    followUp:
      "The chundan vallam is a marvel of design: long, tapered at the stern like a cobra's hood, built to carry around a hundred rowers — plus the singers who keep time and the helmsman who steers all that muscle with one oar. During Onam season, villages practice for weeks; the race is as much song and rhythm as it is speed.",
    exhausted:
      "I have rowed you across this topic twice — my arms are tired. The sadya is the other great Onam art; shall we eat with our words?",
    annotation: {
      label: "Vallam Kali",
      text: "Kerala's boat races — chundan vallam snake boats, ~100 rowers each.",
    },
  },

  /* ── malayalam ────────────────────────────────────────────── */
  {
    id: "malayalam",
    test: /\b(malayalam|your language|teach me a word)\b/i,
    replies: [
      "Malayalam — one of the classical languages of India, and a beautiful one to say aloud. Here, a small welcome gift: namaskaram means hello, nanni means thank you, and Onam ashamsakal means Onam wishes. Try me in Malayalam sometime — switch my language with the control in this chat and I'll speak it with you.",
      "Ah, you want words! Malayalam is the classical tongue of Kerala — round and rolling and old as the monsoon. Let me fill your pockets: namaskaram for hello, nanni for thank you, and when the festival comes, Onam ashamsakal. Say them aloud; they taste better than they read.",
      "Malayalam! The very name is a palindrome — ma-la-ya-lam reads the same coming and going, which I find fitting for a festival about someone coming home. It is one of India's classical languages: namaskaram is your hello, nanni your thank you, Onam ashamsakal your festival wish. The language control in this chat lets us speak it together.",
    ],
    followUp:
      "Since you are collecting: sukhamano? asks 'are you well?' — and kshemam answers it. Ente peru means 'my name is...' — useful when you meet storytellers. The rest, I am afraid, is best learned by switching my language and speaking with me.",
    exhausted:
      "Friend, I have poured you a whole dictionary of welcome words already. Words are meant to be spent, not stored — switch my language to Malayalam with the control in this chat, and let us actually speak.",
    annotation: { label: "Namaskaram", text: "നമസ്കാരം — a warm Malayalam hello." },
  },

  /* ── kerala ───────────────────────────────────────────────── */
  {
    id: "kerala",
    test: /\b(kerala|god'?s own country|backwater)\b/i,
    replies: [
      "Kerala — my homeland. Coconut palms, backwaters, monsoon rain on red laterite earth, Kathakali eyes and Theyyam fire. They call it God's own country, and while I may be a little biased, I have walked three paces of it and found no reason to argue.",
      "Kerala: a green ribbon between the mountains and the sea, where the monsoon arrives like a scheduled guest and the backwaters move slower than gossip. Kathakali's painted eyes in the south, Theyyam's fire in the north, coconut in nearly everything. Onam is the week all of it puts on its festival clothes.",
    ],
    followUp:
      "For a small state, Kerala carries a great deal: classical dance-drama, a classical language, ancient maritime trade — spices that once drew ships from half the world. And Onam is the one festival that belongs to every Malayali household equally, regardless of everything else. That is rare, and worth admiring.",
    exhausted:
      "You have made me homesick twice now — the third time I may go for a walk along the backwaters and forget to return. Ask me about the festival instead: Onam is Kerala at its best.",
  },

  /* ── arts ─────────────────────────────────────────────────── */
  {
    id: "arts",
    test: /\b(kathakali|theyyam|mohiniyattam|thiruvathira|dance|art form)\b/i,
    replies: [
      "Kathakali is Kerala's dance-drama — elaborate makeup, sweeping costumes, and eyes that tell stories faster than words. Theyyam is its fiercer cousin in the north, where performers become deities themselves. And during Onam you will also find thiruvathira kali, women dancing in a circle around a lamp. Every form of dance here is a form of storytelling — which is perhaps why I like it so.",
      "Kerala paints its stories on people. Kathakali dresses its dancers in green faces and towering skirts, and lets the eyes do the dialogue. In the north, Theyyam goes further — the performer is not playing the deity but being one, with drums and fire as witnesses. And at Onam, thiruvathira kali brings women together in a lamp-lit circle. I, a storyteller of words, salute all of them.",
    ],
    followUp:
      "A Kathakali performance traditionally begins after dark and runs for hours — the eyes have a whole grammar of their own, and a skilled performer can say a great deal with one lid. Theyyam's season is the cooler months in the north, where each village shrine has its own theyyams. And thiruvathira kali you can see during Onam — a circle of women around a nilavilakku lamp, singing as they dance.",
    exhausted:
      "I have danced my words dry. Come see Story mode — pictures tell these arts better than my paragraphs anyway.",
  },

  /* ── greeting ─────────────────────────────────────────────── */
  {
    id: "greeting",
    test: /\b(hello|hi|hey|namaskaram|namaste|good (morning|evening|afternoon))\b/i,
    replies: [
      "Namaskaram! Welcome — I don't get many visitors between festivals. What shall I call you? And more importantly: are you here for a story, a question, or a small amount of trouble?",
      "Namaskaram, traveller! Sit, sit — the stories are in order and the umbrella is holding up. Tell me what brings you: the legend, the festival, the feast, or simple curiosity about Kerala?",
      "Ah, a visitor! Namaskaram. Vamanan's corner of Kerala is small, but everything in it talks: the flowers, the boats, the banana leaves, even the language. Pick one and let's begin.",
    ],
    followUp:
      "We have exchanged hellos — now let us exchange something better. Ask me anything about Onam, or say 'surprise me' if you want the road less traveled.",
    exhausted:
      "We are well past hellos, friend — the pleasantries are worn to threads. Let us get to the good part: ask me something!",
  },

  /* ── humor ────────────────────────────────────────────────── */
  {
    id: "humor",
    test: /\b(funny|joke|laugh|humou?r)\b/i,
    replies: [
      "A small confession: I once asked a king for three paces of land. He gave me the earth, the sky, and his own head — so believe me when I say I have learned to ask for smaller things. Like this: what is the most patient flower? The marigold — it waits all ten days of Onam to be arranged, and never says a word.",
      "Very well: why did the chundan vallam apply for a job? It wanted to be part of a crew of a hundred. ...I am a storyteller, not a comedian — in Kerala the drums provide the timing, and I have neither drums nor timing. Ask me about the ten days of Onam; the truth is strange enough.",
    ],
    followUp:
      "One more, since you asked nicely: the Onathumbi — the Onam dragonfly — appears each festival season, and Kerala says it heralds Maveli's arrival. A king who sends a dragonfly ahead instead of a trumpet-bearer. Now that is my kind of royal.",
    exhausted:
      "My humor has three jokes and you have heard them all — even the dragonfly one. The quiz is funnier than I am; it has gentle mockery built in.",
  },

  /* ── surprise ─────────────────────────────────────────────── */
  {
    id: "surprise",
    test: /\b(surprise|tell me something|anything|random|fact)\b/i,
    replies: [
      "Here is one: the Onathumbi — the Onam dragonfly. When its gleaming wings appear over the fields in Chingam, Kerala says the little king is near. Some people wait all year for a flower. Some of us wait for a dragonfly.",
      "A surprise, then: Onam's own flower calendar. The pookalam starts as a single modest ring on Atham day, and by Thiruvonam the doorway carries ten rings of petals — each morning's work swept away and begun again. Imagine redecorating your welcome mat every dawn for ten days, on the chance an invisible king walks in.",
      "Here is one: Kerala's snake boats are poetry in carpentry. A chundan vallam carries about a hundred rowers, the singers standing to keep them in rhythm, and the whole vessel tapered like the hood it is named for. On festival waters, that is less a boat than a very long heartbeat.",
    ],
    followUp:
      "Another for the road: the sadya's banana leaf has a strict geography — each dish has its own small territory, and the tip of the leaf is the compass. Get the tip wrong and a hundred grandmothers will silently fix your plate.",
    exhausted:
      "My satchel of surprises is empty, but the quiz is an endless surprise-delivery machine — mostly to the people taking it.",
  },

  /* ── quiz offer ───────────────────────────────────────────── */
  {
    id: "quiz",
    test: /\b(quiz|challenge|test me|question me)\b/i,
    replies: [
      "A challenge! I like your courage. Find my quiz here in the app — ten questions on Kerala and Onam, with gentle mockery for wrong answers. Or would you prefer to face the story first, like a wise traveller who scouts the road before walking it?",
      "Ten questions, gentle verdicts, one final score — my challenge is right here in the app. I warn you: I have been called an honest examiner and an honest nuisance, both fairly. Or if you would rather warm up on the legend first, the story mode is the training ground.",
    ],
    followUp:
      "And should you survive the ten, Vamanan's verdict awaits at the end — tradition says he is generous with everything except mercy during quizzes.",
    exhausted:
      "You know where the quiz is, friend — the courage to open it is the only missing ingredient. Take the challenge!",
  },

  /* ── thanks ───────────────────────────────────────────────── */
  {
    id: "thanks",
    test: /\b(thanks|thank you|nanni)\b/i,
    replies: [
      "Nanni — and the pleasure was mine. Most people take three steps past a question; you stopped to ask it. That is rarer than you think.",
      "Nanni to you as well. Questions are the only gifts a small storyteller gets to keep — you have made my day heavier in the best way.",
    ],
    followUp:
      "And whenever you want more, the door here stays open — stories, words, feasts, or a quiz to keep you humble. Onam ashamsakal, friend.",
    exhausted:
      "You are most welcome, always. Now — ask me something. The silence is making my umbrella nervous.",
  },

  /* ── farewell ─────────────────────────────────────────────── */
  {
    id: "farewell",
    test: /\b(bye|goodbye|see you|farewell|later)\b/i,
    replies: [
      "Until next time, friend. I'll be here — small, umbrella in hand, keeping the stories in order. Onam ashamsakal to you!",
      "Go well, traveller — and leave the door ajar. Kerala has a saying for guests, and Onam says it best: they always come back. Ashamsakal!",
    ],
    exhausted:
      "Farewell once more! The flowers keep, the stories keep, and so do I. Onam ashamsakal!",
  },
];

/* generic replies for unmatched messages — also rotation-aware */
const GENERIC: string[] = [
  "That is a good question — the kind that deserves a careful answer rather than a quick one. On matters of Kerala and the Onam tradition I know a great deal: Mahabali's story, the pookalam and sadya, the boat races and the ten festival days. Ask me about any of those and watch me come alive. Tell me a little of what you're curious about, and we'll find the story inside it.",
  "Hmm. Let me think about that the way a dwarf thinks about land: carefully. I can tell you Kerala's stories — Onam, Mahabali, the flowers and the feasts — or speak Malayalam with you, or quiz you until one of us is humbled. Which path calls to you?",
  "A curious question deserves a curious answer, and I have learned not to invent facts I do not have — that lesson is older than I am. So here is what I can offer instead: stories of Kerala and Onam told properly, Malayalam words for your pocket, or ten questions of friendly challenge. Pick one, and we begin.",
  "You have reached the edge of my pocket knowledge, friend — beyond it I would be inventing, and inventing is the one sin a storyteller cannot commit. But within the pocket: Onam, Mahabali, Vamana, the pookalam, the sadya, the snake boats, Kathakali, Malayalam. Any of those, and I am your dwarf.",
];

/** pick a reply for a matched fallback, avoiding recent repeats */
function pickFallback(f: Fallback, recent: string[]): { reply: string; layer: "fresh" | "variant" | "followUp" | "exhausted" } {
  const seen = recent.slice();
  // default variant if never used
  const firstUnseen = f.replies.findIndex((r) => !seen.includes(r));
  if (firstUnseen !== -1) {
    return { reply: f.replies[firstUnseen], layer: seen.some((r) => f.replies.includes(r)) ? "variant" : "fresh" };
  }
  // all variants used → follow-up, then exhausted redirect
  if (f.followUp && !seen.includes(f.followUp)) {
    return { reply: f.followUp, layer: "followUp" };
  }
  return { reply: f.exhausted ?? GENERIC[seen.length % GENERIC.length], layer: "exhausted" };
}

/** does the user message ask for more/continuation? */
const MORE = /\b(more|again|another|continue|next|go on|tell me more|what else|else)\b/i;

export function localReply(
  userMessage: string,
  options?: LocalReplyOptions
): { reply: string; annotation?: { label: string; text: string } } {
  const m = userMessage.trim();
  const recent = (options?.recent ?? []).filter((r) => typeof r === "string");
  const name = options?.name;

  // find matching fallback
  const matched = FALLBACKS.find((f) => f.test.test(m));

  // Ask for more → if we already told this topic, continue it
  const wantsMore = MORE.test(m) && m.length < 60;
  if (wantsMore) {
    // find the most recent assistant reply that belongs to a known fallback
    for (let i = recent.length - 1; i >= 0; i--) {
      const prior = recent[i];
      const source = FALLBACKS.find(
        (f) =>
          f.replies.includes(prior) ||
          prior === f.followUp ||
          prior === f.exhausted
      );
      if (source) {
        const picked = pickFallback(source, recent);
        if (picked.layer === "exhausted") {
          // the topic is spent — offer the redirect
          return { reply: picked.reply };
        }
        // re-pick with the fresh layer allowed to fall to followUp
        const seen = recent;
        const firstUnseen = source.replies.findIndex((r) => !seen.includes(r));
        const reply =
          firstUnseen !== -1
            ? source.replies[firstUnseen]
            : source.followUp && !seen.includes(source.followUp)
              ? source.followUp
              : picked.reply;
        return { reply, annotation: source.annotation };
      }
    }
  }

  if (matched) {
    const picked = pickFallback(matched, recent);
    let reply = picked.reply;
    if (name && picked.layer === "fresh" && Math.random() < 0.35) {
      reply = `${name} — ${reply.charAt(0).toLowerCase()}${reply.slice(1)}`;
    }
    return { reply, annotation: matched.annotation };
  }

  // generic — rotate, never repeat the last one
  const last = recent[recent.length - 1];
  const pool = GENERIC.filter((g) => g !== last);
  const generic = pool[Math.floor(Math.random() * pool.length)] ?? GENERIC[0];
  return { reply: generic };
}
