import React from "react";
import TweetItem from "./TweetItem";
import Axios from "axios";

class UserPage extends React.Component {
    state = { tweets: [], currentUser: { username: "" }, active: "q" }

    componentDidMount() {
        Axios.post("/api/userquestions", { username: this.props.match.params.username }).then(res => {
            console.log(res.data.reverse())
            this.setState({ tweets: res.data.reverse() })
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

    toAnswers = (e) => {
        this.setState({ active: "a" })
    }

    toQuestion = (e) => {
        this.setState({ active: "q" })
    }

    render() {
        return (
            <React.Fragment>
                <div class="ui basic segment" style={{ width: 400 }}>
                    <div className="ui basic segment">
                        <div class="ui yellow large header">{this.props.match.params.username}</div>
                    </div>
                    <div class="ui tabular menu">
                        <a class={(this.state.active == "q" ? "active" : "") + " item"}
                            onClick={this.toQuestion}>Questions</a>
                        <a class={(this.state.active == "a" ? "active" : "") + " item"}
                            onClick={this.toAnswers}>Answers</a>
                    </div>
                    <div class="ui feed">
                        {this.state.active == "q" ?
                            this.state.tweets.map((item, index) => {
                                return (
                                    <div class="event">
                                        <TweetItem
                                            id={item.id}
                                            content={item.content}
                                            author={item.username}
                                            time={item.time}
                                            isOwner={this.state.currentUser.username === item.username}
                                            key={index}
                                        />
                                    </div>
                                );
                            })
                            : <div class="event"></div>}
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default UserPage;
