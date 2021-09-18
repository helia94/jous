import React from "react";
import Axios from "axios";
import moment from 'moment'


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

function AnswerItem(props) {

    let [showQuestion, setShowQuestion] = React.useState(false);

    return (
        <a className="ui card" id={props.id}>
            <div className="content">
                <div class="right floated meta">{moment(props.time).format('d MMM')}</div>
                <div class="left floated meta" onClick={(e) => routeToAuthor(e, props.author)}>{props.author}</div>
                <div className="description">
                    <p>{props.content}</p>
                </div>
            </div>
            <div className="extra content">
                {props.isOwner &&
                    <button className="mini ui basic red button" onClick={e => deleteAnswer(e, props.id)}><i class="trash alternate outline icon"></i>
                    </button>}
                <button className="mini ui basic button" onClick={e => setShowQuestion(!showQuestion)}><i class="question circle outline icon"></i>
                </button>
            </div>
            {showQuestion ? <div class="ui small message ">{props.question}</div> : null}
        </a >
    );
}

export default AnswerItem;