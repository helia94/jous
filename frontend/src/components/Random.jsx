// Random.jsx
import React from "react";
import Axios from "axios";
import TweetItem2 from "./TweetItem2";
import { Helmet } from 'react-helmet';
import { LanguageContext } from "./LanguageContext"; 

class Random extends React.Component {
  static contextType = LanguageContext;

  constructor(props, context) {
    super(props, context);
    const { availableLanguages = [], language } = context;
    const selectedLanguage = availableLanguages.find(
      (lang) => lang.frontend_code === language
    ) || { frontend_code: "original", backend_code: null };

    this.state = {
      question: "",
      selectedLanguageFrontendCode: selectedLanguage.frontend_code,
      selectedLanguageBackendCode: selectedLanguage.backend_code
    };
  }

  componentDidMount() {
    Axios.get("/api/question/random", {
      params: {
        language_id: this.state.selectedLanguageBackendCode
      }
    }).then(res => {
      this.setState({
        question: res.data.question
      });
    });
  }

  nextRandomQuestion = () => {
    Axios.get("/api/question/random", {
      params: {
        language_id: this.state.selectedLanguageBackendCode
      }
    }).then(res => {
      this.setState({
        question: res.data.question
      });
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
        <div className="ui container">
          <div className="event">
            <TweetItem2
              id={this.state.question.id}
              content={this.state.question.content}
              author={this.state.question.username}
              time={this.state.question.time}
              likes={this.state.question.like_number}
              answers={this.state.question.answer_number}
              isOwner={false}
              key={0}
              selectedLanguageFrontendCode={this.state.selectedLanguageFrontendCode}
            />
          </div>
          <div
            className="ui yellow button"
            onClick={this.nextRandomQuestion}
          >
            Next
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Random;
