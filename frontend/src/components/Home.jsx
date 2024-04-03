import React from "react";
import { Helmet } from 'react-helmet';

function Home() {
    
    return (
        <React.Fragment>
                <Helmet>
                    <title>Jous - Deep Conversation Starters</title>
                    <meta name="description" content="Avoid small talk and dive deep with Jous. Discover introspective questions to fuel meaningful conversations with friends, family, dates, and strangers. No signup required to share or explore."/>
                    <meta name="keywords" content="conversation starters, deep questions, introspective questions, meaningful conversations, social icebreakers, personal growth"/>
                    {/* Open Graph tags for better social media sharing */}
                    <meta property="og:title" content="Jous - Deep Conversation Starters" />
                    <meta property="og:description" content="Explore and share deep, introspective questions to spark meaningful conversations. For friends, family, and dates. No login required." />
                    <meta property="og:type" content="website" />
                    <meta property="og:url" content="https://www.jous.app/" />
            </Helmet>
            <div className="ui center aligned yellow inverted segment">
                <h1 className="w3-jumbo">Jous</h1>
            </div>
            <div class="ui container">
                <h2>About Jous</h2>
                <p>
                    Hi, I'm glad you found your way here. I'm Helia from Karlsruhe, and I made Jous [just pronounced like juice], mainly for myself, but also for my friends and other people trying to avoid small talk as much as possible. It is an app for collecting and sharing questions to start a conversation with.
                </p>
                <p>
                    Yes, this is a website for questions, and no, it is not like Reddit. Okay, let me explain more. Let's say, that to be able to answer a question, you should either look inward, inside yourself, or outside in the world. Jous is the place only for the first type of questions. You will not find questions like <i>"what's the best budget fitness tracker?"</i> rather Like <i>"What do you often deny yourself?"</i>
                </p>
                <p>
                    So what can you do here? Next time you meet your friends and family, or you are on a date and you cannot fill the silence, you can use Jous questions for some nice questions. This is like one of those play cards you can buy, but I promise you, here is less cheesy. Either scroll through all questions posted by different people or use random mode to find a question to start a conversation. No Login is required.
                </p>
                {/* small line break then to buttons in one row */}
                <div class="ui buttons
                            ">
                    <div className="ui yellow button"
                            onClick={() => (window.location = "/home")}>
                            all questions
                    </div>
                    <div className="ui yellow button"
                            onClick={() => (window.location = "/random")}>
                            random question
                    </div>
                </div>
                <p></p>
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
        </React.Fragment>
    );
}

export default Home;
