import React from "react";
import { Helmet } from 'react-helmet';

function Imprint() {
    return (
        <React.Fragment>
            <Helmet>
                <title>Impressum</title>
                <link rel="canonical" href="https://jous.app/impressum" />
            </Helmet>
            <div className="imprint-container">
                <h2>Impressum</h2>
                <p><strong>Angaben gemäß § 5 TMG:</strong></p>
                <p>Helia Jamshidi<br/>
                c/o Impressumservice Dein-Impressum<br/>
                Stettiner Straße 41<br/>
                35410 Hungen</p>

                <p><strong>Kontakt:</strong></p>
                <p>E-Mail: <a href="mailto:info@jous.app">info@jous.app</a></p>

                <p><strong>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV:</strong></p>
                <p>Helia Jamshidi</p>
            </div>

            <style jsx>{`
                .imprint-container {
                    max-width: 600px;
                    margin: 50px auto;
                    padding: 30px;
                    background: #f9f9f9;
                    border-radius: 10px;
                    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
                    text-align: center;
                    font-family: Arial, sans-serif;
                    color: #333;
                }
                h2 {
                    color: #2c3e50;
                    margin-bottom: 20px;
                }
                p {
                    line-height: 1.6;
                }
                a {
                    color: #3498db;
                    text-decoration: none;
                    font-weight: bold;
                }
                a:hover {
                    text-decoration: underline;
                }
            `}</style>
        </React.Fragment>
    );
}

export default Imprint;
