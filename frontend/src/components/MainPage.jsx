import React from "react";
import TweetItem from "./TweetItem";
import Axios from "axios";
import AddTweet from "./AddTweet";
import AddGroup from "./AddGroup";
import { check } from "../login";
import InfiniteScroll from 'react-infinite-scroll-component';

class MainPage extends React.Component {
    state = { tweets: [], currentUser: { username: "" }, login: false, hasMore: true, page: 0 }

    componentDidMount() {
        Axios.get("/api/questions/0").then(res => {
            this.setState({
                tweets: res.data.reverse(),
                page: this.state.page + 1
            })
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

    fetchMoreData = () => {
        console.log("page", this.state.page)
        Axios.get("/api/questions/" + this.state.page).then(res => {
            this.setState({
                tweets: this.state.tweets.concat(res.data.reverse()),
                page: this.state.page + 1
            });
            if (res.data.length === 0) {
                this.setState({ hasMore: false })
            }
        });
    }

    refresh = () => {
        window.location.reload()
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
                        : null}
                    <h1>Home</h1>
                    {this.state.login ? <AddTweet /> : null}
                    <div class="ui hidden divider"></div>
                    {
                        <InfiniteScroll
                            dataLength={this.state.tweets.length}
                            next={this.fetchMoreData}
                            hasMore={this.state.hasMore}
                            loader={<h4>Loading...</h4>}
                            endMessage={
                                <p style={{ textAlign: 'center' }}>
                                    <b>The end.</b>
                                </p>
                            }
                            useWindow={false}
                            height={600}
                        >
                            {this.state.tweets.map((item, index) => {
                                return (
                                    <div class="event">
                                        <TweetItem
                                            id={item.id}
                                            content={item.content}
                                            author={item.username}
                                            time={item.time}
                                            likes={item.like_number}
                                            answers={item.answer_number}
                                            isOwner={this.state.currentUser.username === item.username}
                                            key={index}
                                        />
                                    </div>
                                );
                            })}
                        </InfiniteScroll>
                    }
                </div>
            </React.Fragment>
        );
    }
}

export default MainPage;
