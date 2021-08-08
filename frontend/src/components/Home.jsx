import React from "react";

function Home() {
    return (
        <React.Fragment>
            <div className="ui center aligned yellow inverted segment">
                <h1 className="w3-jumbo">Jous</h1>
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
            <div class="ui container">
                <h2>About Jous</h2>
                <p>
                    Post your questions in Jous. And browes question from others.
                    Dont ask <i>"what's the best budget fitness tracker?"</i> rather questions
                    that can be asked again and again, with new audiance. Like
                    <i>"What do you often deny yourself?"</i>
                </p>
            </div>
        </React.Fragment>
    );
}

export default Home;
