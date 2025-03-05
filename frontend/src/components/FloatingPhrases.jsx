// FloatingPhrases.js
import React, { useState, useEffect } from 'react';

const phrases = [
    "How about this weather, huh?",
    "This weather is so weird, right?",
    "Isn’t the weather nice today?",
    "Ugh, this weather is awful.",
    "Got any plans for the weekend?",
    "How was your weekend?",
    "Can’t wait for the weekend!",
    "Thank goodness it’s Friday!",
    "It’s Friday, finally!",
    "Ugh, it’s Monday again.",
    "Why isn’t it Friday yet?",
    "I thought it was Friday, but nope.",
    "It feels like Friday, but it’s not.",
    "Tuesdays are the worst, right?",
    "At least it’s Thursday!",
    "At least it’s Wednesday!",
    "Hump Day! We’re halfway there.",
    "How’s it going?",
    "I’m so tired today.",
    "I’m starving right now.",
    "I’ve been so busy lately.",
    "Read any good books recently?",
    "Is that book you’re reading any good?",
    "Seen any good movies lately?",
    "What shows are you watching?",
    "What kind of music are you into?",
    "Did you catch the game?",
    "How do elevators even work?",
    "This elevator is so slow.",
    "What are you having for lunch?",
    "What did you have for lunch?",
    "Your lunch looks amazing!",
    "Your lunch smells so good.",
    "I bet your lunch tastes great.",
    "Any plans after work?",
    "Got any holiday plans?",
    "What do you do for work?",
    "What do you like to do in your free time?",
    "Where are you from?",
    "Where do you live?",
    "Do you like living there?",
    "What’s new with you?",
    "What’s going on?",
    "What’s up?",
    "What have you been up to lately?",
    "What are you doing right now?",
    "Is it a good morning? IS IT?"
  ];

function getRandomPosition() {
  return {
    top: Math.random() * 80 + '%',
    left: Math.random() * 80 + '%'
  };
}

function getRandomFontSize() {
  return (16 + Math.random() * 24) + 'px';
}

function FloatingPhrases() {
  const [currentIndex, setCurrentIndex] = useState(Math.floor(Math.random() * phrases.length));
  const [phrase, setPhrase] = useState(phrases[currentIndex]);
  const [style, setStyle] = useState({});

  useEffect(() => {
    const showPhrase = () => {
      const nextIndex = (currentIndex + 1) % phrases.length;
      setCurrentIndex(nextIndex);
      setPhrase(phrases[nextIndex]);
      setStyle({
        position: 'absolute',
        color: 'white',
        top: getRandomPosition().top,
        left: getRandomPosition().left,
        fontSize: getRandomFontSize(),
        animation: 'fadeInOut 2s',
        pointerEvents: 'none'
      });
      const nextDelay = 2000 + Math.random() * 2000; // 2 to 4 seconds delay
      setTimeout(showPhrase, nextDelay);
    };
    const timer = setTimeout(showPhrase, 2000);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <span style={style}>{phrase}</span>
      <style>{`
        @keyframes fadeInOut {
          0% { opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}

export default FloatingPhrases;
