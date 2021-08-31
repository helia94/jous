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

    fetchMoreData = (e) => {
        console.log("fetch more data called")
        Axios.get("/api/questions/" + this.state.page).then(res => {
            this.setState({
                tweets: this.state.items.concat(res.data.reverse()),
                page: this.state.page + 1
            });
        });
        console.log("page: " + this.state.page)
    }

    refresh = (e) => {
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
                    <div class="ui feed">
                        {this.state.tweets.length === 0 ?
                            <p className="ui card" >
                                {'No questions yet!' + (this.state.login ? ' Create one' : '')}
                            </p>
                            :
                            <div
                                id="scrollableDiv"
                                style={{
                                    height: 600,
                                    overflow: 'auto',
                                    display: 'flex',
                                    flexDirection: 'column-reverse',
                                }}
                            >
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
                                >
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
                                </InfiniteScroll>
                            </div>
                        }

                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default MainPage;
