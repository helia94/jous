import React, { useEffect, useState } from "react";
import Axios from "axios";
import { Helmet } from "react-helmet";
import { useLocation } from "react-router-dom";
import { Button } from "./ui";
import { trackEvent } from "./analytics";
import { conversationCardSpokePages } from "./conversationCardSeoPages";
import "./ConversationCards.css";

const sourceUrl = "https://github.com/helia94/jous";

function buildFaqSchema(faqs) {
  return {
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
}

function trackSeoEvent(action, pagePath) {
  trackEvent({
    category: "SEO landing page",
    action,
    label: pagePath,
  });
}

function ConversationCardSpoke() {
  const location = useLocation();
  const page = conversationCardSpokePages[location.pathname] || conversationCardSpokePages["/online-conversation-cards"];
  const [currentCard, setCurrentCard] = useState(page.examples[0]);
  const [cardIndex, setCardIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const faqSchema = buildFaqSchema(page.faqs);

  const fetchRandomCard = async ({ source = "button" } = {}) => {
    if (source === "button") {
      trackSeoEvent("draw_card_click", page.path);
    }

    setLoading(true);
    try {
      const res = await Axios.get("/api/question/random", {
        params: page.filters,
      });
      const question = res.data?.questions?.[0]?.question?.content;
      if (question) {
        setCurrentCard(question);
        trackSeoEvent("card_draw_success", page.path);
        return;
      }
    } catch (error) {
      const nextIndex = (cardIndex + 1) % page.examples.length;
      setCardIndex(nextIndex);
      setCurrentCard(page.examples[nextIndex]);
      trackSeoEvent("card_draw_fallback", page.path);
    } finally {
      setLoading(false);
    }
  };

  const openRandomApp = () => {
    trackSeoEvent("random_app_cta_click", page.path);
  };

  useEffect(() => {
    fetchRandomCard({ source: "page_load" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page.path]);

  return (
    <>
      <Helmet>
        <title>{page.title}</title>
        <meta name="description" content={page.description} />
        <meta name="keywords" content={page.keywords} />
        <meta property="og:title" content={page.title} />
        <meta property="og:description" content={page.ogDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://jous.app${page.path}`} />
        <link rel="canonical" href={`https://jous.app${page.path}`} />
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <main className="conversation-cards-page">
        <section className="conversation-cards-hero" aria-labelledby="conversation-card-spoke-title">
          <div className="conversation-cards-copy">
            <p className="conversation-cards-kicker">{page.kicker}</p>
            <h1 id="conversation-card-spoke-title">{page.h1}</h1>
            <p className="conversation-cards-lede">{page.lede}</p>
            <div className="conversation-cards-actions">
              <Button onClick={() => fetchRandomCard()} disabled={loading}>
                {loading ? "Drawing..." : page.primaryCta}
              </Button>
              <a className="conversation-cards-secondary" href={page.appHref} onClick={openRandomApp}>
                {page.secondaryCta}
              </a>
            </div>
          </div>

          <div className="conversation-cards-preview" aria-live="polite">
            <span className="conversation-cards-preview-label">{page.previewLabel}</span>
            <p>{currentCard}</p>
          </div>
        </section>

        <section className="conversation-cards-stats" aria-label="Why use Jous">
          {page.statCards.map((item) => (
            <div key={item.value}>
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </div>
          ))}
        </section>

        <section className="conversation-cards-section">
          <div className="conversation-cards-section-heading">
            <h2>{page.examplesHeading}</h2>
            <p>{page.examplesIntro}</p>
          </div>
          <div className="conversation-cards-example-grid">
            {page.examples.map((card) => (
              <article className="conversation-cards-example" key={card}>
                <p>{card}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="conversation-cards-section">
          <div className="conversation-cards-section-heading">
            <h2>{page.comparisonHeading}</h2>
            <p>{page.comparisonIntro}</p>
          </div>
          <div className="conversation-cards-comparison-grid">
            {page.comparisons.map((item) => (
              <article className="conversation-cards-comparison" key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="conversation-cards-section conversation-cards-source">
          <h2>{page.sourceHeading}</h2>
          <p>{page.sourceText}</p>
          <a href="/conversation-cards">Back to the conversation cards hub</a>
          <a href={sourceUrl} rel="noreferrer" target="_blank">
            View the source repository
          </a>
        </section>

        <section className="conversation-cards-section conversation-cards-faq">
          <h2>{page.h1} FAQ</h2>
          {page.faqs.map((item) => (
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

export default ConversationCardSpoke;
