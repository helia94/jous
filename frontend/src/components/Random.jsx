import React from "react";
import Axios from "axios";
import TweetItem2 from "./TweetItem2";
import { Helmet } from 'react-helmet';
import { LanguageContext } from "./LanguageContext"; 


class Random extends React.Component {
    state = { question: "",
        selectedLanguage: null
    }
    static contextType = LanguageContext;

    nextRandomQuestion = () => {
        Axios.get("/api/question/random", { params: 
            {
            language_id: this.state.selectedLanguage.backend_code
         }}).then(res => {
            this.setState({
                question: res.data.question,
            })
        });
    }

    componentDidMount() {
        const { availableLanguages = [], language } = this.context; // Provide a default value for availableLanguages
        const selectedLanguage = availableLanguages.find(
          (lang) => lang.frontend_code === language
        );
        console.log("language:", language);
        console.log("Selected Language:", selectedLanguage);
        this.setState({
            selectedLanguage : selectedLanguage
        })

        Axios.get("/api/question/random", { params: 
            {
            language_id: selectedLanguage.backend_code
         }}).then(res => {
            this.setState({
                question: res.data.question,
            })
        });
    }

    render() {
        return (
            <React.Fragment>
                <Helmet>
                    <title>Random</title>
                    <link rel="canonical" href="https://jous.app/random" />
                </Helmet>
                <div className="ui center aligned yellow inverted segment">
                    <h1 className="w3-jumbo">Random Jous</h1>
                </div>
                <div class="ui container">
                    <div class="event">
                        <TweetItem2
                            id={this.state.question.id}
                            content={this.state.question.content}
                            author={this.state.question.username}
                            time={this.state.question.time}
                            likes={this.state.question.like_number}
                            answers={this.state.question.answer_number}
                            isOwner={false}
                            key={0}
                        />
                    </div>
                    <div className="ui yellow button"
                        onClick={this.nextRandomQuestion}>
                        Next
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default Random;
