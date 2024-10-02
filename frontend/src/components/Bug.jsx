import React from "react";
import { Helmet } from 'react-helmet';


function Bug() {

    return (
        <React.Fragment>
            <Helmet>
                <title>Bug</title>
                <link rel="canonical" href="https://www.jous.app/bug" />
            </Helmet>
            <div class="ui container">
                <h2>Thanks for noticing!</h2>
                <p>
                    Write me an email to info@jous.app and I will try to fix it as soon as possible.
                </p>
            </div>
        </React.Fragment>
    );
}

export default Bug;