import React from "react";
import Axios from "axios";
import TweetItem2 from "./TweetItem2";
import { Helmet } from 'react-helmet';
import { LanguageContext } from "./LanguageContext";
import { FilterContext } from "./FilterContext";
import { getFontForCards } from './FontUtils';

class Random extends React.Component {
  static contextType = LanguageContext;

  constructor(props, context) {
    super(props, context);
    const { availableLanguages = [], language } = context;
    const selectedLanguage = availableLanguages.find(
      (lang) => lang.frontend_code === language
    ) || { frontend_code: "original", backend_code: null };

    this.state = {
      question: null,
      selectedLanguageFrontendCode: selectedLanguage.frontend_code,
      selectedLanguageBackendCode: selectedLanguage.backend_code,
      minHeight: 200
    };
  }

  fetchRandomQuestion = () => {
    const { chosenFilters } = this.props.filterContext;
    const filtersToUse = chosenFilters || {};  // Ensure no undefined filters

    Axios.get("/api/question/random", {
      params: {
        language_id: this.state.selectedLanguageBackendCode,
        ...filtersToUse
      }
    })
    .then((res) => {
      if (res.data.error === "No questions available") {
        this.setState({ question: null });
      } else {
        this.setState({ question: res.data.question });
      }
    })
    .catch(() => {
      this.setState({ question: null });
    });
  };

  componentDidMount() {
    const { chosenFilters } = this.props.filterContext;

    if (Object.keys(chosenFilters).length === 0) {
      // Poll until filters are available
      const interval = setInterval(() => {
        if (Object.keys(this.props.filterContext.chosenFilters).length > 0) {
          clearInterval(interval);
          this.fetchRandomQuestion();
        }
      }, 100);
    } else {
      this.fetchRandomQuestion();
    }
  }

  componentDidUpdate(prevProps) {
    if (
      JSON.stringify(prevProps.filterContext.chosenFilters) !== 
      JSON.stringify(this.props.filterContext.chosenFilters)
    ) {
      this.fetchRandomQuestion();
    }
  }

  render() {
    const contentFont = getFontForCards(this.props.content);

    const cardStyle = {
      minHeight: this.state.minHeight,
    };

    return (
      <>
        <Helmet>
          <title>Random</title>
          <link rel="canonical" href="https://jous.app/random" />
        </Helmet>
        <div className="ui center aligned yellow inverted segment">
          <h1 className="w3-jumbo">Random Jous</h1>
        </div>
        <div className="ui container">
          <div className="event">
            {this.state.question ? (
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
            ) : (
              <div className="ui fluid card" id={0} style={cardStyle}>
                <div
                  className="content"
                  style={{ display: "flex", flexDirection: "column", height: "100%" }}
                >
                  <div
                    className="center aligned description"
                    style={{
                      flexGrow: 1,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                  >
                    <p style={{ fontFamily: contentFont }}>
                      {"No question left after filters, try something else."}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
          <button className="ui yellow button" onClick={this.fetchRandomQuestion}>
            Next
          </button>
        </div>
      </>
    );
  }
}

export default (props) => (
  <FilterContext.Consumer>
    {filterCtx => <Random {...props} filterContext={filterCtx} />}
  </FilterContext.Consumer>
);
