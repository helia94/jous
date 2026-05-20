const commonStats = [
  {
    value: "Free",
    label: "draw cards without buying a little box of destiny",
  },
  {
    value: "Random",
    label: "the next card is not waiting there with a clipboard",
  },
  {
    value: "Open source",
    label: "the app can be inspected, forked, and argued with",
  },
];

const sourceText =
  "Jous is public and plain about what it is: a random conversation card app. The prompts can be inspected and improved. No velvet rope.";

const fallbackExamples = [
  "What is a practice that brings meaning to your life, but it doesn’t include suffering first?",
  "Do you have someone who would always tell you the truth?",
  "When was the last time you were really happy for someone else?",
  "What's the closest thing to magic for you?",
];

const buildPage = ({
  path,
  title,
  description,
  keywords,
  navLabel,
  shortDescription,
  appHref = "/random",
  filters = {},
  kicker,
  h1,
  lede,
  previewLabel,
  primaryCta,
  examplesHeading,
  examplesIntro,
  examples = fallbackExamples,
  comparisonHeading,
  comparisonIntro,
  comparisons,
  sourceHeading = "Part of the open-source Jous card set",
  faqs,
}) => ({
  path,
  title,
  description,
  keywords,
  navLabel: navLabel || h1,
  shortDescription: shortDescription || description,
  appHref,
  filters,
  ogDescription: description,
  kicker,
  h1,
  lede,
  previewLabel,
  primaryCta,
  secondaryCta: "Open the random card app",
  statCards: commonStats,
  examplesHeading,
  examplesIntro,
  examples,
  comparisonHeading,
  comparisonIntro,
  comparisons,
  sourceHeading,
  sourceText,
  faqs,
});

export const conversationCardSpokePages = {
  "/online-conversation-cards": buildPage({
    path: "/online-conversation-cards",
    title: "Online Conversation Cards | Free Random Questions | Jous",
    description:
      "Draw online conversation cards for free with Jous. Random, open-source prompts without the self-help fog machine.",
    keywords:
      "online conversation cards, conversation cards online, free online conversation cards, random conversation cards online",
    navLabel: "Online",
    shortDescription: "Draw in the browser.",
    kicker: "Online conversation cards",
    h1: "Online Conversation Cards",
    lede:
      "Draw a card when the room needs a better question. Funny, weird, casual, sometimes deep. It does not arrive wearing a headset.",
    previewLabel: "Online card",
    primaryCta: "Draw an online card",
    examplesHeading: "Examples of online conversation cards",
    examplesIntro:
      "The useful ones are direct. The better ones leave a little dirt on their boots.",
    comparisonHeading: "Why use online cards?",
    comparisonIntro:
      "A browser is less romantic than a deck. It is also there when the moment shows up.",
    comparisons: [
      {
        title: "No deck to carry",
        text: "Open the page and draw. Nothing to print, shuffle, pack, or pretend you remembered.",
      },
      {
        title: "Good for unplanned minutes",
        text: "Use it at a table, on a walk, in a group chat, or when everyone has started discussing parking.",
      },
      {
        title: "Harder to over-direct",
        text: "Random cards keep the conversation from being managed into a small beige corner.",
      },
    ],
    faqs: [
      {
        question: "What are online conversation cards?",
        answer:
          "Online conversation cards are prompts you draw in a browser instead of from a physical deck.",
      },
      {
        question: "Are Jous online conversation cards free?",
        answer: "Yes. You can draw online conversation cards without paying or signing up.",
      },
      {
        question: "Can I use them with friends or on a date?",
        answer: "Yes. They are broad enough for friends, dates, groups, and slow corners of ordinary life.",
      },
      {
        question: "Are the cards random?",
        answer: "Yes. Jous draws a random question, so nobody gets to rehearse the next mood.",
      },
    ],
  }),

  "/random-conversation-cards": buildPage({
    path: "/random-conversation-cards",
    title: "Random Conversation Cards | Jous",
    description:
      "Draw random conversation cards online. Jous serves strange, funny, and occasionally useful questions without turning the evening into homework.",
    keywords:
      "random conversation cards, random conversation cards online, random questions for conversations",
    navLabel: "Random",
    shortDescription: "No category. Just the next question.",
    kicker: "Random conversation cards",
    h1: "Random Conversation Cards",
    lede:
      "The random part matters. If you already know where the talk is going, congratulations, you have invented a meeting.",
    previewLabel: "Random card",
    primaryCta: "Draw a random card",
    examplesHeading: "A few random cards",
    examplesIntro:
      "Some are small. Some are strange. Some walk in quietly and sit down for an hour.",
    examples: [
      "How much lane possessiveness do you have while driving?",
      "How tall is the glass? :)",
      "What was your last failure? ",
      "What acquired taste do you have?",
    ],
    comparisonHeading: "Random beats over-curated",
    comparisonIntro:
      "A perfect category menu can be useful. It can also make everyone too clever before anyone talks.",
    comparisons: [
      {
        title: "Less steering",
        text: "Nobody picks the mood from a polished little shelf.",
      },
      {
        title: "More surprise",
        text: "The good card is often the one you would not have chosen.",
      },
      {
        title: "Fewer speeches",
        text: "A plain question gives people room to answer like themselves.",
      },
    ],
    faqs: [
      {
        question: "What makes these cards random?",
        answer: "Jous draws from a large prompt set instead of showing a fixed next card.",
      },
      {
        question: "Are random conversation cards good for groups?",
        answer: "Yes. Random prompts are useful when a group needs a clean turn away from the usual topic.",
      },
      {
        question: "Can random cards still be deep?",
        answer: "Yes, but they do not announce it with incense. Some questions simply go there.",
      },
      {
        question: "Do I need an account?",
        answer: "No. You can draw random conversation cards without creating an account.",
      },
    ],
  }),

  "/open-source-conversation-cards": buildPage({
    path: "/open-source-conversation-cards",
    title: "Open-Source Conversation Cards | Jous",
    description:
      "Open-source conversation cards from Jous. Inspect the app, draw random prompts, and skip the sealed-deck mystique.",
    keywords:
      "open source conversation cards, open source conversation card app, open source conversation starter cards",
    navLabel: "Open source",
    shortDescription: "Public and remixable.",
    kicker: "Open-source conversation cards",
    h1: "Open-Source Conversation Cards",
    lede:
      "Most card decks act like the questions came down from a mountain. Jous keeps the door open. Look around. Add a card.",
    previewLabel: "Open-source card",
    primaryCta: "Draw a card",
    examplesHeading: "Examples from the public spirit",
    examplesIntro:
      "Open source does not mean sterile. It means the thing can breathe.",
    examples: [
      "Which emotion is correlated the most with memory creation for you?",
      "Do you have any techniques (ToDos/ not ToDos) to encourage others to be more honest with you?",
      "Can you make yourself be more open on demand?",
      "What is self-discovery you are most grateful to have had?",
    ],
    comparisonHeading: "Why open source?",
    comparisonIntro:
      "A conversation deck does not need to be mysterious to be good.",
    comparisons: [
      {
        title: "Inspectable",
        text: "You can see the project instead of trusting a brand voice in soft shoes.",
      },
      {
        title: "Forkable",
        text: "Make a version for your people, your language, or your strange little dinner.",
      },
      {
        title: "Alive",
        text: "The set can grow from actual use, not only from a product meeting.",
      },
    ],
    faqs: [
      {
        question: "Is Jous really open source?",
        answer: "Yes. The source repository is public and linked from this page.",
      },
      {
        question: "Can I add my own conversation cards?",
        answer: "Yes. Jous is built so people can add questions to the wider set.",
      },
      {
        question: "Can I fork Jous?",
        answer: "Yes. You can inspect and fork the public repository.",
      },
      {
        question: "Why does open source matter for conversation cards?",
        answer: "It keeps the project transparent and easier to adapt instead of locked inside one branded deck.",
      },
    ],
  }),

  "/free-conversation-cards": buildPage({
    path: "/free-conversation-cards",
    title: "Free Conversation Cards | Jous",
    description:
      "Free conversation cards online. Draw random prompts on Jous without buying a deck, downloading a PDF, or joining a personal growth parade.",
    keywords:
      "free conversation cards, free online conversation cards, free conversation starter cards",
    navLabel: "Free",
    shortDescription: "No deck. No signup.",
    kicker: "Free conversation cards",
    h1: "Free Conversation Cards",
    lede:
      "Free as in draw the card and get on with it. No checkout page hiding behind a question about your childhood.",
    previewLabel: "Free card",
    primaryCta: "Draw a free card",
    examplesHeading: "Free cards that still have pulse",
    examplesIntro:
      "Free does not have to mean laminated advice from an airport bookshop.",
    examples: [
      "Do you judge (really) cheap people?",
      "What are you embarrassed at paying/spending too much for?",
      "What is your cheapest (literally low cost for you) virtue signaling?",
      "What things do you wish you had a better memory for?",
    ],
    comparisonHeading: "Free, without the catch doing jazz hands",
    comparisonIntro:
      "Some free decks are previews for paid decks. Jous is just useful now.",
    comparisons: [
      {
        title: "No paid deck required",
        text: "Draw cards in the browser without buying a box first.",
      },
      {
        title: "No PDF ritual",
        text: "You do not need scissors, paper, or the will to align printer margins.",
      },
      {
        title: "No account wall",
        text: "Start with a card, not with a form.",
      },
    ],
    faqs: [
      {
        question: "Are Jous conversation cards free?",
        answer: "Yes. You can draw cards online for free.",
      },
      {
        question: "Do I need to download anything?",
        answer: "No. Jous works in the browser.",
      },
      {
        question: "Are free cards lower quality?",
        answer: "No. Jous mixes funny, weird, casual, and deeper prompts in the same draw pile.",
      },
      {
        question: "Can I share free conversation cards?",
        answer: "Yes. You can open Jous with other people or share a prompt wherever the conversation is happening.",
      },
    ],
  }),

  "/conversation-cards-for-friends": buildPage({
    path: "/conversation-cards-for-friends",
    title: "Conversation Cards for Friends | Jous",
    description:
      "Conversation cards for friends who have already discussed work, weather, and someone's questionable hinge profile.",
    keywords:
      "conversation cards for friends, questions for friends, friendship conversation starters",
    navLabel: "Friends",
    shortDescription: "Use the Friends filter.",
    appHref: "/random?occasion=0",
    filters: { occasion: 0 },
    kicker: "For friends",
    h1: "Conversation Cards for Friends",
    lede:
      "For friends. Uses the same Friends filter that already exists in Jous.",
    previewLabel: "Friend card",
    primaryCta: "Draw a card for friends",
    examplesHeading: "Cards for friends",
    examplesIntro:
      "These are examples from the app. The filtered draw uses the Friends occasion.",
    examples: [
      "Who among your friends do you feel most needed by?",
      "Who are the friends with whom you have the most interesting conversations but you do not often do things together?",
      "Who respects you the least among your friends or close peers?",
      "Who is your cheesiest friend whom you still enjoy hanging with? ",
    ],
    comparisonHeading: "Friends do not need a workshop",
    comparisonIntro:
      "A good prompt should loosen the room, not make everyone sit like applicants.",
    comparisons: [
      {
        title: "Low pressure",
        text: "Skip the grand emotional reveal. Start with a question people can actually answer.",
      },
      {
        title: "Works in groups",
        text: "Use one card around the table and let the talk drift.",
      },
      {
        title: "Keeps old friends new",
        text: "The right question can remind you that your friend is not a solved crossword.",
      },
    ],
    faqs: [
      {
        question: "Are these cards good for old friends?",
        answer: "Yes. They help old friends get out of familiar loops without making it formal.",
      },
      {
        question: "Can we use Jous in a group?",
        answer: "Yes. Draw one card and let anyone answer, argue, or gracefully dodge.",
      },
      {
        question: "Are the questions too deep?",
        answer: "No. The set mixes light, strange, funny, and deeper prompts.",
      },
      {
        question: "Do friends need to install anything?",
        answer: "No. Open Jous in a browser and draw a card.",
      },
    ],
  }),

  "/conversation-cards-for-couples": buildPage({
    path: "/conversation-cards-for-couples",
    title: "Conversation Cards for Couples | Jous",
    description:
      "Conversation cards for couples who want better questions without turning date night into relationship admin.",
    keywords:
      "conversation cards for couples, couples conversation cards, relationship conversation starters",
    navLabel: "Couples",
    shortDescription: "Use the Couples filter.",
    appHref: "/random?occasion=3",
    filters: { occasion: 3 },
    kicker: "For couples",
    h1: "Conversation Cards for Couples",
    lede:
      "For couples. Uses the same Couples filter that already exists in Jous.",
    previewLabel: "Couple card",
    primaryCta: "Draw a couple card",
    examplesHeading: "Cards for couples",
    examplesIntro:
      "These are examples from the app. The filtered draw uses the Couples occasion.",
    examples: [
      "When was the peek of your curiosity about your partner/spouse/child/sibling?",
      "Do you need to be always the most emotional one in the relationship?",
      "Have you been attracted to someone you do not fully respect?",
      "Could/have you allow(ed) yourself to be manipulative in a relationship? if yes, how far? ",
    ],
    comparisonHeading: "Not relationship admin",
    comparisonIntro:
      "A couple question can be intimate without arriving with a clipboard.",
    comparisons: [
      {
        title: "No therapy cosplay",
        text: "Jous is a card app, not a licensed professional in a cardigan.",
      },
      {
        title: "Useful for quiet nights",
        text: "Draw one card when the show is bad and nobody wants to choose another one.",
      },
      {
        title: "Room for jokes",
        text: "Not every couple question has to lower the lighting.",
      },
    ],
    faqs: [
      {
        question: "Are Jous cards made only for couples?",
        answer: "No. They work for couples, but also for friends, dates, families, and groups.",
      },
      {
        question: "Are these relationship advice cards?",
        answer: "No. They are conversation prompts, not relationship advice.",
      },
      {
        question: "Can couples use Jous on date night?",
        answer: "Yes. Draw a card when you want a better question than the default ones.",
      },
      {
        question: "Are the cards romantic?",
        answer: "Some can become romantic. Jous does not force the violin section.",
      },
    ],
  }),

  "/conversation-cards-for-date-night": buildPage({
    path: "/conversation-cards-for-date-night",
    title: "Conversation Cards for Date Night | Jous",
    description:
      "Date night conversation cards for people who would rather talk than perform charm like a hotel lobby pianist.",
    keywords:
      "conversation cards for date night, date night cards, date night conversation starters",
    navLabel: "Date night",
    shortDescription: "Use the First Dates filter.",
    appHref: "/random?occasion=2",
    filters: { occasion: 2 },
    kicker: "Date night cards",
    h1: "Conversation Cards for Date Night",
    lede:
      "A date does not need to become a podcast interview. One good card can move things along without tapping the glass.",
    previewLabel: "Date night card",
    primaryCta: "Draw a date night card",
    examplesHeading: "Date night cards",
    examplesIntro:
      "A little funny, a little revealing, not wearing too much cologne.",
    examples: [
      "Would you ever date a criminal?",
      "You could have a kiss with the movie star of your choice, and you could pick the time too. When would you like to have the kiss?",
      "Who can you stare at silently the longest before it is uncomfortable or ridiculous?",
      "Which sign has been the most common give-away that someone is interested in you?",
    ],
    comparisonHeading: "Better than interview mode",
    comparisonIntro:
      "Dates already have enough performance. A random card gives both people a place to stand.",
    comparisons: [
      {
        title: "Less scripted",
        text: "The card is a door, not a questionnaire with shoes on.",
      },
      {
        title: "Good for early or old dates",
        text: "Use it with someone new or someone you know too well to ask obvious questions.",
      },
      {
        title: "Easy to ignore",
        text: "If the card is wrong, draw another. The room will survive.",
      },
    ],
    faqs: [
      {
        question: "Can I use Jous on a first date?",
        answer: "Yes, if the mood is right. Keep it light and draw another card if one feels too much.",
      },
      {
        question: "Are these cards only romantic?",
        answer: "No. They can be funny, casual, strange, or deeper depending on the draw.",
      },
      {
        question: "Do date night cards work for long-term couples?",
        answer: "Yes. Long-term couples also deserve questions that have not been microwaved six times.",
      },
      {
        question: "Is Jous free for date night?",
        answer: "Yes. You can draw date night conversation cards for free.",
      },
    ],
  }),

  "/weird-conversation-cards": buildPage({
    path: "/weird-conversation-cards",
    title: "Weird Conversation Cards | Jous",
    description:
      "Weird conversation cards for people allergic to polished icebreakers. Random questions, odd turns, no motivational confetti.",
    keywords:
      "weird conversation cards, weird conversation starter cards, weird questions for conversations",
    navLabel: "Weird",
    shortDescription: "Stranger cards from the app.",
    kicker: "Weird conversation cards",
    h1: "Weird Conversation Cards",
    lede:
      "Normal questions have their place. It is usually near the exit. Draw something stranger.",
    previewLabel: "Weird card",
    primaryCta: "Draw a weird card",
    examplesHeading: "Weird cards",
    examplesIntro:
      "Not weird for attention. Weird because people are weird and the conversation may as well admit it.",
    examples: [
      "Would you give up the rest of your life to be an immortal ghost on earth, where you could see anything in the future but could not do anything? ",
      "Which none-living objects you treat as if they had a life?",
      "What is the weirdest thing you have done to impress someone?",
      "Is a fractal more a complex or more a simple thing?",
    ],
    comparisonHeading: "Odd is useful",
    comparisonIntro:
      "A strange question can do what a polite one cannot: make people stop auto-filling the answer.",
    comparisons: [
      {
        title: "Breaks the loop",
        text: "Weird cards pull the talk away from work, weather, and the price of chairs.",
      },
      {
        title: "Makes room for humor",
        text: "People relax faster when the prompt is not asking them to present their soul in bullet points.",
      },
      {
        title: "Still human",
        text: "The point is not random nonsense. It is a side door into something real.",
      },
    ],
    faqs: [
      {
        question: "Are weird conversation cards useful?",
        answer: "Yes. Weird prompts can help people answer less automatically.",
      },
      {
        question: "Are the cards inappropriate?",
        answer: "Jous is strange, not built to shock people for sport.",
      },
      {
        question: "Can weird cards still be deep?",
        answer: "Yes. A weird question often becomes deep without announcing the plan.",
      },
      {
        question: "Can I draw only weird cards?",
        answer: "Jous serves a random mix, but this page keeps the examples and framing strange.",
      },
    ],
  }),

  "/non-cringe-conversation-starters": buildPage({
    path: "/non-cringe-conversation-starters",
    title: "Non-Cringe Conversation Starters | Jous",
    description:
      "Non-cringe conversation starters from Jous. Random, plain-spoken prompts with no guru voice and no forced vulnerability parade.",
    keywords:
      "non cringe conversation starters, non cringe conversation cards, conversation starters without self help",
    navLabel: "Non-cringe",
    shortDescription: "Plain questions.",
    kicker: "Non-cringe conversation starters",
    h1: "Non-Cringe Conversation Starters",
    lede:
      "The bar is low and somehow many decks trip over it. No guru voice. No branded vulnerability. Just questions.",
    previewLabel: "Starter",
    primaryCta: "Draw a starter",
    examplesHeading: "Non-cringe starters",
    examplesIntro:
      "Plain questions age better than inspirational mist.",
    examples: [
      "How do you feel about not being funny?",
      "What the worst advice that you actually followed?",
      "What is the lie you tell yourself most often?",
      "Do you find your parents interesting? Is that new or was it always so",
    ],
    comparisonHeading: "How to avoid cringe",
    comparisonIntro:
      "You do not need to sound profound. You need to sound like a person.",
    comparisons: [
      {
        title: "Use plain language",
        text: "A question should not feel like it was workshopped under a waterfall.",
      },
      {
        title: "Leave room",
        text: "Do not demand depth. Let people bring it if they have it on them.",
      },
      {
        title: "Permit jokes",
        text: "A conversation starter that cannot survive laughter is overdressed.",
      },
    ],
    faqs: [
      {
        question: "What makes a conversation starter non-cringe?",
        answer: "Plain language, room for humor, and no pressure to perform emotional depth.",
      },
      {
        question: "Are Jous prompts self-help prompts?",
        answer: "No. Jous is built around random conversation, not fixing people.",
      },
      {
        question: "Can non-cringe starters still be meaningful?",
        answer: "Yes. Meaning usually works better when nobody drags it in by the collar.",
      },
      {
        question: "Are these starters free?",
        answer: "Yes. You can draw non-cringe conversation starters for free.",
      },
    ],
  }),

  "/printable-conversation-cards": buildPage({
    path: "/printable-conversation-cards",
    title: "Printable Conversation Cards | Jous",
    description:
      "Printable-style conversation cards from Jous, for people who like paper but do not need a precious little deck ceremony.",
    keywords:
      "printable conversation cards, free printable conversation cards, conversation cards pdf",
    navLabel: "Printable",
    shortDescription: "A few app prompts to print.",
    kicker: "Printable conversation cards",
    h1: "Printable Conversation Cards",
    lede:
      "If you want paper, use these as a small exportable set. If the printer starts judging you, the online cards are still here.",
    previewLabel: "Printable card",
    primaryCta: "Draw a printable card",
    examplesHeading: "A small printable set",
    examplesIntro:
      "Copy a few into your notes, print them, or write them badly on scraps. The card does not care.",
    examples: [
      "What was your worst sleeping condition until now?",
      "Do you remember your best Hug?",
      "What was the last thing you were ashamed of that you are not any more?",
      "When was the last time you were surprised?",
    ],
    comparisonHeading: "Printable vs online",
    comparisonIntro:
      "Paper is nice. Randomness is useful. Jous leaves both options on the table.",
    comparisons: [
      {
        title: "Printable cards",
        text: "Good for events, tables, and places where phones would ruin the room.",
      },
      {
        title: "Online cards",
        text: "Better when you want endless draws without preparing anything.",
      },
      {
        title: "Physical decks",
        text: "Lovely objects, but they run out of surprise faster than people admit.",
      },
    ],
    faqs: [
      {
        question: "Can I print these conversation cards?",
        answer: "Yes. This page gives a small set you can copy or print, and Jous also offers random online draws.",
      },
      {
        question: "Is there a PDF?",
        answer: "Not yet. This page is the lightweight printable set for now.",
      },
      {
        question: "Are printable cards better than online cards?",
        answer: "Only sometimes. Printable cards are good for planned settings; online cards are better for spontaneous use.",
      },
      {
        question: "Are these cards free to use?",
        answer: "Yes. The Jous card experience is free to use.",
      },
    ],
  }),

  "/open-source-card-dataset": buildPage({
    path: "/open-source-card-dataset",
    title: "Open-Source Card Dataset | Jous",
    description:
      "The Jous open-source card dataset page: random conversation prompts, public project links, and room to remix the deck.",
    keywords:
      "open source card dataset, conversation card dataset, open source conversation prompts",
    navLabel: "Dataset",
    shortDescription: "Public source, real prompts.",
    kicker: "Open-source card dataset",
    h1: "Open-Source Card Dataset",
    lede:
      "The cards are not guarded in a tower. Jous keeps the project public so the question set can be inspected, improved, and remixed.",
    previewLabel: "Dataset card",
    primaryCta: "Draw from the set",
    examplesHeading: "Dataset sample",
    examplesIntro:
      "A dataset can still have a pulse. These are conversation prompts, not spreadsheet wallpaper.",
    examples: [
      "What has been your deepest impact on a single person so far?",
      "What are your unavoidable realities? Stuff you cannot postpone either at all or the cost would be extremely high ",
      "What is the oldest thing you have seen, and oldest thing you own?",
      "What is the thing that is the most your own, or you have least risk of losing it?",
    ],
    comparisonHeading: "Why publish the set?",
    comparisonIntro:
      "Public prompts make it easier to trust, translate, remix, and improve the deck.",
    comparisons: [
      {
        title: "For builders",
        text: "Use the source project as a starting point for your own conversation tool.",
      },
      {
        title: "For writers",
        text: "Study what makes a question too polished, too vague, or just alive enough.",
      },
      {
        title: "For translators",
        text: "Adapt prompts into another language without pretending literal translation is culture.",
      },
    ],
    faqs: [
      {
        question: "Is the Jous card dataset public?",
        answer: "The Jous source repository is public and linked from this page.",
      },
      {
        question: "Can I remix the questions?",
        answer: "Yes. The open-source project is meant to be inspected and adapted.",
      },
      {
        question: "Can I add prompts to the dataset?",
        answer: "Yes. Jous supports adding new questions to the card set.",
      },
      {
        question: "Is this page for developers only?",
        answer: "No. It is also useful for anyone curious about where the cards come from.",
      },
    ],
  }),
};

export const conversationCardSpokeLinks = Object.values(conversationCardSpokePages).map((page) => ({
  href: page.path,
  label: page.navLabel,
  description: page.shortDescription,
}));
