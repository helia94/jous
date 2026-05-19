import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Helmet } from 'react-helmet';
import { trackEvent } from './analytics';
import { shouldUseMinimalExperience } from './performanceMode';
import { Button } from './ui';
import './Homev2Critical.css';
import './Homev2Full.css';

const AboutModal = lazy(() => import('./AboutModal'));
const FloatingPhrases = lazy(() => import('./FloatingPhrases'));

function Homev2() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  const [showAbout, setShowAbout] = useState(false);
  const [showDecorations, setShowDecorations] = useState(false);
  const minimalExperience = shouldUseMinimalExperience();

  useEffect(() => {
    const handleResize = () => setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight
    });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (minimalExperience) {
      return undefined;
    }

    const delay = windowSize.width < 768 ? 3500 : 2500;
    const timer = window.setTimeout(() => setShowDecorations(true), delay);
    return () => window.clearTimeout(timer);
  }, [minimalExperience, windowSize.width]);

  const buttonStyle = {
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    color: '#D6BFA8',
    padding: '10px 10px',
    fontSize: windowSize.width < 768 ? '14px' : '24px',
    textShadow: '0px 1px 2px rgba(0, 0, 0, 0.3)'
  };

  return (

    <>
      <Helmet>
        <title>Jous - Deep Conversation Starters</title>
        <meta
          name="description"
          content="Ditch small talk and go deep. Discover 1000 personal questions to start meaningful conversations with friends, family, dates, and strangers. No signup required."
        />
        <meta
          name="keywords"
          content="conversation starters, conversation cards, deep questions, meaningful conversations, icebreakers, dating questions, small talk"
        />
        <meta property="og:title" content="Jous - Deep Conversation Starters" />
        <meta
          property="og:description"
          content="Are you easily bored with small talk? Explore and share deep, introspective questions to spark meaningful conversations. For friends, family, and dates. No login required."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.jous.app/" />
        <link rel="canonical" href="https://www.jous.app/" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Helmet>
      <div className="home-shell">
        <div className="home-title-panel">
          <h1 className="huge-header">Jous</h1>
        </div>
        <picture>
          <source srcSet="/jous-awkwart-mobile.webp" media="(max-width: 767px)" />
          <img
            className="home-hero-image"
            src="/jous-awkwart.webp"
            alt=""
            fetchPriority="high"
          />
        </picture>
        {showDecorations && (
          <Suspense fallback={null}>
            <FloatingPhrases />
          </Suspense>
        )}
        <div className="grid-buttons-position">
          <Button
            className="home-start-button"
            style={buttonStyle}
            onClick={() => {
              setShowAbout(true);
              trackEvent({
                category: 'learn',
                action: 'button',
                label: 'about',
              });
            }}
          >
            Start Here
          </Button>
        </div>
      </div>
      <Suspense fallback={<div style={{ color: 'white' }}>Loading...</div>}>
        {showAbout && <AboutModal open={showAbout} onClose={() => setShowAbout(false)} />}
      </Suspense>
    </>
  );
}

export default Homev2;
