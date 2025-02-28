import React, { useState, useEffect, useContext } from "react";
import Axios from "axios";
import TweetItem2 from "./TweetItem2";
import { Helmet } from "react-helmet";
import { LanguageContext } from "./LanguageContext";
import { FilterContext } from "./FilterContext";
import { getFontForCards } from "./FontUtils";
import { Container, Segment, Header, Card, Button } from "semantic-ui-react";
import 'semantic-ui-css/semantic.min.css';
import { useSwipeable } from "react-swipeable";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import SwipePopup from "./SwipePopup"; // Import the SwipePopup component
import "./Random.css";

const Random = ({ filterContext }) => {
  const { availableLanguages, language } = useContext(LanguageContext);
  const selectedLanguage =
    availableLanguages.find((lang) => lang.frontend_code === language) || {
      frontend_code: "original",
      backend_code: null,
    };

  const [questions, setQuestions] = useState([]);
  const [selectedLanguageFrontendCode, setSelectedLanguageFrontendCode] = useState(selectedLanguage.frontend_code);
  const [selectedLanguageBackendCode, setSelectedLanguageBackendCode] = useState(selectedLanguage.backend_code);
  const [minHeight, setMinHeight] = useState(200);
  const [showPopup, setShowPopup] = useState(true);
  const isMobile = window.innerWidth < 768;

  const fetchRandomQuestions = async (append = false) => {
    const { chosenFilters } = filterContext;
    const filtersToUse = chosenFilters || {};

    try {
      const res = await Axios.get("/api/question/random", {
        params: {
          language_id: selectedLanguageBackendCode,
          ...filtersToUse,
        },
      });
      if (res.data.error) {
        if (!append) setQuestions([]);
      } else {
        const newQuestions = res.data.questions;
        setQuestions((prevQuestions) =>
          append ? [...prevQuestions, ...newQuestions] : newQuestions
        );
      }
    } catch (error) {
      if (!append) setQuestions([]);
    }
  };

  const nextQuestion = () => {
    setQuestions((prevQuestions) => {
      const newQuestions = prevQuestions.slice(1);
      if (newQuestions.length < 2) {
        fetchRandomQuestions(true);
      }
      return newQuestions;
    });
  };

  useEffect(() => {
    fetchRandomQuestions();
  }, []);

  useEffect(() => {
    fetchRandomQuestions();
  }, [filterContext.chosenFilters]);

  const fallbackMessage = "No question left after filters, try something else.";
  const contentFont = getFontForCards(fallbackMessage);
  const cardStyle = { minHeight };

  const currentQuestion = questions[0];

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => nextQuestion(),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

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
        {isMobile && showPopup && <SwipePopup onClose={() => setShowPopup(false)} />}
        <div className="event" {...swipeHandlers}>
          <TransitionGroup>
            {currentQuestion ? (
              <CSSTransition
                key={currentQuestion.question.id}
                timeout={300}
                classNames="fade"
              >
                <TweetItem2
                  id={currentQuestion.question.id}
                  content={currentQuestion.question.content}
                  author={currentQuestion.question.username}
                  time={currentQuestion.question.time}
                  likes={currentQuestion.question.like_number}
                  answers={currentQuestion.question.answer_number}
                  isOwner={false}
                  selectedLanguageFrontendCode={selectedLanguageFrontendCode}
                />
              </CSSTransition>
            ) : (
              <CSSTransition
                key="no-question"
                timeout={300}
                classNames="fade"
              >
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
              </CSSTransition>
            )}
          </TransitionGroup>
        </div>
        <Button color="yellow" onClick={nextQuestion} className="mobile-next-button">
          Next
        </Button>
      </Container>
    </>
  );
};

export default (props) => (
  <FilterContext.Consumer>
    {(filterCtx) => <Random {...props} filterContext={filterCtx} />}
  </FilterContext.Consumer>
);