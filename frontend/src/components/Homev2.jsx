import React, { useState, useEffect, lazy, Suspense } from 'react';
import ReactGA from 'react-ga4';
import { Helmet } from 'react-helmet';
import { Button } from 'semantic-ui-react';
import { Cloudinary } from '@cloudinary/url-gen';
import { fill } from '@cloudinary/url-gen/actions/resize';
import { AdvancedImage, responsive, placeholder } from '@cloudinary/react';
import { autoEco } from "@cloudinary/url-gen/qualifiers/quality";
import { focusOn } from "@cloudinary/url-gen/qualifiers/gravity";
import { FocusOn } from "@cloudinary/url-gen/qualifiers/focusOn";
import { webp } from "@cloudinary/url-gen/qualifiers/format";
import 'semantic-ui-css/semantic.min.css';
import './Homev2Critical.css';
import './Homev2Full.css';

const AboutModal = lazy(() => import('./AboutModal'));

function Homev2() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  const [showAbout, setShowAbout] = useState(false);

  useEffect(() => {
    const handleResize = () => setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight
    });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const cld = new Cloudinary({ cloud: { cloudName: 'dl9xg597r' } });

  const imgPublicId = '9dced400-e81c-4256-baa6-0daac025b21b_ehh68a'

  const img = cld
    .image(imgPublicId)
    .format(webp())
    .quality(autoEco())
    .resize(fill()
      .width(windowSize.width)
      .height(windowSize.height)
      .gravity(focusOn(FocusOn.faces()))
    );

  const backgroundStyle = {
    //backgroundSize: 'cover',
    //backgroundPosition: 'center',
    height: '100vh',
    //width: '100vw',
    //position: 'relative',
    //padding: '15px 20px 5px 10px',
  };


  const cldImage = <AdvancedImage cldImg={img} plugins={[responsive({ steps: 200 }), placeholder({ mode: 'blur' })]} style={backgroundStyle} />

  const buttonStyle = {
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    color: '#FFFFFF',
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
      <div>
        <div className="ui center aligned inverted segment transparent-black">
          <h1 className="huge-header">Jous</h1>
        </div>
        {cldImage}
        <div className="grid-buttons-position">
          <Button
            fluid
            style={buttonStyle}
            onClick={() => {
              setShowAbout(true);
              ReactGA.event({
                category: 'learn',
                action: 'button',
                label: 'about',
              });
            }}
          >
            About Jous
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
