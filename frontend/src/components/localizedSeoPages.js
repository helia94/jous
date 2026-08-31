import { buildPage } from "./conversationCardSeoPages.js";

// Localized SEO landing pages. Example cards are real translated questions from the
// Jous question set (fetched from /api/question/random?language_id=xx on 2026-08-31).
// `group` links the language variants of the same page for hreflang.

const UI = {
  de: {
    loading: "Karte wird gezogen…",
    secondaryCta: "Zur Zufallskarten-App",
    backToHub: "Zurück zur Übersicht",
    viewSource: "Quellcode ansehen",
    faqHeading: "Häufige Fragen",
    whyLabel: "Warum Jous",
    stats: [
      { value: "Kostenlos", label: "keine Box, kein Abo, kein Login" },
      { value: "Zufällig", label: "die nächste Karte kennt niemand vorher" },
      { value: "Open Source", label: "Fragen und App sind öffentlich und erweiterbar" },
    ],
    sourceText: "Jous ist öffentlich und ehrlich: eine App für zufällige Gesprächskarten. Die Fragen kann jeder ansehen, ergänzen und verbessern.",
  },
  es: {
    loading: "Sacando una carta…",
    secondaryCta: "Abrir la app de cartas al azar",
    backToHub: "Volver al inicio de cartas",
    viewSource: "Ver el código fuente",
    faqHeading: "Preguntas frecuentes",
    whyLabel: "Por qué Jous",
    stats: [
      { value: "Gratis", label: "sin caja, sin suscripción, sin registro" },
      { value: "Al azar", label: "nadie sabe cuál es la siguiente carta" },
      { value: "Open source", label: "las preguntas y la app son públicas y se pueden ampliar" },
    ],
    sourceText: "Jous es público y directo: una app de cartas de conversación al azar. Cualquiera puede ver, añadir y mejorar las preguntas.",
  },
  fa: {
    loading: "در حال کشیدن کارت…",
    secondaryCta: "باز کردن اپ کارت تصادفی",
    backToHub: "بازگشت به صفحه‌ی کارت‌ها",
    viewSource: "دیدن کد منبع",
    faqHeading: "سوال‌های پرتکرار",
    whyLabel: "چرا Jous",
    stats: [
      { value: "رایگان", label: "بدون جعبه، بدون اشتراک، بدون ثبت‌نام" },
      { value: "تصادفی", label: "هیچ‌کس نمی‌دونه کارت بعدی چیه" },
      { value: "متن‌باز", label: "سوال‌ها و اپ عمومی‌ان و هر کسی می‌تونه سوال اضافه کنه" },
    ],
    sourceText: "Jous یه اپ کارت گفتگوی تصادفی و متن‌بازه. سوال‌ها عمومی‌ان؛ هر کسی می‌تونه ببینه، اضافه کنه و بهترشون کنه.",
  },
};

const localized = (lang, group, def) => {
  const ui = UI[lang];
  const page = buildPage({
    ...def,
    appHref: `/random?lang=${lang}`,
    filters: { language_id: lang },
    sourceHeading: def.sourceHeading,
  });
  return {
    ...page,
    lang,
    dir: lang === "fa" ? "rtl" : "ltr",
    group,
    ui,
    secondaryCta: ui.secondaryCta,
    statCards: ui.stats,
    sourceText: ui.sourceText,
  };
};

export const localizedSeoPages = {
  "/de/gespraechskarten": localized("de", "hub", {
    path: "/de/gespraechskarten",
    title: "Gesprächskarten online – kostenlos, zufällig, Open Source | Jous",
    description:
      "Gesprächskarten online ziehen, ohne Ratgeber-Ton: Jous ist eine kostenlose Open-Source-App mit über 1.500 zufälligen Fragen auf Deutsch. Kein Deck, kein Login.",
    keywords: "gesprächskarten, gesprächskarten online, kostenlose gesprächskarten, fragen zum kennenlernen, gesprächsstarter",
    navLabel: "Deutsch",
    shortDescription: "Gesprächskarten auf Deutsch.",
    kicker: "Gesprächskarten von Jous",
    h1: "Gesprächskarten, die nicht cringe sind",
    lede:
      "Zieh eine zufällige Karte. Manche Fragen sind albern, manche tief – und niemand weiß vorher, welche kommt. Kein Selbsthilfe-Ton, kein Kartendeck zum Mitschleppen, kein Login.",
    previewLabel: "Zufällige Karte",
    primaryCta: "Karte ziehen",
    examplesHeading: "Beispiele für Gesprächskarten",
    examplesIntro: "Echte Karten aus dem Jous-Fragenpool, übersetzt ins Deutsche.",
    examples: [
      "Wann war das letzte Mal, dass du *fast* aufgegeben hättest, aber im Nachhinein froh warst, es nicht getan zu haben?",
      "Wenn du einen kurzen Moment in deinem Leben noch einmal erleben könntest – nur zum Beobachten –, welcher wäre es?",
      "Wie oft gibst du Projekte auf, und wie oft Menschen?",
      "Welcher Teil deiner Weltanschauung macht dir am meisten Angst, falsch zu liegen?",
    ],
    comparisonHeading: "Online-Karten statt Kartendeck",
    comparisonIntro: "Ein Deck liegt schön auf dem Tisch. Und meistens zu Hause, wenn man es bräuchte.",
    comparisons: [
      { title: "Physische Decks", text: "Hübsch, aber endlich und teuer. Jous hat über 1.500 Fragen und ist immer da, wo dein Handy ist." },
      { title: "Fragenlisten zum Ausdrucken", text: "Einmal nützlich, dann abgenutzt. Zufällige Karten funktionieren, weil keiner die nächste Seite sieht." },
      { title: "Selbsthilfe-Apps", text: "Jous will niemanden reparieren. Die Karten sind mal lustig, mal seltsam, mal tief – je nachdem, was kommt." },
    ],
    sourceHeading: "Teil des Open-Source-Kartensets von Jous",
    faqs: [
      { question: "Was sind Gesprächskarten?", answer: "Gesprächskarten sind Fragen, die man zieht, wenn man ein besseres Thema braucht als das Wetter. Bei Jous sind sie zufällig und online statt in einer Box." },
      { question: "Sind die Gesprächskarten von Jous kostenlos?", answer: "Ja. Du kannst ohne Kauf und ohne Anmeldung Karten ziehen." },
      { question: "Gibt es die Fragen auf Deutsch?", answer: "Ja. Der gesamte Fragenpool ist ins Deutsche übersetzt; du kannst jederzeit zwischen Deutsch, Englisch, Spanisch und Persisch wechseln." },
      { question: "Für wen sind die Karten?", answer: "Für Freunde, Dates, Paare, Familie, WG-Abende oder Fremde im Zug. Es gibt keinen Beziehungs-Coach dahinter." },
    ],
  }),

  "/de/zufaellige-fragen": localized("de", "random", {
    path: "/de/zufaellige-fragen",
    title: "Zufällige Fragen zum Kennenlernen und Reden | Jous",
    description:
      "Zufällige Fragen für bessere Gespräche: lustig, seltsam, tief. Über 1.500 Fragen auf Deutsch, kostenlos und ohne Anmeldung – aus der Open-Source-App Jous.",
    keywords: "zufällige fragen, fragen zum kennenlernen, fragen für gespräche, gesprächsstarter, tiefgründige fragen",
    navLabel: "Zufällige Fragen",
    shortDescription: "Eine Frage nach der anderen.",
    kicker: "Zufällige Fragen",
    h1: "Zufällige Fragen für bessere Gespräche",
    lede:
      "Keine Kategorien, kein Plan. Du bekommst eine Frage, redest darüber, ziehst die nächste. Wenn du schon weißt, wohin das Gespräch geht, ist es ein Meeting.",
    previewLabel: "Zufällige Frage",
    primaryCta: "Nächste Frage",
    examplesHeading: "Ein paar zufällige Fragen",
    examplesIntro: "Manche klein, manche seltsam, manche bleiben eine Stunde sitzen.",
    examples: [
      "Wen würde es überraschen zu erfahren, dass du so oft an sie denkst?",
      "Wie oft kannst du aus den Augen einer neuen Person erkennen, ob du sie mögen wirst?",
      "Wünschst du dir mehr Verständnis und Höflichkeit oder lieber mehr Ehrlichkeit von den Menschen in deinem Leben?",
      "Ist ein Fraktal eher etwas Komplexes oder etwas Einfaches?",
    ],
    comparisonHeading: "Warum zufällig?",
    comparisonIntro: "Vorbereitete Fragen klingen vorbereitet. Zufall nicht.",
    comparisons: [
      { title: "Niemand kann sich vorbereiten", text: "Die Frage kommt für alle gleichzeitig. Das macht die Antworten ehrlicher." },
      { title: "Keine Listen zum Abarbeiten", text: "Es gibt kein „Frage 37 von 100“. Nur die nächste Karte." },
      { title: "Passt in jede Lücke", text: "Am Tisch, beim Spazieren, im Gruppenchat, im Auto – eine Frage reicht." },
    ],
    sourceHeading: "Alle Fragen sind Open Source",
    faqs: [
      { question: "Woher kommen die Fragen?", answer: "Aus dem offenen Jous-Fragenpool. Jeder kann Fragen hinzufügen; der Pool wächst aus echten Einreichungen." },
      { question: "Kann ich Fragen nach Thema filtern?", answer: "Ja. In der App kannst du nach Anlass und Tiefe filtern – oder einfach alles zufällig ziehen." },
      { question: "Sind die Fragen nur für Paare?", answer: "Nein. Freunde, Familie, Dates, Kolleg:innen, Fremde – die Fragen sind breit genug für alle." },
    ],
  }),

  "/es/cartas-de-conversacion": localized("es", "hub", {
    path: "/es/cartas-de-conversacion",
    title: "Cartas de conversación online, gratis y sin cursilería | Jous",
    description:
      "Cartas de conversación online al azar: más de 1.500 preguntas en español, gratis, open source y sin registro. Divertidas, raras y a veces profundas. Nada de guiones de autoayuda.",
    keywords: "cartas de conversación, cartas de conversacion, cartas para conversar, preguntas para conversar, cartas de conversación online, cartas de conversación gratis",
    navLabel: "Español",
    shortDescription: "Cartas de conversación en español.",
    kicker: "Cartas de conversación de Jous",
    h1: "Cartas de conversación que no dan vergüenza ajena",
    lede:
      "Saca una carta al azar. Algunas preguntas son tontas, otras profundas, y nadie sabe cuál viene. Sin guion de autoayuda, sin baraja que cargar, sin registro.",
    previewLabel: "Carta al azar",
    primaryCta: "Sacar una carta",
    examplesHeading: "Ejemplos de cartas de conversación",
    examplesIntro: "Cartas reales del mazo de Jous, traducidas al español.",
    examples: [
      "¿Qué es algo que ya sabes, pero necesitas que te lo recuerden seguido?",
      "¿Cuándo fue la última vez que te sorprendiste?",
      "¿En qué situaciones la gente valora más tu presencia?",
      "¿Con quién estás enojado, pero haces como si no pasara nada?",
    ],
    comparisonHeading: "Cartas online en vez de una baraja",
    comparisonIntro: "Una baraja queda bonita en la mesa. Y casi siempre en casa cuando hace falta.",
    comparisons: [
      { title: "Barajas físicas", text: "Bonitas, pero limitadas y caras. Jous tiene más de 1.500 preguntas y está donde esté tu teléfono." },
      { title: "Listas para imprimir", text: "Sirven una vez y se gastan. Las cartas al azar funcionan porque nadie ve la siguiente página." },
      { title: "Apps de autoayuda", text: "Jous no intenta arreglar a nadie. Las cartas pueden ser graciosas, raras o profundas, según lo que salga." },
    ],
    sourceHeading: "Parte del mazo open source de Jous",
    faqs: [
      { question: "¿Qué son las cartas de conversación?", answer: "Son preguntas que sacas cuando necesitas algo mejor de qué hablar que el clima. En Jous son al azar y online, no una caja." },
      { question: "¿Las cartas de Jous son gratis?", answer: "Sí. Puedes sacar cartas sin pagar ni crear una cuenta." },
      { question: "¿Están en español?", answer: "Sí. Todo el mazo está traducido al español y puedes cambiar entre español, inglés, alemán y persa cuando quieras." },
      { question: "¿Para quién son?", answer: "Para amigos, citas, parejas, familia o desconocidos en un tren. No hay un coach de pareja detrás." },
    ],
  }),

  "/es/preguntas-para-conversar": localized("es", "random", {
    path: "/es/preguntas-para-conversar",
    title: "Preguntas para conversar: al azar, profundas y raras | Jous",
    description:
      "Preguntas para conversar al azar: divertidas, raras y profundas. Más de 1.500 preguntas en español, gratis y sin registro, de la app open source Jous.",
    keywords: "preguntas para conversar, preguntas aleatorias, preguntas para conocer a alguien, preguntas profundas, temas de conversación",
    navLabel: "Preguntas para conversar",
    shortDescription: "Una pregunta y luego la siguiente.",
    kicker: "Preguntas al azar",
    h1: "Preguntas para conversar (al azar)",
    lede:
      "Sin categorías, sin plan. Sale una pregunta, hablan de ella, sacan la siguiente. Si ya sabes adónde va la conversación, eso es una reunión.",
    previewLabel: "Pregunta al azar",
    primaryCta: "Siguiente pregunta",
    examplesHeading: "Algunas preguntas al azar",
    examplesIntro: "Algunas pequeñas, algunas raras, algunas se quedan una hora.",
    examples: [
      "¿Para qué no estabas preparado?",
      "¿Qué tipo de sueño quisieras dejar de tener?",
      "¿Cuándo, si es que alguna vez, entendiste el valor de la privacidad?",
      "¿Alguna vez has estado en una comunidad que se vino abajo socialmente?",
    ],
    comparisonHeading: "¿Por qué al azar?",
    comparisonIntro: "Las preguntas preparadas suenan preparadas. El azar no.",
    comparisons: [
      { title: "Nadie puede prepararse", text: "La pregunta llega para todos al mismo tiempo. Eso hace las respuestas más honestas." },
      { title: "Sin listas que completar", text: "No hay «pregunta 37 de 100». Solo la siguiente carta." },
      { title: "Cabe en cualquier hueco", text: "En la mesa, caminando, en el chat del grupo, en el coche: con una pregunta basta." },
    ],
    sourceHeading: "Todas las preguntas son open source",
    faqs: [
      { question: "¿De dónde salen las preguntas?", answer: "Del mazo abierto de Jous. Cualquiera puede añadir preguntas; el mazo crece con envíos reales." },
      { question: "¿Puedo filtrar por tema?", answer: "Sí. En la app puedes filtrar por ocasión y profundidad, o sacar todo al azar." },
      { question: "¿Son solo para parejas?", answer: "No. Amigos, familia, citas, colegas, desconocidos: las preguntas son lo bastante amplias para todos." },
    ],
  }),

  "/fa/conversation-cards": localized("fa", "hub", {
    path: "/fa/conversation-cards",
    title: "کارت گفتگو آنلاین | رایگان، تصادفی، بدون کلیشه | Jous",
    description:
      "کارت گفتگوی آنلاین و تصادفی: بیش از ۱۵۰۰ سوال فارسی، رایگان، متن‌باز و بدون ثبت‌نام. بعضی سوال‌ها بامزه‌ان، بعضی عمیق. بدون لحن خودیاری.",
    keywords: "کارت گفتگو, کارت های گفتگو, سوال برای شروع گفتگو, سوالات آشنایی, کارت گفتگو آنلاین, سوالات غیر کلیشه ای",
    navLabel: "فارسی",
    shortDescription: "کارت گفتگو به فارسی.",
    kicker: "کارت‌های گفتگوی Jous",
    h1: "کارت‌های گفتگو، بدون کلیشه",
    lede:
      "یه کارت تصادفی بکش. بعضی سوال‌ها بامزه‌ان، بعضی عمیق، و هیچ‌کس نمی‌دونه بعدی چیه. بدون لحن خودیاری، بدون جعبه‌ای که همراهت باشه، بدون ثبت‌نام.",
    previewLabel: "کارت تصادفی",
    primaryCta: "یه کارت بکش",
    examplesHeading: "نمونه‌ی کارت‌های گفتگو",
    examplesIntro: "کارت‌های واقعی از مجموعه‌ی Jous، به فارسی.",
    examples: [
      "تو چه چیزی رو جدی می‌گیری که بیشتر آدما بهش اهمیت نمی‌دن؟",
      "آخرین باری که حس کردی به یکی از حد و مرزهای درونی‌ات رسیدی، کی بود؟",
      "می‌تونی هر وقت بخوای خودت رو راحت‌تر و بازتر نشون بدی؟",
      "آیا غذایی یا نوشیدنی‌ای هست که طعمش بتونه احساساتت رو برانگیخته کنه؟",
    ],
    comparisonHeading: "کارت آنلاین به جای جعبه‌ی کارت",
    comparisonIntro: "جعبه‌ی کارت روی میز قشنگه. و معمولاً وقتی لازمش داری، خونه جا مونده.",
    comparisons: [
      { title: "کارت‌های فیزیکی", text: "قشنگ ولی محدود و گرون. Jous بیش از ۱۵۰۰ سوال داره و همون‌جاییه که گوشی‌ت هست." },
      { title: "لیست سوال‌های آماده", text: "یه بار به درد می‌خوره و تموم میشه. کارت تصادفی جواب میده چون کسی صفحه‌ی بعد رو ندیده." },
      { title: "اپ‌های خودیاری", text: "Jous نمی‌خواد کسی رو درست کنه. کارت‌ها گاهی بامزه‌ان، گاهی عجیب، گاهی عمیق؛ بسته به این‌که چی بیاد." },
    ],
    sourceHeading: "بخشی از مجموعه‌ی متن‌باز Jous",
    faqs: [
      { question: "کارت گفتگو چیه؟", answer: "سوال‌هایی که وقتی موضوع بهتری از هوا لازم داری، می‌کشی. توی Jous تصادفی و آنلاین‌ان، نه توی جعبه." },
      { question: "کارت‌های Jous رایگانه؟", answer: "بله. بدون خرید و بدون ساختن حساب می‌تونی کارت بکشی." },
      { question: "سوال‌ها فارسی هستن؟", answer: "بله. کل مجموعه به فارسی ترجمه شده و هر وقت بخوای می‌تونی بین فارسی، انگلیسی، آلمانی و اسپانیایی جابه‌جا شی." },
      { question: "برای کیه؟", answer: "برای دوست‌ها، قرار، زوج‌ها، خانواده یا غریبه‌ها توی قطار. مربی رابطه پشتش نیست." },
    ],
  }),

  "/fa/random-questions": localized("fa", "random", {
    path: "/fa/random-questions",
    title: "سوال تصادفی برای شروع گفتگو | Jous",
    description:
      "سوال‌های تصادفی برای گفتگوی بهتر: بامزه، عجیب، عمیق. بیش از ۱۵۰۰ سوال فارسی، رایگان و بدون ثبت‌نام، از اپ متن‌باز Jous.",
    keywords: "سوال تصادفی, سوال برای شروع گفتگو, سوالات آشنایی, سوال عمیق, موضوع گفتگو",
    navLabel: "سوال تصادفی",
    shortDescription: "یه سوال، بعد سوال بعدی.",
    kicker: "سوال‌های تصادفی",
    h1: "سوال‌های تصادفی برای گفتگو",
    lede:
      "بدون دسته‌بندی، بدون برنامه. یه سوال میاد، درباره‌ش حرف می‌زنید، بعدی رو می‌کشید. اگه از قبل می‌دونی گفتگو به کجا می‌رسه، اسمش جلسه‌ست.",
    previewLabel: "سوال تصادفی",
    primaryCta: "سوال بعدی",
    examplesHeading: "چند سوال تصادفی",
    examplesIntro: "بعضی کوچیک، بعضی عجیب، بعضی یه ساعت می‌مونن.",
    examples: [
      "تو هم هر روز توی ذهنت سر بقیه داد و بیداد می‌کنی؟",
      "اولین بار که دیدیش، کیو دست‌کم گرفتی و به اندازه‌ی کافی بهش احترام نذاشتی؟",
      "رابطه‌ات داره با گذشت زمان بهتر میشه؟ برات مهمه که حتماً پیشرفت کنه یا ترجیح میدی یه رابطه پایدار باشه؟",
      "تا حالا کاری کردی که کسی رو که گفته بودی هیچ‌وقت فراموشش نمی‌کنی، فراموش کنی؟",
    ],
    comparisonHeading: "چرا تصادفی؟",
    comparisonIntro: "سوال آماده، آماده به نظر میاد. تصادفی نه.",
    comparisons: [
      { title: "کسی نمی‌تونه آماده باشه", text: "سوال برای همه هم‌زمان میاد. جواب‌ها صادقانه‌تر میشن." },
      { title: "لیستی برای تموم کردن نیست", text: "«سوال ۳۷ از ۱۰۰» وجود نداره. فقط کارت بعدی." },
      { title: "توی هر فرصتی جا میشه", text: "سر میز، توی پیاده‌روی، توی گروه چت، توی ماشین؛ یه سوال کافیه." },
    ],
    sourceHeading: "همه‌ی سوال‌ها متن‌بازن",
    faqs: [
      { question: "سوال‌ها از کجا میان؟", answer: "از مجموعه‌ی باز Jous. هر کسی می‌تونه سوال اضافه کنه؛ مجموعه با سوال‌های واقعی آدم‌ها بزرگ میشه." },
      { question: "می‌تونم موضوع رو فیلتر کنم؟", answer: "بله. توی اپ می‌تونی بر اساس موقعیت و عمق فیلتر کنی، یا همه رو تصادفی بکشی." },
      { question: "فقط برای زوج‌هاست؟", answer: "نه. دوست‌ها، خانواده، قرار، همکارها، غریبه‌ها؛ سوال‌ها برای همه به اندازه‌ی کافی گسترده‌ان." },
    ],
  }),
};

export const localizedSeoLinks = Object.values(localizedSeoPages).map((page) => ({
  href: page.path,
  label: page.navLabel,
  description: page.shortDescription,
  lang: page.lang,
}));

// hreflang groups: English page path + localized variants
export const hreflangGroups = {
  hub: { en: "/conversation-cards", de: "/de/gespraechskarten", es: "/es/cartas-de-conversacion", fa: "/fa/conversation-cards" },
  random: { en: "/random-conversation-cards", de: "/de/zufaellige-fragen", es: "/es/preguntas-para-conversar", fa: "/fa/random-questions" },
};
