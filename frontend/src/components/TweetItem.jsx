import React from "react";
import Axios from "axios";
import styled, { css } from 'styled-components'
import moment from 'moment'
import { Link } from "react-router-dom";


function deleteTweet(e, tid) {
    e.stopPropagation();
    Axios.delete("/api/deletequestion/" + tid, { headers: { Authorization: "Bearer " + localStorage.getItem("token") } }).then(res => {
        console.log(res.data)
        window.location.reload();
    })
}

function routeChange (id) { 
    let path = "/question/"+id; 
    window.location.href=path;
  }

const ButtonGroup = styled.div`
  display: flex;
`

function TweetItem(props) {

    return (
        <a className="ui card" id={props.id} onClick={()=>routeChange(props.id)}>
            <div className="content">
                <div class="right floated meta">{moment(props.time).format('d MMM')}</div>
                <div class="left floated meta">{<Link to={"/user/" + props.author}>{props.author}</Link>}</div>
                <div className="description">
                    <p>{props.content}</p>
                </div>
            </div>
            <div className="extra content">
                <ButtonGroup>
                    <div class="mini ui labeled button" tabindex="0" data-tooltip="like">
                        <div class="mini ui button">
                            <i class="heart icon"></i>
                        </div>
                        <a class="ui basic label">
                            13
                        </a>
                    </div>
                    <div class="ui buttons mini">
                        <div className="ui basic grey button" data-tooltip="reask"><i class="retweet icon"></i></div>
                        <div className="ui basic grey button" data-tooltip="post to group"><i class="share icon"></i></div>
                    </div>
                </ButtonGroup>
                <ButtonGroup>
                    <div class="ui buttons mini">
                        <div className="ui basic grey button" 
                        data-tooltip="answer" 
                        onClick={() => {
                            document.getElementById("addAnswer").style.display = "block"
                        }}
                        ><i class="reply icon"></i>
                        </div>
                        <div className="ui basic grey button" 
                        data-tooltip="answer anonymously"
                            onClick={() => {
                            document.getElementById("addAnswer").style.display = "block"
                        }}>
                            <i class="user secret icon"></i>
                            </div>
                    </div>
                    {props.isOwner &&
                        <button className="mini ui basic red button" onClick={e => deleteTweet(e, props.id)}><i class="trash alternate outline icon"></i>
                        </button>}
                </ButtonGroup>
            </div>
        </a >
    );
}

export default TweetItem;