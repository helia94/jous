import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Modal, Button } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';


function Homev2() {

    const backgroundStyle = {
        backgroundImage: `url(./jous-awkwart.jpg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        height: '100vh',
        width: '100vw',
        position: 'relative',
    };

    const aboutJousButtonPosition = {
        position: 'absolute',
        top: '90%',
        left: '22%',
    };

    const moreAboutJousButtonPosition = {
        position: 'absolute',
        top: '90%',
        left: '36%',
    };

    const readButtonPosition = {
        position: 'absolute',
        top: '90%',
        left: '53%',
    };

    const writeButtonPosition = {
        position: 'absolute',
        top: '90%',
        left: '70%',
    };

    const buttonStyle = {
        backgroundColor: 'rgba(0, 0, 0, 0.2)', // Adjust the RGB values as needed for your desired color
        color: '#FFFFFF', // Solid text color
        // Any other styles you want to apply
    };

    const [isHeyModalOpen, setIsHeyModalOpen] = useState(false);
    const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
    const [isReadModalOpen, setIsReadModalOpen] = useState(false);
    const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);

    const toggleHey = () => setIsHeyModalOpen(!isHeyModalOpen);
    const toggleAbout = () => setIsAboutModalOpen(!isAboutModalOpen);
    const toggleRead = () => setIsReadModalOpen(!isReadModalOpen);
    const toggleWrite = () => setIsWriteModalOpen(!isWriteModalOpen);
    return (

        <React.Fragment>
            <Helmet>
                {/* Helmet content remains the same */}
            </Helmet>
            <div style={backgroundStyle}>
                <div className="ui center aligned yellow inverted segment">
                    <h1 className="w3-jumbo">Jous</h1>
                </div>
                <div className="ui container">

                    {/* Modal Trigger */}
                    <div style={aboutJousButtonPosition}>
                        <Button style={buttonStyle} onClick={toggleHey} className="ui massive yellow button">Hey There!</Button>
                    </div>
                    {/* Questions Modal Trigger */}
                    <div style={moreAboutJousButtonPosition}>
                        <Button style={buttonStyle} onClick={toggleAbout} className="ui massive yellow button">About Jous</Button>
                    </div>
                    {/* Questions Modal Trigger */}
                    <div style={readButtonPosition}>
                        <Button style={buttonStyle} onClick={toggleRead} className="ui massive yellow button">Avoid small talk</Button>
                    </div>
                    {/* Questions Modal Trigger */}
                    <div style={writeButtonPosition}>
                        <Button style={buttonStyle} onClick={toggleWrite} className="ui massive yellow button">Be a creator</Button>
                    </div>

                    {/* Hi Modal */}
                    <Modal open={isHeyModalOpen} onClose={toggleHey} closeIcon centered={false} className="animated-modal">
                        <Modal.Header>Hey</Modal.Header>
                        <Modal.Content scrolling>
                            <Modal.Description>
                                {
                                    <p>
                                        Hi, I'm glad you found your way here. I'm Helia from Karlsruhe, and I made Jous [just pronounced like juice], mainly for myself, but also for my friends and other people trying to avoid small talk as much as possible. It is an app for collecting and sharing questions to start a conversation with.
                                    </p>
                                }
                            </Modal.Description>
                        </Modal.Content>
                    </Modal>

                    {/* About Modal */}
                    <Modal open={isAboutModalOpen} onClose={toggleAbout} closeIcon centered={false} className="animated-modal">
                        <Modal.Header>About Jous</Modal.Header>
                        <Modal.Content scrolling>
                            <Modal.Description>
                                {
                                    <p>
                                        Yes, this is a website for questions, and no, it is not like Reddit. Okay, let me explain more. Let's say, that to be able to answer a question, you should either look inward, inside yourself, or outside in the world. Jous is the place only for the first type of questions. You will not find questions like <i>"what's the best budget fitness tracker?"</i> rather Like <i>"What do you often deny yourself?"</i>
                                    </p>
                                }
                            </Modal.Description>
                        </Modal.Content>
                    </Modal>

                    {/* read Modal */}
                    <Modal open={isReadModalOpen} onClose={toggleRead} closeIcon centered={false} className="animated-modal">
                        <Modal.Header>Lets help you avoid small talk</Modal.Header>
                        <Modal.Content scrolling>
                            <Modal.Description>
                                {
                                    <div>
                                        <p>
                                            So what can you do here? Next time you meet your friends and family, or you are on a date and you cannot fill the silence, you can use Jous questions for some nice questions. This is like one of those play cards you can buy, but I promise you, here is less cheesy. Either scroll through all questions posted by different people or use random mode to find a question to start a conversation. No Login is required.
                                        </p>
                                        <div class="ui buttons">
                                            <div className="ui yellow button"
                                                onClick={() => (window.location = "/home")}>
                                                all questions
                                            </div>
                                            <div className="ui yellow button"
                                                onClick={() => (window.location = "/random")}>
                                                random question
                                            </div>
                                        </div>
                                    </div>
                                }
                            </Modal.Description>
                        </Modal.Content>
                    </Modal>


                    {/* write Modal */}
                    <Modal open={isWriteModalOpen} onClose={toggleWrite} closeIcon centered={false} className="animated-modal">
                        <Modal.Header>I cant wait to read your questions</Modal.Header>
                        <Modal.Content scrolling>
                            <Modal.Description>
                                {
                                    <div>
                                        <p>
                                            If you want to add your own questions and contribute to the list so everybody can use them, write them down in your name or in an anonymous mode. You can also answer questions from yourself or others. Everyone can contribute in anonymous mode without login, but if you want to see your questions later under your name, you need to register, any ID will do, no emails are required.
                                        </p>
                                        <div class="ui buttons">
                                            <div className="ui grey button"
                                                onClick={() => (window.location = "/login")}>
                                                Login
                                            </div>
                                            <div className="ui grey button"
                                                onClick={() => (window.location = "/register")}>
                                                Register
                                            </div>
                                        </div>
                                    </div>
                                }
                            </Modal.Description>
                        </Modal.Content>
                    </Modal>

                </div>
            </div>
        </React.Fragment>
    );
}

export default Homev2;
