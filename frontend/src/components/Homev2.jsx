import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Helmet } from 'react-helmet';
import { Button } from 'semantic-ui-react'; 
import 'semantic-ui-css/semantic.min.css';  
import './Homev2Critical.css';               
import './Homev2Full.css';                   

const AboutModal = lazy(() => import( './AboutModal'));

function Homev2() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [showAbout, setShowAbout] = useState(false);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const backgroundUrl =
    windowWidth < 768 ? 'url(./jous-awkwart-mobile.webp)' : 'url(./jous-awkwart.webp)';

  const backgroundStyle = {
    backgroundImage: backgroundUrl,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '100vh',
    width: '100vw',
    position: 'relative',
    padding: '15px 20px 5px 10px',
  };

  const buttonStyle = {
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    color: '#FFFFFF',
    padding: '10px 10px',
    fontSize: windowWidth < 768 ? '14px' : '24px',
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

      <div style={backgroundStyle}>
        <div className="ui center aligned inverted segment transparent-black">
          <h1 className="huge-header">Jous</h1>
        </div>

        <div className="grid-buttons-position">
          <Button 
            fluid 

            style={buttonStyle}
            onClick={() => setShowAbout(true)}
          >
            About Jous
          </Button>
        </div>
      </div>

      {/* Lazy-load AboutModal (JS only) */}
      <Suspense fallback={<div style={{ color: 'white' }}>Loading...</div>}>
        {showAbout && <AboutModal open={showAbout} onClose={() => setShowAbout(false)} />}
      </Suspense>
    </>
  );
}

export default Homev2;
