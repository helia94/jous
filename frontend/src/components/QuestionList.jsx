import React from "react";
import { Helmet } from "react-helmet";
import { useLocation } from "react-router-dom";
import { trackEvent } from "./analytics";
import { curatedLists, curatedListLinks } from "./curatedLists";
import "./ConversationCards.css";

const siteUrl = "https://jous.app";

function itemListSchema(list) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: list.h1,
    description: list.description,
    numberOfItems: list.questions.length,
    itemListElement: list.questions.map((q, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: q.text,
      url: `${siteUrl}/question/${q.id}`,
    })),
  };
}

function QuestionList() {
  const location = useLocation();
  const list = curatedLists[location.pathname] || Object.values(curatedLists)[0];

  return (
    <>
      <Helmet>
        <title>{list.title}</title>
        <meta name="description" content={list.description} />
        <meta name="keywords" content={list.keywords} />
        <meta property="og:title" content={list.title} />
        <meta property="og:description" content={list.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${siteUrl}${list.path}`} />
        <link rel="canonical" href={`${siteUrl}${list.path}`} />
        <script type="application/ld+json">{JSON.stringify(itemListSchema(list))}</script>
      </Helmet>

      <main className="conversation-cards-page">
        <section className="conversation-cards-hero" aria-labelledby="question-list-title">
          <div className="conversation-cards-copy">
            <p className="conversation-cards-kicker">Hand-picked from 1,700 open cards</p>
            <h1 id="question-list-title">{list.h1}</h1>
            <p className="conversation-cards-lede">{list.lede}</p>
            <div className="conversation-cards-actions">
              <a
                className="conversation-cards-secondary"
                href="/random"
                onClick={() => trackEvent({ category: "SEO landing page", action: "random_app_cta_click", label: list.path })}
              >
                Or draw from the whole pile
              </a>
            </div>
          </div>
        </section>

        <section className="conversation-cards-section">
          <ol className="curated-question-list">
            {list.questions.map((q) => (
              <li key={q.id}>
                <a href={`/question/${q.id}`}>{q.text}</a>
                {q.note && <p className="curated-question-note">{q.note}</p>}
              </li>
            ))}
          </ol>
        </section>

        <section className="conversation-cards-section conversation-cards-source">
          <h2>Why these {list.count}?</h2>
          <p>
            Every card here was picked by hand out of the full open-source Jous set. The rest of the pile is a
            random draw away — some cards there are dumb, some are deep. That is the point.
          </p>
          <a href="/conversation-cards">All conversation cards</a>
        </section>

        <section className="conversation-cards-section">
          <div className="conversation-cards-section-heading">
            <h2>More hand-picked lists</h2>
          </div>
          <div className="conversation-cards-link-grid">
            {curatedListLinks
              .filter((link) => link.href !== list.path)
              .map((link) => (
                <a className="conversation-cards-link-card" href={link.href} key={link.href}>
                  <strong>{link.label}</strong>
                  <span>{link.description}</span>
                </a>
              ))}
          </div>
        </section>
      </main>
    </>
  );
}

export default QuestionList;
