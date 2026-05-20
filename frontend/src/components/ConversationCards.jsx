import React, { useEffect, useState } from "react";
import Axios from "axios";
import { Helmet } from "react-helmet";
import { Button } from "./ui";
import { trackEvent } from "./analytics";
import { conversationCardSpokeLinks } from "./conversationCardSeoPages";
import "./ConversationCards.css";

const fallbackCards = [
  "Who in your life has (in your view) the perfect combination of being nice and being honest?",
  "Do you often listen to sad music?",
  "What was your last failure? ",
  "What's the closest thing to magic for you?",
];

const comparisons = [
  {
    title: "Physical decks",
    text: "Nice on a table, easy to forget at home. Jous is always online and keeps serving a different card.",
  },
  {
    title: "Printable PDFs",
    text: "Useful once, stale fast. Random cards are better when nobody can see the next page coming.",
  },
  {
    title: "Self-help card apps",
    text: "Jous is not trying to fix anyone. The cards can be funny, weird, casual, or deeper depending on the draw.",
  },
];

const faqs = [
  {
    question: "What are conversation cards?",
    answer:
      "Conversation cards are prompts or questions you draw when you want something to talk about. Jous makes them random and online instead of packaged as a physical deck.",
  },
  {
    question: "Are Jous conversation cards free?",
    answer:
      "Yes. You can draw random conversation cards online without buying a deck or signing up.",
  },
  {
    question: "Are the prompts open source?",
    answer:
      "Yes. Jous is open source, so the product and question set can be inspected, forked, and improved. Anyone can add a question to the mix.",
  },
  {
    question: "Can anyone add conversation cards?",
    answer:
      "Yes. Jous questions are not locked behind one editor or one company. Anyone can add a question, and the public set grows from there.",
  },
  {
    question: "Are these cards only for couples?",
    answer:
      "No. The cards can work for friends, dates, groups, family, or bored people in a room.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

function ConversationCards() {
  const [currentCard, setCurrentCard] = useState(fallbackCards[0]);
  const [cardIndex, setCardIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchRandomCard = async () => {
    trackEvent({
      category: "SEO landing page",
      action: "draw_card_click",
      label: "/conversation-cards",
    });

    setLoading(true);
    try {
      const res = await Axios.get("/api/question/random");
      const question = res.data?.questions?.[0]?.question?.content;
      if (question) {
        setCurrentCard(question);
        trackEvent({
          category: "SEO landing page",
          action: "card_draw_success",
          label: "/conversation-cards",
        });
        return;
      }
    } catch (error) {
      const nextIndex = (cardIndex + 1) % fallbackCards.length;
      setCardIndex(nextIndex);
      setCurrentCard(fallbackCards[nextIndex]);
      trackEvent({
        category: "SEO landing page",
        action: "card_draw_fallback",
        label: "/conversation-cards",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    Axios.get("/api/question/random")
      .then((res) => {
        const question = res.data?.questions?.[0]?.question?.content;
        if (question) {
          setCurrentCard(question);
          trackEvent({
            category: "SEO landing page",
            action: "card_draw_success",
            label: "/conversation-cards",
          });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Helmet>
        <title>Conversation Cards | Open-Source, Random, Not Cringe | Jous</title>
        <meta
          name="description"
          content="Jous is an open-source conversation card app with a large random question set. No self-help scripts, no cringe prompts, just cards for real conversations."
        />
        <meta
          name="keywords"
          content="conversation cards, conversation card app, online conversation cards, random conversation cards, open source conversation cards, free conversation cards"
        />
        <meta property="og:title" content="Conversation Cards | Open-Source, Random, Not Cringe | Jous" />
        <meta
          property="og:description"
          content="Draw random conversation cards online. Open source, free, weird, funny, deep, and not self-help."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://jous.app/conversation-cards" />
        <link rel="canonical" href="https://jous.app/conversation-cards" />
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <main className="conversation-cards-page">
        <section className="conversation-cards-hero" aria-labelledby="conversation-cards-title">
          <div className="conversation-cards-copy">
            <p className="conversation-cards-kicker">Jous conversation cards</p>
            <h1 id="conversation-cards-title">Open-Source Conversation Cards</h1>
            <p className="conversation-cards-lede">
              Random conversation cards for funny, weird, casual, and deeper questions. No self-help script.
              No deck to carry. No forced profundity. Anyone can add a question.
            </p>
            <div className="conversation-cards-actions">
              <Button onClick={fetchRandomCard} disabled={loading}>
                {loading ? "Drawing..." : "Draw a random card"}
              </Button>
              <a
                className="conversation-cards-secondary"
                href="/random"
                onClick={() =>
                  trackEvent({
                    category: "SEO landing page",
                    action: "random_app_cta_click",
                    label: "/conversation-cards",
                  })
                }
              >
                Open the random card app
              </a>
            </div>
          </div>

          <div className="conversation-cards-preview" aria-live="polite">
            <span className="conversation-cards-preview-label">Random card</span>
            <p>{currentCard}</p>
          </div>
        </section>

        <section className="conversation-cards-stats" aria-label="Why Jous">
          <div>
            <strong>1,577</strong>
            <span>questions and prompts</span>
          </div>
          <div>
            <strong>Open source</strong>
            <span>inspect, fork, and remix the product</span>
          </div>
          <div>
            <strong>Anyone can add</strong>
            <span>the question set grows from real submissions</span>
          </div>
        </section>

        <section className="conversation-cards-section">
          <div className="conversation-cards-section-heading">
            <h2>Examples of random conversation cards</h2>
            <p>Jous mixes funny, weird, low-stakes, and deeper prompts in one draw pile.</p>
          </div>
          <div className="conversation-cards-example-grid">
            {fallbackCards.map((card) => (
              <article className="conversation-cards-example" key={card}>
                <p>{card}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="conversation-cards-section">
          <div className="conversation-cards-section-heading">
            <h2>Online cards beat predictable decks</h2>
            <p>Jous is built for people who want a question now, not a polished box of personality homework.</p>
          </div>
          <div className="conversation-cards-comparison-grid">
            {comparisons.map((item) => (
              <article className="conversation-cards-comparison" key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="conversation-cards-section conversation-cards-source">
          <h2>Open source, on purpose</h2>
          <p>
            Jous is not a black-box prompt deck. The app is public, so the question set and product direction can be
            inspected and improved. Questions can be added by anyone, which keeps the card set less polished and more
            alive.
          </p>
          <a href="https://github.com/helia94/jous" rel="noreferrer" target="_blank">
            View the source repository
          </a>
        </section>

        <section className="conversation-cards-section">
          <div className="conversation-cards-section-heading">
            <h2>Other doors</h2>
            <p>Same pile of cards. Different ways in.</p>
          </div>
          <div className="conversation-cards-link-grid">
            {conversationCardSpokeLinks.map((link) => (
              <a className="conversation-cards-link-card" href={link.href} key={link.href}>
                <strong>{link.label}</strong>
                <span>{link.description}</span>
              </a>
            ))}
          </div>
        </section>

        <section className="conversation-cards-section conversation-cards-faq">
          <h2>Conversation cards FAQ</h2>
          {faqs.map((item) => (
            <article key={item.question}>
              <h3>{item.question}</h3>
              <p>{item.answer}</p>
            </article>
          ))}
        </section>
      </main>
    </>
  );
}

export default ConversationCards;
