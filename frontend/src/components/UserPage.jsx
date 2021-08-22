import React from "react";
import TweetItem from "./TweetItem";
import Axios from "axios";

class UserPage extends React.Component {
    state = { tweets: [], currentUser: { username: "" } }

    componentDidMount() {
        Axios.post("/api/userquestions", { username: this.props.match.params.username }).then(res => {
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

    render() {
        return (
            <React.Fragment>
                <div class="ui two item menu">
                    <a class="active item">Questions</a>
                    <a class="item">Answers</a>
                </div>
                <div
                    className="w3-container w3-jumbo"
                    style={{ margin: "3rem", paddingLeft: "1rem" }}>
                    <h1>{this.props.match.params.username} questions</h1>
                </div>
                <div class="ui feed">
                    {this.state.tweets.map((item, index) => {
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
                    })}
                </div>
            </React.Fragment>
        );
    }
}

export default UserPage;
