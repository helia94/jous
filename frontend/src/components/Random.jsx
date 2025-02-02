// FRONTEND (Random.js)
import React from "react";
import Axios from "axios";
import TweetItem2 from "./TweetItem2";
import { Helmet } from "react-helmet";
import { LanguageContext } from "./LanguageContext";
import { FilterContext } from "./FilterContext";
import { getFontForCards } from "./FontUtils";
import { Container, Segment, Header, Card, Button } from "semantic-ui-react";
import 'semantic-ui-css/semantic.min.css';

class Random extends React.Component {
  static contextType = LanguageContext;

  constructor(props, context) {
    super(props, context);
    const { availableLanguages = [], language } = context;
    const selectedLanguage =
      availableLanguages.find((lang) => lang.frontend_code === language) || {
        frontend_code: "original",
        backend_code: null,
      };

    this.state = {
      questions: [],
      selectedLanguageFrontendCode: selectedLanguage.frontend_code,
      selectedLanguageBackendCode: selectedLanguage.backend_code,
      minHeight: 200,
    };
  }

  // Fetch 20 random questions; if append=true, add to current list
  fetchRandomQuestions = (append = false) => {
    const { chosenFilters } = this.props.filterContext;
    const filtersToUse = chosenFilters || {};

    Axios.get("/api/question/random", {
      params: {
        language_id: this.state.selectedLanguageBackendCode,
        ...filtersToUse,
      },
    })
      .then((res) => {
        if (res.data.error) {
          if (!append) this.setState({ questions: [] });
        } else {
          const newQuestions = res.data.questions;
          this.setState((prevState) => ({
            questions: append
              ? [...prevState.questions, ...newQuestions]
              : newQuestions,
          }));
        }
      })
      .catch(() => {
        if (!append) this.setState({ questions: [] });
      });
  };

  // Remove the current question; if less than 2 remain, fetch 20 more and append them.
  nextQuestion = () => {
    this.setState((prevState) => {
      const newQuestions = prevState.questions.slice(1);
      if (newQuestions.length < 2) {
        this.fetchRandomQuestions(true);
      }
      return { questions: newQuestions };
    });
  };

  componentDidMount() {
    this.fetchRandomQuestions();
  }

  componentDidUpdate(prevProps) {
    if (
      JSON.stringify(prevProps.filterContext.chosenFilters) !==
      JSON.stringify(this.props.filterContext.chosenFilters)
    ) {
      this.fetchRandomQuestions();
    }
  }

  render() {
    const fallbackMessage = "No question left after filters, try something else.";
    const contentFont = getFontForCards(fallbackMessage);
    const cardStyle = { minHeight: this.state.minHeight };

    const currentQuestion = this.state.questions[0];

    return (
      <>
        <Helmet>
          <title>Random</title>
          <link rel="canonical" href="https://jous.app/random" />
        </Helmet>
        <Segment inverted color="yellow" textAlign="center">
          <Header as="h1" className="w3-jumbo">
            Random Jous
          </Header>
        </Segment>
        <Container>
          <div className="event">
            {currentQuestion ? (
              <TweetItem2
                id={currentQuestion.question.id}
                content={currentQuestion.question.content}
                author={currentQuestion.question.username}
                time={currentQuestion.question.time}
                likes={currentQuestion.question.like_number}
                answers={currentQuestion.question.answer_number}
                isOwner={false}
                key={0}
                selectedLanguageFrontendCode={this.state.selectedLanguageFrontendCode}
              />
            ) : (
              <Card fluid style={cardStyle}>
                <Card.Content style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                  <Card.Description
                    textAlign="center"
                    style={{
                      flexGrow: 1,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                  >
                    <p style={{ fontFamily: contentFont }}>{fallbackMessage}</p>
                  </Card.Description>
                </Card.Content>
              </Card>
            )}
          </div>
          <Button color="yellow" onClick={this.nextQuestion}>
            Next
          </Button>
        </Container>
      </>
    );
  }
}

export default (props) => (
  <FilterContext.Consumer>
    {(filterCtx) => <Random {...props} filterContext={filterCtx} />}
  </FilterContext.Consumer>
);
