import React from "react";
import Axios from "axios";
import moment from 'moment'
import { getFontClassForCards } from './FontUtils';


function deleteAnswer(e, tid) {
    e.stopPropagation();
    Axios.delete("/api/deleteanswer/" + tid, { headers: { Authorization: "Bearer " + localStorage.getItem("token") } }).then(res => {
        console.log(res.data)
        window.location.reload();
    })
}

function routeToAuthor(e, author) {
    e.stopPropagation();
    let path = "/user/" + author;
    window.location.href = path;
}

export function getQuestion(questionId) {  
    return Axios.get("/api/question/" + questionId)
      .then(response => {
          const content = response.data.question.content
          console.log(content)
        return content;
      })
      .catch(error => {
        console.error(error);
      });
  }

function AnswerItem(props) {
    const contentFont = getFontClassForCards(props.content);
    

    let [showQuestion, setShowQuestion] = React.useState(false);
    let [questionContent, setQuestionContent] = React.useState("");

    return (
        <div className="ui fluid card" id={props.id}>
            <div className="content">
                <div class="right floated meta">{moment(props.time, 'ddd, DD MMM YYYY h:mm:ss').format('DD MMM')}</div>
                <div class="left floated meta" onClick={(e) => routeToAuthor(e, props.author)}>{props.author}</div>
                <div className={"description "+contentFont}>
                    <p style={{ 
                        flexGrow: 1,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",}}>{props.content}</p>
                </div>
            </div>
            <div className="extra content">
                {props.isOwner &&
                    <button className="mini ui basic red button" onClick={e => deleteAnswer(e, props.id)}><i class="trash alternate outline icon"></i>
                    </button>}
                <button className="mini ui basic button" onClick={e => {
                    setShowQuestion(!showQuestion);
                    if (questionContent === ""){
                    getQuestion(props.question).then(data =>setQuestionContent(data));}
                }}><i class="question circle outline icon"></i>
                </button>
            </div>
            {showQuestion ? <div class="ui small message ">{questionContent}</div> : null}
        </div >
    );
}

export default AnswerItem;