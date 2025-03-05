import React, { useState } from "react";
import { Modal, Header, Icon } from "semantic-ui-react";
import QuizQuestion from "./QuizQuestion";
import QuizResult from "./QuizResult";
import { quizData } from "./quizData";

const QuizModal = ({ open, onClose }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [isQuizComplete, setIsQuizComplete] = useState(false);

  const handleAnswerSelect = (score) => {
    setTotalScore((prev) => prev + score);
    if (currentQuestionIndex < quizData.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setIsQuizComplete(true); // Quiz is complete, show results
    }
  };

  const handleClose = () => {
    onClose();
    // Reset quiz state when modal closes
    setCurrentQuestionIndex(0);
    setTotalScore(0);
    setIsQuizComplete(false);
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      size="small"
      closeIcon
      style={{ maxWidth: "500px", margin: "0 auto" }}
    >
      <Modal.Header style={{ padding: "1.5em", borderBottom: "1px solid #eee" }}>
        <Header as="h2" style={{ margin: 0 }}>
          <Icon name="question circle outline" />
          Quiz Time!
        </Header>
      </Modal.Header>
      <Modal.Content style={{ padding: "2em" }}>
        {isQuizComplete ? (
          <QuizResult totalScore={totalScore} onClose={handleClose} />
        ) : (
          <QuizQuestion
            question={quizData[currentQuestionIndex].question}
            answers={quizData[currentQuestionIndex].answers}
            onAnswerSelect={handleAnswerSelect}
            questionsLeft={quizData.length - currentQuestionIndex}
          />
        )}
      </Modal.Content>
    </Modal>
  );
};

export default QuizModal;