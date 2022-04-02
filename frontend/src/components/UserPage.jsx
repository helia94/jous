import React from "react";
import Axios from "axios";
import TweetItem from "./TweetItem";
import AnswerItem from "./AnswerItem";

class UserPage extends React.Component {
    state = {
        currentUser: {}, active: "q", isOwener: false,
        questions: [], answers: [], groups: [], answersToQuestions: [], width: 500
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

    toGroups = (e) => {
        this.setState({ active: "g" })
        if (this.state.groups.length === 0) {
            Axios.post("/api/usergroups", { username: this.props.match.params.username }
            , { headers: { Authorization: "Bearer " + localStorage.getItem("token") } }).then(res => {
                this.setState({ groups: res.data })
            });
        }
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
                <div class="ui basic segment" style={{ width: Math.min(this.state.width * 0.9, 500) }}>
                    <div className="ui basic segment">
                        <div class="ui yellow large header">{this.props.match.params.username}</div>
                    </div>
                    <div class="ui tabular menu">
                        <a class={(this.state.active === "q" ? "active" : "") + " item"}
                            onClick={this.toQuestions}>Questions</a>
                        <a class={(this.state.active === "a" ? "active" : "") + " item"}
                            onClick={this.toAnswers}>Answers</a>
                        {this.state.isOwener ?
                            <a class={(this.state.active === "g" ? "active" : "") + " item"}
                                onClick={this.toGroups}>Groups</a>
                            : null}
                        {this.state.isOwener ?
                            <a class={(this.state.active === "aq" ? "active" : "") + " item"}
                                onClick={this.toAnswersToQuestion}>Answers to my questions</a>
                            : null}
                    </div>
                    <div class="ui feed">
                        {this.state.active === "q" ?
                            this.state.questions.map((item, index) => {
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
                                }) : this.state.active === "g" ?
                                    <div class="ui segments">
                                        {this.state.groups.map((item, index) => {
                                            return (
                                                <div class="ui basic segment">
                                                    <a href={`/group/${item.group_name}`} >{item.group_name}</a>
                                                </div>
                                            );
                                        })}
                                    </div> :
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
