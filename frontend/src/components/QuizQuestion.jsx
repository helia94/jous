import React from "react";

const QuizQuestion = ({ question, answers, onAnswerSelect, questionsLeft }) => {
  return (
    <div className="ui segment raised" style={{ maxWidth: "500px", margin: "0 auto", padding: "2em" }}>
      <h3 className="ui header" style={{ fontSize: "1.5em", marginBottom: "1em" }}>
        {question}
      </h3>
      <p className="ui sub header" style={{ color: "#666", marginBottom: "1.5em" }}>
        {questionsLeft} questions left
      </p>
      <div className="ui list relaxed ">
        {answers.map((answer, index) => (
          <div
            key={index}
            className="item"
            style={{ padding: "0.75em", cursor: "pointer", transition: "all 0.3s ease" }}
            onClick={() => onAnswerSelect(answer.score)}
          >
            <div
              className="ui segment basic"
              style={{
                borderRadius: "8px",
                padding: "1em",
                backgroundColor: "#E3D5CA",
                transition: "all 0.3s ease",
              }}

            >
              <span style={{ fontSize: "1em", color: "inherit" }}>{answer.text}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuizQuestion;
