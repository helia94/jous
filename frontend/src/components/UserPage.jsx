import React from "react";
import Axios from "axios";
import TweetItem2 from "./TweetItem2";
import AnswerItem from "./AnswerItem";
import { Helmet } from 'react-helmet';

class UserPage extends React.Component {
    state = {
        currentUser: {}, active: "q", isOwener: false,
        questions: [], answers: [], answersToQuestions: [], width: 500
    }

    componentDidMount() {
        Axios.post("/api/userquestions", { username: this.props.match.params.username }).then(res => {
            this.setState({ questions: res.data.reverse() })
        });
        setTimeout(() => {
            Axios.get("/api/getcurrentuser", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            }).then(res => {
                this.setState({
                    currentUser: res.data,
                    isOwener: res.data.username === this.props.match.params.username
                })
            }).catch(error => {
                console.error("Error fetching current user:", error);
            })
        }, 500)

        this.setState({ width: window.innerWidth, height: window.innerHeight });
    }

    toAnswers = (e) => {
        this.setState({ active: "a" })
        if (this.state.answers.length === 0) {
            Axios.post("/api/useranswers", { username: this.props.match.params.username }).then(res => {
                this.setState({ answers: res.data })
            });
        }
    }

    toAnswersToQuestion = (e) => {
        this.setState({ active: "aq" })
        if (this.state.answersToQuestions.length === 0) {
            Axios.get("/api/useranswerstoquestions", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            }).then(res => {
                console.log(res.data)
                this.setState({ answersToQuestions: res.data })
            });
        }
    }

    toQuestions = (e) => {
        this.setState({ active: "q" })
    }


    updateDimensions = () => {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
    };

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateDimensions);
    }

    render() {
        return (
            <React.Fragment>
                <Helmet>
                    <title>{`User ${this.state.currentUser.username}`}</title>
                    <link rel="canonical" href={`https://jous.app/user/${this.state.currentUser.username}`} />
                </Helmet>
                <div class="ui basic segment" style={{ width: Math.min(this.state.width * 0.9, 500) }}>
                    <div className="ui basic segment">
                        <div class="ui yellow large header">{this.props.match.params.username}</div>
                    </div>
                    <div class="ui tabular menu">
                        <div class={(this.state.active === "q" ? "active" : "") + " item"}
                            onClick={this.toQuestions}>Questions</div>
                        <div class={(this.state.active === "a" ? "active" : "") + " item"}
                            onClick={this.toAnswers}>Answers</div>
                        {this.state.isOwener ?
                            <div class={(this.state.active === "aq" ? "active" : "") + " item"}
                                onClick={this.toAnswersToQuestion}>Answers to my questions</div>
                            : null}
                    </div>
                    <div class="ui feed">
                        {this.state.active === "q" ?
                            this.state.questions.map((item, index) => {
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
                                        />
                                    </div>
                                );
                            })
                            : this.state.active === "a" ?
                                this.state.answers.map((item, index) => {
                                    return (
                                        <div class="event">
                                            <AnswerItem
                                                id={item.id}
                                                content={item.content}
                                                author={item.username}
                                                question={item.question}
                                                time={item.time}
                                                isOwner={this.state.currentUser.username === item.username}
                                                key={index}
                                            />
                                        </div>
                                    );
                                }):
                                    this.state.answersToQuestions.map((item, index) => {
                                        return (
                                            <div class="event">
                                                <AnswerItem
                                                    id={item.id}
                                                    content={item.content}
                                                    author={item.username}
                                                    question={item.question}
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

export default UserPage;
