import React from "react";

function Home() {

    const routeToHome = (e) => {
        let path = "/home"
        window.location.href = path;
    }
    
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
                    Post your questions in Jous. Browes and answer question from others.
                    Dont ask <i>"what's the best budget fitness tracker?"</i> rather questions
                    that can be asked again and again, with new audiance. Like
                    <i>"What do you often deny yourself?"</i>
                </p>
                <div className="ui yellow button"
                            onClick={routeToHome}>
                            Go to questions
                        </div>
            </div>
        </React.Fragment>
    );
}

export default Home;
