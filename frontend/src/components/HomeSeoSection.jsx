import React from "react";
import { conversationCardSpokePages } from "./conversationCardSeoPages";
import { localizedSeoPages } from "./localizedSeoPages";
import { curatedLists } from "./curatedLists";

// Crawlable, below-the-fold content for the homepage. The homepage is the one
// URL Google crawls every few days, but until this existed it shipped an empty
// <div id="root"> and linked to nothing. Plain <a> tags on purpose: the
// prerendered HTML must carry real links without the router.
const sampleQuestions = [
  { id: 100, text: "Do you feel like you have different personalities within you?" },
  { id: 14, text: "What is self-discovery you are most grateful to have had?" },
  { id: 1441, text: "How much competition do you have now in your life? Healthy or not healthy?" },
];

const languageLabels = { de: "Deutsch", es: "Español", fa: "فارسی" };

function HomeSeoSection() {
  const spokes = Object.entries(conversationCardSpokePages);
  const lists = Object.values(curatedLists);
  const localized = Object.entries(localizedSeoPages);

  return (
    <section className="home-seo" aria-labelledby="home-seo-title">
      <div className="home-seo-inner">
        <h2 id="home-seo-title">Open-source conversation cards: 1,600+ random questions, free forever</h2>
        <p>
          Jous is a deck of conversation cards that lives on the web. Draw a random question, ask it,
          answer it, add your own. Over 1,600 cards, about ten times more than a boxed deck, written by
          people rather than a marketing team. No account, no paywall, no self-help script. The whole
          question set is open source.
        </p>
        <p>
          <a className="home-seo-cta" href="/random">Draw a random card</a>
          {" "}
          <a className="home-seo-cta home-seo-cta-secondary" href="/conversation-cards">
            How the cards work
          </a>
        </p>

        <h3>Three cards from the deck</h3>
        <ul className="home-seo-cards">
          {sampleQuestions.map((q) => (
            <li key={q.id}>
              <a href={`/question/${q.id}`}>{q.text}</a>
            </li>
          ))}
        </ul>

        <h3>Hand-picked lists</h3>
        <ul className="home-seo-links">
          {lists.map((list) => (
            <li key={list.path}>
              <a href={list.path}>{list.h1}</a>
            </li>
          ))}
        </ul>

        <h3>Conversation cards by situation</h3>
        <ul className="home-seo-links">
          <li>
            <a href="/conversation-cards">Conversation cards</a>
          </li>
          {spokes.map(([path, page]) => (
            <li key={path}>
              <a href={path}>{page.navLabel || page.h1}</a>
            </li>
          ))}
        </ul>

        <h3>In other languages</h3>
        <ul className="home-seo-links">
          {localized.map(([path, page]) => (
            <li key={path} lang={page.lang}>
              <a href={path} hrefLang={page.lang}>
                {languageLabels[page.lang] || page.lang}: {page.h1}
              </a>
            </li>
          ))}
        </ul>

        <h3>Read and contribute</h3>
        <ul className="home-seo-links">
          <li>
            <a href="/blog">Blog: small talk, deep talk, and how to get from one to the other</a>
          </li>
          <li>
            <a href="/open-source-card-dataset">The open-source card dataset</a>
          </li>
          <li>
            <a href="https://github.com/helia94/jous">Source code on GitHub (MIT)</a>
          </li>
        </ul>
      </div>
    </section>
  );
}

export default HomeSeoSection;
