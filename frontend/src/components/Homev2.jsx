import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Modal, Button, Grid, Icon } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import './Homev2.css';


function Homev2() {

    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

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
                <meta name="description" content="Avoid small talk and dive deep with Jous. Discover introspective questions to fuel meaningful conversations with friends, family, dates, and strangers. No signup required to share or explore." />
                <meta name="keywords" content="conversation starters, deep questions, introspective questions, meaningful conversations, social icebreakers, personal growth, dating questions, boring conversations, small talk" />
                {/* Open Graph tags for better social media sharing */}
                <meta property="og:title" content="Jous - Deep Conversation Starters" />
                <meta property="og:description" content="Are you easily bored with small talk? Explore and share deep, introspective questions to spark meaningful conversations. For friends, family, and dates. No login required." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://www.jous.app/" />
            </Helmet>
            <div style={backgroundStyle}>
                <div className="ui center aligned inverted segment transparent-yellow">
                    <h1 className="w3-jumbo">Jous</h1>
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
                                <p style={{ fontSize: '1.1em', lineHeight: '1.6' }}>
                                    Welcome to <strong>Jous</strong>, an innovative app designed for <strong>collecting and sharing intriguing questions</strong> to <strong>spark engaging conversations</strong>. This platform is not merely a forum; it is a tool to transform mundane small talk into meaningful interactions.
                                </p>

                                <h3 style={{ marginTop: '1.5em' }}>Tired of the Same Old Small Talk?</h3>
                                <p style={{ lineHeight: '1.6' }}>
                                    Jous empowers you to elevate your interactions, guiding you towards deeper, more meaningful conversations. Forget about those awkward silences and start a conversation that matters.
                                </p>

                                <p style={{ lineHeight: '1.6' }}>
                                    Either scroll through all questions posted by different people or use <strong>random mode</strong> to find a question. No login is required.
                                </p>

                                <div style={{ display: 'flex', justifyContent: 'center', margin: '1.5em 0' }}>
                                    <Button color="yellow" onClick={() => (window.location = '/home')} style={{ marginRight: '1em' }}>
                                        All Questions
                                    </Button>
                                    <Button color="yellow" onClick={() => (window.location = '/random')}>
                                        Random Question
                                    </Button>
                                </div>

                                <div style={{ textAlign: 'center', marginBottom: '1.5em' }}>
                                    <Button color="black" onClick={() => (window.location = 'https://t.me/jous_app_bot')}>
                                        Also on Telegram
                                        <Icon name="telegram plane" style={{ marginLeft: '0.5em' }} />
                                    </Button>
                                </div>

                                <p style={{ lineHeight: '1.6' }}>
                                    You can also be a creator of new questions. Share your own thought-provoking questions and contribute to the gathering of minds seeking meaningful connections.
                                </p>

                                <p style={{ lineHeight: '1.6' }}>
                                    Contact me for any reason: <a href="mailto:helia.jm@gmail.com"><strong>helia.jm@gmail.com</strong></a>
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
