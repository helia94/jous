import React, { useState } from "react";
import Axios from "axios";
import styled, { css } from 'styled-components'
import moment from 'moment'


class TweetItem extends React.Component {
    state = { showGroupNameForm: false, groupName: "" }

    deleteTweet = (e) => {
        Axios.delete("/api/deletequestion/" + this.props.id, { headers: { Authorization: "Bearer " + localStorage.getItem("token") } }).then(res => {
            window.location.reload();
        })
    }

    routeToQuestion= (e) => {
        let path = "/question/" + this.props.id;
        window.location.href = path;
    }

    routeToAuthor= (e) => {
        e.stopPropagation();
        let path = "/user/" + this.props.author;
        window.location.href = path;
    }

    
    handleInputChange = (e) => {
        e.preventDefault();
        this.setState({
            groupName: e.target.value
        });
    }

    handleSubmit = (e) =>  {
        e.preventDefault();
        Axios.post("/api/addquestiontogroup",
            {
                name: this.state.groupName,
                question: this.props.id
            },
            {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            }).then(res => {
                console.log(res.data.success)
            })
        this.setState({
            showGroupNameForm: false
        });
    }

    postToGroupClick = (e) =>  {
        this.setState({
            showGroupNameForm: true
        });
    }

    render() {
        return (
            <a className="ui card" id={this.props.id} >
                <div className="content" onClick={this.routeToQuestion}>
                    <div class="right floated meta">{moment(this.props.time).format('d MMM')}</div>
                    <div class="left floated meta" onClick={this.routeToAuthor}>{this.props.author}</div>
                    <div className="description">
                        <p>{this.props.content}</p>
                    </div>
                </div>
                <div className="extra content">
                    <div class="ui buttons">
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
                            {this.state.showGroupNameForm ? null :
                                <div className="ui basic grey button"
                                    data-tooltip="post to group"
                                    onClick={this.postToGroupClick}>
                                    <i class="share icon"></i>
                                </div>}
                        </div>
                    </div>
                    <div class="ui buttons">
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
                        {this.props.isOwner &&
                            <button className="mini ui basic red button" onClick={this.deleteTweet}><i class="trash alternate outline icon"></i>
                            </button>}
                    </div>
                </div>
                {this.state.showGroupNameForm ?
                    <form class="ui small form" onSubmit={this.handleSubmit}>
                        <div class="field" value={this.state.groupName} onChange={this.handleInputChange}>
                            <label>Group name</label>
                            <input type="text" name="name" placeholder="OlympusJous"></input>
                        </div>
                        <button type="submit" class="ui button" type="submit">add</button>
                    </form>
                    : null
                }
            </a >
        );
    }
}

export default TweetItem