import React from "react";
import Axios from "axios";
import styled, { css } from 'styled-components'

function deleteTweet(tid) {
    Axios.delete("/api/deletequestion/" + tid, { headers: { Authorization: "Bearer " + localStorage.getItem("token") } }).then(res => {
        console.log(res.data)
        window.location.reload();
    })
}

const ButtonGroup = styled.div`
  display: flex;
`

function TweetItem(props) {

    return (
        <div className="ui cards">
            <div className="card">
                <div className="content">
                <div class="right floated meta">14h</div>
                <div class="left floated meta">{props.author}</div>
                    <div className="description">
                        {props.content}
                    </div>
                </div>
                <div className="extra content">
                    <ButtonGroup>
                        <div class="ui labeled button" tabindex="0" data-tooltip="like">
                            <div class="ui button">
                                <i class="heart icon"></i>
                            </div>
                            <a class="ui basic label">
                                13
                            </a>
                        </div>
                        <div class="ui buttons">
                            <div className="ui basic grey button" data-tooltip="reask"><i class="retweet icon"></i></div>
                            <div className="ui basic grey button" data-tooltip="post to group"><i class="share icon"></i></div>
                        </div>
                    </ButtonGroup>
                    <ButtonGroup>
                        <div class="ui buttons">
                            <div className="ui basic grey button" data-tooltip="answer"><i class="reply icon"></i></div>
                            <div className="ui basic grey button" data-tooltip="answer anonymously"><i class="user secret icon"></i></div>
                        </div>
                        {props.isOwner &&
                            <button className="ui basic red button" onClick={() => deleteTweet(props.id)}><i class="trash alternate outline icon"></i>
                            </button>}
                    </ButtonGroup>
                </div>
            </div>
        </div >
    );
}

export default TweetItem;