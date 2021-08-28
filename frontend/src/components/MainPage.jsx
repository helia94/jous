import React from "react";
import TweetItem from "./TweetItem";
import Axios from "axios";
import AddTweet from "./AddTweet";
import AddGroup from "./AddGroup";
import {check} from "../login";

class MainPage extends React.Component {
    state = { tweets: [], currentUser: { username: "" }, login: false }

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
        }, 500);

        check().then(r => this.setState({ login: r }));
    }

    render() {
        return (
            <React.Fragment>
                <div class="ui basic segment" style={{ width: 400 }}>
                {this.state.login ?
                    <div class="ui right dividing rail">

                        <div className="ui olive button"
                            onClick={() => {
                                document.getElementById("addTweet").style.display = "block"
                            }}>
                            Add a question
                        </div>
                        <AddGroup />
                    </div>
                    :null}
                    <h1>Home</h1>
                    {this.state.login ?<AddTweet />:null}
                    <div class="ui hidden divider"></div>
                    <div class="ui feed">
                        {this.state.tweets.length === 0 ?
                            <p className="ui card" >
                                {'No questions yet!'+(this.state.login ?' Create one':'')}
                                </p> 
                            : this.state.tweets.map((item, index) => {
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
                </div>
            </React.Fragment>
        );
    }
}

export default MainPage;
