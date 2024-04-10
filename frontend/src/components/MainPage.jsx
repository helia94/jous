import React from "react";
import Axios from "axios";
import InfiniteScroll from 'react-infinite-scroll-component';
import TweetItem2 from "./TweetItem2";
import AddTweet from "./AddTweet";
import AddGroup from "./AddGroup";
import { check } from "../login";

class MainPage extends React.Component {
    state = { tweets: [], currentUser: { username: "" }, login: false, hasMore: true, page: 0, width: 500, height: 600, showAddQuestion: false }

    componentDidMount() {
        Axios.get("/api/questions/0").then(res => {
            this.setState({
                tweets: res.data.reverse(),
                page: this.state.page + 1
            })
        });
        setTimeout(() => {
            if (this.state.login) {
                Axios.get("/api/getcurrentuser", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }).then(res => {
                    if (res.status === 200) {
                        this.setState({ currentUser: res.data });
                    } else {
                        console.log("could not get current user");
                    }
                }).catch(error => {
                    console.error("Error fetching current user:", error);
                });
            }
        }, 500);



        check().then(r => this.setState({ login: r }));

        window.addEventListener('resize', this.updateDimensions);
        this.setState({ width: window.innerWidth, height: window.innerHeight });
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

    updateDimensions = () => {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
    };

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateDimensions);
    }

    toggleShowAddQuestion = () => this.setState({ showAddQuestion: !this.state.showAddQuestion });

    render() {
        return (
            <React.Fragment>
                <div class="ui basic segment" style={{ width: Math.min(this.state.width, 768) }}>
                    <h1>Home</h1>
                    {!this.state.showAddQuestion &&
                        <div className="ui tiny black button"
                            onClick={this.toggleShowAddQuestion}>
                            Add a question
                        </div>}

                    {this.state.showAddQuestion && <AddTweet onClose={() => this.toggleShowAddQuestion()}/>}
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
                            height={Math.max(this.state.height - 200, 300)}
                        >
                            {this.state.tweets.map((item, index) => {
                                return (
                                    <div class="event">
                                        <TweetItem2
                                            id={item.id}
                                            content={item.content}
                                            author={item.username}
                                            time={item.time}
                                            likes={item.like_number}
                                            answers={item.answer_number}
                                            isOwner={this.state.currentUser.username === item.username}
                                            key={index}
                                            isLoggedIn={this.state.login}
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
