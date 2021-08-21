import React from "react";
import TweetItem from "./TweetItem";
import Axios from "axios";
import AddTweet from "./AddTweet";

class MainPage extends React.Component {
    state = { tweets: [], currentUser: { username: "" } }

    componentDidMount() {
        Axios.get("/api/questions").then(res => {
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
                <div
                    className="w3-container w3-jumbo"
                    style={{ margin: "3rem", paddingLeft: "1rem" }}>
                    <h1>Questions</h1>
                    <div className="ui olive button"
                        onClick={() => {
                            document.getElementById("addTweet").style.display = "block"
                        }}>
                        Add a question
                    </div>
                </div>
                <AddTweet />
                <div class="ui feed">
                    {this.state.tweets.length === 0 ?
                        <p className="ui card" >No questions yet! Create
                            one</p> : this.state.tweets.map((item, index) => {
                                return (
                                    <div class="event">
                                        <TweetItem
                                            id={item.id}
                                            content={item.content}
                                            author={item.username}
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

export default MainPage;
