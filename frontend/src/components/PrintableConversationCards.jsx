import React, { useEffect, useState } from "react";
import Axios from "axios";
import { Helmet } from "react-helmet";
import { Button } from "./ui";
import { trackEvent } from "./analytics";
import "./ConversationCards.css";

const categoryOptions = [
  { label: "Any", value: "" },
  { label: "Friends", value: "0" },
  { label: "Casual Socializing", value: "1" },
  { label: "First Dates", value: "2" },
  { label: "Couples", value: "3" },
  { label: "Roommates", value: "4" },
  { label: "Meeting New People", value: "5" },
  { label: "With Parents", value: "6" },
  { label: "With the Kids", value: "7" },
  { label: "Reunions", value: "8" },
  { label: "On the Road", value: "9" },
  { label: "Colleagues", value: "10" },
  { label: "Team Building", value: "11" },
  { label: "Cultural Exchange", value: "12" },
  { label: "Philosophical", value: "13" },
];

const countOptions = [8, 12, 16, 24, 32, 48];

const fallbackCards = [
  "What is a practice that brings meaning to your life, but it doesn’t include suffering first?",
  "Do you have someone who would always tell you the truth?",
  "When was the last time you were really happy for someone else?",
  "What's the closest thing to magic for you?",
  "What do you wish people asked you about more often?",
  "What is a small ordinary thing that still feels privately luxurious?",
  "When do you feel most like yourself?",
  "What opinion of yours has become softer with time?",
  "What is something you are surprisingly good at noticing?",
  "Which memory do you return to more than you expected?",
  "What is a harmless thing you are weirdly loyal to?",
  "What makes a conversation feel alive to you?",
  "What have you stopped trying to prove?",
  "Who changed your mind without trying very hard?",
  "What do you want to be braver about saying?",
  "What is a place that changed your pace?",
  "What kind of attention feels generous to you?",
  "What did you misunderstand for a long time?",
  "What is something you would like to do more slowly?",
  "What do people get wrong about your taste?",
  "What is a question you avoid because the answer matters?",
  "When did a coincidence feel useful?",
  "What do you hope stays strange about you?",
  "What is one rule you follow that no one assigned?",
  "What kind of silence feels comfortable?",
  "What are you better at now than last year?",
  "What do you miss that was never really yours?",
  "What makes you trust someone's judgment?",
  "What is a tiny thing that can ruin your mood?",
  "What is a tiny thing that can save your mood?",
  "What have you learned by watching someone else closely?",
  "What do you want your friends to understand without a speech?",
  "What is something you still do the old-fashioned way?",
  "What is a compliment you remember too clearly?",
  "What do you know is true but keep forgetting?",
  "What is something you would defend for no practical reason?",
  "When have you felt unexpectedly understood?",
  "What is a habit that tells people a lot about you?",
  "What is the most recent thing that made you curious?",
  "What makes a day feel well spent?",
  "What did you recently notice about your own patterns?",
  "What is something you hope you never outgrow?",
  "What kind of person makes you more honest?",
  "What is a small risk that paid off?",
  "What do you want to remember about this season of your life?",
  "What would you ask if you knew the answer would be gentle?",
  "What is something you understand better after getting older?",
  "What kind of kindness do you find easiest to accept?",
];

const buildFallbackCards = (targetCount) =>
  Array.from({ length: targetCount }, (_, index) => fallbackCards[index % fallbackCards.length]);

function PrintableConversationCards() {
  const [category, setCategory] = useState("");
  const [count, setCount] = useState(12);
  const [cards, setCards] = useState(() => buildFallbackCards(12));
  const [loading, setLoading] = useState(false);
  const [shouldPrint, setShouldPrint] = useState(false);
  const selectedCategory = categoryOptions.find((item) => item.value === category);

  useEffect(() => {
    if (!shouldPrint) return undefined;

    const printTimer = window.setTimeout(() => {
      window.print();
      setShouldPrint(false);
    }, 100);

    return () => window.clearTimeout(printTimer);
  }, [cards, shouldPrint]);

  const fetchCards = async () => {
    setLoading(true);
    trackEvent({
      category: "SEO landing page",
      action: "generate_printable_cards",
      label: selectedCategory?.label || "Any",
    });

    let printableCards = buildFallbackCards(count);

    try {
      const params = { limit: count };
      if (category !== "") {
        params.occasion = category;
      }

      const res = await Axios.get("/api/question/random", { params });
      const questions = res.data?.questions
        ?.map((item) => item.question?.content)
        .filter(Boolean)
        .slice(0, count);

      if (questions?.length) {
        printableCards = [...questions, ...printableCards].slice(0, count);
      }
    } catch (error) {
      // Fall back to local prompts so PDF generation still respects the chosen count.
    } finally {
      setCards(printableCards);
      setShouldPrint(true);
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Printable Conversation Cards | Jous</title>
        <meta
          name="description"
          content="Generate printable conversation cards from Jous. Choose a real app category, pick a card count, and save the print sheet as a PDF."
        />
        <meta
          name="keywords"
          content="printable conversation cards, free printable conversation cards, conversation cards pdf"
        />
        <meta property="og:title" content="Printable Conversation Cards | Jous" />
        <meta
          property="og:description"
          content="Choose a Jous category and generate a printable conversation card sheet."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://jous.app/printable-conversation-cards" />
        <link rel="canonical" href="https://jous.app/printable-conversation-cards" />
      </Helmet>

      <main className="conversation-cards-page printable-cards-page">
        <section className="conversation-cards-hero printable-cards-hero" aria-labelledby="printable-cards-title">
          <div className="conversation-cards-copy">
            <p className="conversation-cards-kicker">Printable conversation cards</p>
            <h1 id="printable-cards-title">Make a PDF Set</h1>
            <p className="conversation-cards-lede">
              Choose a real Jous category, choose how many cards, then generate a clean sheet to save as PDF.
            </p>
          </div>

          <form className="printable-cards-controls" onSubmit={(event) => event.preventDefault()}>
            <label>
              <span>Category</span>
              <select value={category} onChange={(event) => setCategory(event.target.value)}>
                {categoryOptions.map((option) => (
                  <option key={option.label} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span>Cards</span>
              <select value={count} onChange={(event) => setCount(Number(event.target.value))}>
                {countOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <Button onClick={fetchCards} disabled={loading}>
              {loading ? "Generating..." : "Generate PDF"}
            </Button>
          </form>
        </section>

        <section className="conversation-cards-section printable-cards-sheet" aria-label="Printable card sheet">
          <div className="printable-cards-sheet-header">
            <h2>Jous Conversation Cards</h2>
            <p>{selectedCategory?.label || "Any"} · {cards.length} cards</p>
          </div>
          <div className="printable-cards-grid">
            {cards.map((card, index) => (
              <article className="printable-card" key={`${card}-${index}`}>
                <span>{index + 1}</span>
                <p>{card}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}

export default PrintableConversationCards;
