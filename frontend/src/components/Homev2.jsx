import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Modal, Button, Grid, Icon } from 'semantic-ui-react';
import { useLanguage } from './LanguageContext';
import 'semantic-ui-css/semantic.min.css';
import './Homev2.css';


function Homev2() {

    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const { language, openLanguageModal } = useLanguage();

    const handleWindowSizeChange = () => {
        setWindowWidth(window.innerWidth);
    };

    useEffect(() => {
        window.addEventListener('resize', handleWindowSizeChange);
        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
        };
    }, []);

    const backgroundStyle = {
        backgroundImage: `url(./jous-awkwart.jpg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        height: '100vh',
        width: '100vw',
        position: 'relative',
        padding: '15px 20px 5px 10px', // top right bottom left
    };


    const gridButtonsPosition = {
        position: 'absolute',
        bottom: windowWidth < 768 ? '25%' : '15%',
        left: '50%',
        transform: 'translateX(-50%)'
    };

    const buttonStyle = {
        backgroundColor: 'rgba(0, 0, 0, 0.35)',
        color: '#FFFFFF',
        padding: '10px 10px',
        fontSize: windowWidth < 768 ? '14px' : '24px',
        textShadow: '0px 1px 2px rgba(0, 0, 0, 0.3)'
    };

    const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
    const toggleAbout = () => setIsAboutModalOpen(!isAboutModalOpen);
    {/*
    const [isHeyModalOpen, setIsHeyModalOpen] = useState(false);
    const [isReadModalOpen, setIsReadModalOpen] = useState(false);
    const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);

    const toggleHey = () => setIsHeyModalOpen(!isHeyModalOpen);
    const toggleRead = () => setIsReadModalOpen(!isReadModalOpen);
    const toggleWrite = () => setIsWriteModalOpen(!isWriteModalOpen);
    */}

    return (

        <React.Fragment>
            <Helmet>
                <title>Jous - Deep Conversation Starters</title>
                <meta name="description" content="Ditch small talk and go deep. Discover 1000 personal questions to start meaningful conversations with friends, family, dates, and strangers. No signup required." />
                <meta name="keywords" content="conversation starters, conversation cards, deep questions, meaningful conversations, icebreakers, dating questions, small talk" />
                <meta property="og:title" content="Jous - Deep Conversation Starters" />
                <meta property="og:description" content="Are you easily bored with small talk? Explore and share deep, introspective questions to spark meaningful conversations. For friends, family, and dates. No login required." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://www.jous.app/" />
                <link rel="canonical" href="https://www.jous.app/" />
            </Helmet>
            <div style={backgroundStyle}>
                <div className="ui center aligned inverted segment transparent-black">
                    <h1 className="huge-header" >Jous</h1>
                </div>
                <div style={gridButtonsPosition}>
                    <Grid textAlign='center' columns='equal' stackable >
                        <Grid.Row stretched>
                            {/*<Grid.Column >
                                 Modal Trigger 
                                <Button fluid style={buttonStyle} onClick={toggleHey} >Hey There!</Button>
                            </Grid.Column>*/}
                            <Grid.Column >
                                {/* Questions Modal Trigger */}
                                <Button fluid style={buttonStyle} onClick={toggleAbout} >About Jous</Button>
                            </Grid.Column>
                            {/*<Grid.Column>
                                <Button fluid style={buttonStyle} onClick={toggleRead}>Avoid small talk</Button>
                            </Grid.Column>
                            <Grid.Column>
                                <Button fluid style={buttonStyle} onClick={toggleWrite} >Be a creator</Button>
                            </Grid.Column> */}
                        </Grid.Row>
                    </Grid>
                </div>


                {/* About Modal */}
                <Modal
                    open={isAboutModalOpen}
                    onClose={toggleAbout}
                    closeIcon
                    centered={false}
                    className="animated-modal"
                >
                    <Modal.Header>About Jous</Modal.Header>
                    <Modal.Content scrolling>
                        <Modal.Description>
                            <section style={{ padding: '1em' }}>
                                <h3 style={{ marginTop: '1.5em' }}>Welcome to Jous!</h3>
                                <p style={{ fontSize: '1.1em', lineHeight: '1.6' }}>
                                    Have you ever found yourself stuck in yet another conversation about the weather, desperately seeking an exit strategy? Fear not; <strong>Jous</strong> is here to elevate your dialogues from the mundane to the meaningful.
                                </p>

                                <h3 style={{ marginTop: '1.5em' }}>Transform Small Talk into Genuine Interactions</h3>
                                <p style={{ lineHeight: '1.6' }}>
                                    Jous isn't just an app; it's your invitation to deeper, more engaging discussions. Consider it a gentle nudge away from awkward silences and toward discussions that matter. No sign-ups or passwords needed. Just jump in. As of 2025, the questions are also available in Persian, German, Spanish, and AI enhanced English.
                                </p>
                                <h3 style={{ marginTop: '1.5em' }}>Choose Your Path</h3>
                                <p style={{ lineHeight: '1.6', textAlign: 'center' }}>
                                    <strong>All Questions</strong>: Scroll and Explore through the collection of queries.
                                    <br />
                                    <strong>Random Question</strong>: Let chance guide you to your next topic.
                                </p>
                                <div style={{ display: 'flex', justifyContent: 'center', margin: '1.5em 0' }}>
                                    <Button
                                        color="yellow"
                                        onClick={() => (window.location = `/home?lang=${language}`)}
                                        style={{ marginRight: '1em' }}
                                    >
                                        All Questions
                                    </Button>
                                    <Button color="yellow" onClick={() => (window.location = `/random?lang=${language}`)}>
                                        Random Question
                                    </Button>
                                </div>
                                <p style={{ lineHeight: '1.6', textAlign: 'center' }}>
                                    Or add the Telegram Bot to your groups and chat with your friends there.
                                </p>
                                <div style={{ textAlign: 'center', marginBottom: '1.5em' }}>
                                    <Button
                                        color="black"
                                        onClick={() => (window.location = 'https://t.me/jous_app_bot')}
                                    >
                                        On Telegram
                                        <Icon name="telegram plane" style={{ marginLeft: '0.5em' }} />
                                    </Button>
                                </div>

                                <h3 style={{ marginTop: '1.5em' }}>Contribute Your Curiosity</h3>
                                <p style={{ lineHeight: '1.6' }}>
                                    Why not add your own questions to the mix? Share your insights and watch as they spark discussions around the globe.
                                </p>

                                <h3 style={{ marginTop: '1.5em' }}>Let's Stay Connected</h3>
                                <p style={{ lineHeight: '1.6' }}>
                                    Got feedback, a question, or whatever? Feel free to reach out at{' '}
                                    <a href="mailto:helia.jm@gmail.com">
                                        <strong>info@jous.app</strong>
                                    </a>. I promise I'm friendly!
                                </p>
                            </section>
                        </Modal.Description>
                    </Modal.Content>
                </Modal>




            </div>
        </React.Fragment>
    );
}

export default Homev2;
