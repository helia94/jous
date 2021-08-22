import React from "react";
import TweetItem from "./TweetItem";
import Axios from "axios";
import moment from 'moment'

class TweetDetailPage extends React.Component {
    state = { question: {}, answers: [], currentUser: { username: "" } }

    componentDidMount() {
        Axios.get("/api/question/" + this.props.match.params.question).then(res => {
            this.setState({ question: res.data.reverse().question, answers: res.data.reverse().answers });
        });
        setTimeout(() => {
            Axios.get("/api/getcurrentuser", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            }).then(res => {
                this.setState({ currentUser: res.data })
            })
        }, 500)
    }

    render() {
        return (
            <React.Fragment>
                <TweetItem
                    id={this.state.question.id}
                    content={this.state.question.content}
                    author={this.state.question.username}
                    time={this.state.question.time}
                    isOwner={this.state.currentUser.username === this.state.question.username}
                    key={0}
                />
                <div class="ui comments">
                    <h3 class="ui dividing header">Answers</h3>
                    {this.state.answers.map((item, index) => {
                        return (
                            <div class="comment">
                                <div class="content">
                                    <a class="author">{item.username}</a>
                                    <div class="metadata">
                                        <span class="date">{moment(item.time).format('d MMM')}</span>
                                    </div>
                                    <div class="text">
                                        {item.content}
                                    </div>
                                    <div class="actions">
                                        <a class="reply">Reply</a>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <form class="ui reply form">
                    <div class="field">
                        <textarea></textarea>
                    </div>
                    <div class="ui blue labeled submit icon button">
                        <i class="icon edit"></i> Add Reply
                    </div>
                </form>
            </React.Fragment>
        );
    }
}

export default TweetDetailPage;
