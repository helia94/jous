import React from "react";

const QuizResult = ({ totalScore, onClose }) => {
  const getConclusion = (score) => {
    if (score <= 25) {
      return {
        title: "The Hermit",
        description: "You’d rather chew glass than make small talk. Silence is your love language.",
      };
    } else if (score <= 50) {
      return {
        title: "The Reluctant Conversationalist",
        description: "You’ll engage if you must, but you’re counting the seconds until it’s over.",
      };
    } else if (score <= 75) {
      return {
        title: "The Polite Nodder",
        description: "You can fake it well enough, but you’re not exactly thrilled about it.",
      };
    } else {
      return {
        title: "The Small Talk Savant",
        description: "You’ve mastered the art of chit-chat. You might even enjoy it. Sometimes.",
      };
    }
  };

  const { title, description } = getConclusion(totalScore);

  return (
    <div className="p-6 text-center">
      <h2 className="text-2xl font-bold mb-4">Your Score: {totalScore}</h2>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-700 mb-6">{description}</p>
      <button
        onClick={onClose}
        className="px-6 py-2 bg-[#fbbd08] text-black rounded-lg hover:bg-[#e0a800] transition-all"
      >
        Close
      </button>
    </div>
  );
};

export default QuizResult;