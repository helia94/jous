// FloatingPhrases.js
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';


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
    "Read any good books recently?",
    "Is that book you’re reading any good?",
    "Seen any good movies lately?",
    "What shows are you watching?",
    "Did you catch the game? (you did not)",
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

  function FloatingPhrases() {
    const [activePhrases, setActivePhrases] = useState([]);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const phraseIndex = useRef(Math.floor(Math.random() * phrases.length));
  
    useEffect(() => {
      const mediaQuery = window.matchMedia('(max-width: 767px)');
      const handleResize = () => setIsMobile(mediaQuery.matches);
      mediaQuery.addEventListener('change', handleResize);
      return () => mediaQuery.removeEventListener('change', handleResize);
    }, []);
  
    useEffect(() => {
      let isMounted = true;
      const spawnPhrase = () => {
        if (!isMounted) return;
        const baseSize = 36 + Math.random() * 36;
        const fontSize = (isMobile ? baseSize * 0.3 : baseSize) + 'px';
        const text = phrases[phraseIndex.current];
        phraseIndex.current = (phraseIndex.current + 1) % phrases.length;
        const newPhrase = {
          id: Date.now() + Math.random(),
          text,
          top: Math.random() * 80 + '%',
          left: Math.random() * 80 + '%',
          fontSize
        };
        setActivePhrases(prev => [...prev, newPhrase]);
        setTimeout(() => {
          setActivePhrases(prev => prev.filter(p => p.id !== newPhrase.id));
        }, 2000);
        const delay = Math.random() * 2500 + 2000;
        setTimeout(spawnPhrase, delay);
      };
      spawnPhrase();
      return () => { isMounted = false; };
    }, [isMobile]);
  
    const variants = {
      initial: { opacity: 0 },
      animate: { opacity: 1, transition: { duration: 1 } },
      exit: { opacity: 0, transition: { duration: 1 } }
    };
  
    return (
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 2,
        width: '100%',
        height: '100%',
        pointerEvents: 'none'
      }}>
        <AnimatePresence>
          {activePhrases.map(phrase => (
            <motion.div
              key={phrase.id}
              initial="initial"
              animate="animate"
              exit="exit"
              variants={variants}
              style={{
                position: 'absolute',
                top: phrase.top,
                left: phrase.left,
                fontSize: phrase.fontSize,
                color: '#FFF8E7',
                fontWeight: 'bold',
                textShadow: '4px 8px 10px rgba(0,0,0,0.6)',
                lineHeight: '1.2',
                background: 'linear-gradient(to top, rgba(0,0,0,0.5) 40%, rgba(0,0,0,0)) 30%', // Super soft background
                padding: '4px 8px',
                borderRadius: '20px',
              }}
            >
              {phrase.text}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    );
  }
  
  export default FloatingPhrases;