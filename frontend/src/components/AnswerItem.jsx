import React from "react";
import Axios from "axios";
import styled, { css } from 'styled-components'
import moment from 'moment'
import { Link } from "react-router-dom";


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

const ButtonGroup = styled.div`
  display: flex;
`

function AnswerItem(props) {

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
                <div class="mini ui labeled button" tabindex="0" data-tooltip="like">
                    <div class="mini ui button">
                        <i class="heart icon"></i>
                    </div>
                    <a class="ui basic label">
                        13
                    </a>
                </div>
                {props.isOwner &&
                    <button className="mini ui basic red button" onClick={e => deleteAnswer(e, props.id)}><i class="trash alternate outline icon"></i>
                    </button>}
            </div>
        </a >
    );
}

export default AnswerItem;