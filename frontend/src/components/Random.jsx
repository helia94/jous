import React, { useState, useEffect, useContext } from "react";
import Axios from "axios";
import TweetItem2 from "./TweetItem2";
import { Helmet } from "react-helmet";
import { LanguageContext } from "./LanguageContext";
import { FilterContext } from "./FilterContext";
import { getFontForCards } from "./FontUtils";
import { Container, Segment, Header, Card, Button } from "semantic-ui-react";
import { useSwipeable } from "react-swipeable";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import SwipePopup from "./SwipePopup";
import "./Random.css";

const Random = () => {
  const { availableLanguages, language } = useContext(LanguageContext);
  const { chosenFilters } = useContext(FilterContext);

  const selectedLanguage =
    availableLanguages.find((lang) => lang.frontend_code === language) || {
      frontend_code: "original",
      backend_code: null,
    };

  const [questions, setQuestions] = useState([]);
  const [showPopup, setShowPopup] = useState(true);
  const [showNoQuestion, setShowNoQuestion] = useState(false);
  const isMobile = window.innerWidth < 768;

  const fetchQuestions = async () => {
    try {
      const res = await Axios.get("/api/question/random", {
        params: {
          language_id: selectedLanguage.backend_code,
          ...chosenFilters,
        },
      });
      if (!res.data.error) {
        setQuestions((prev) => [...prev, ...res.data.questions]);
      }
    } catch (err) {
      // Should double check error handling
    }
  };

  useEffect(() => {
    setQuestions([]);
    fetchQuestions();
  }, [chosenFilters, selectedLanguage.backend_code]);

  useEffect(() => {
    const delay = 500; // 500ms delay
    const timer = setTimeout(() => {
      setShowNoQuestion(true);
    }, delay);

    return () => clearTimeout(timer); // Clear timeout on component unmount
  }, [questions]); // Run effect when questions change

  const nextQuestion = () => {
    setQuestions((prev) => {
      const newList = prev.slice(1);
      if (newList.length < 2) fetchQuestions();
      return newList;
    });
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: nextQuestion,
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  const currentQuestion = questions[0];
  const fallbackMessage = "No question left after filters, try something else.";
  const contentFont = getFontForCards(fallbackMessage);

  return (
    <>
      <Helmet>
        <title>Random</title>
      </Helmet>
      <Segment inverted color="yellow" textAlign="center">
        <Header as="h1">Random Jous</Header>
      </Segment>
      <Container className="random-container">
        {isMobile && showPopup && <SwipePopup onClose={() => setShowPopup(false)} />}
        <div className="event" {...swipeHandlers}>
          <TransitionGroup>
            {currentQuestion ? (
              <CSSTransition
                key={currentQuestion.question.id}
                timeout={300}
                classNames="slide"
              >
                <div className="tweet-container">
                  <TweetItem2
                    id={currentQuestion.question.id}
                    content={currentQuestion.question.content}
                    author={currentQuestion.question.username}
                    time={currentQuestion.question.time}
                    likes={currentQuestion.question.like_number}
                    answers={currentQuestion.question.answer_number}
                    isOwner={false}
                    selectedLanguageFrontendCode={selectedLanguage.frontend_code}
                  />
                </div>
              </CSSTransition>
            ) : (
              showNoQuestion && (
                <CSSTransition key="no-question" timeout={300} classNames="slide">
                  <div className="tweet-container">
                    <Card fluid>
                      <Card.Content>
                        <Card.Description textAlign="center">
                          <p style={{ fontFamily: contentFont }}>{fallbackMessage}</p>
                        </Card.Description>
                      </Card.Content>
                    </Card>
                  </div>
                </CSSTransition>
              )
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

export default Random;