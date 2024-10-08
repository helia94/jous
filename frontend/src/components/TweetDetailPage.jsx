import React from "react";
import Axios from "axios";
import moment from 'moment'
import TweetItem2 from "./TweetItem2";
import { Helmet } from 'react-helmet';

class TweetDetailPage extends React.Component {
    state = {
        question: { id: 0, content: "", author: "", time: "" },
        answers: [],
        isLoggedIn: false,
        currentUser: { username: "" },
        newAnswer: "",
        anon: "False",
        width: 500,
    }

    componentDidMount() {
        Axios.get("/api/question/" + this.props.match.params.question).then(res => {
            this.setState({ question: res.data.question, answers: res.data.answers });
        });

        setTimeout(() => {
            const token = localStorage.getItem("token");
            if (token) {
                Axios.get("/api/getcurrentuser", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }).then(res => {
                    this.setState({ isLoggedIn: true })
                    this.setState({ currentUser: res.data })
                })
            }
        }, 20)
        this.setState({ width: window.innerWidth, height: window.innerHeight });
    }

    handleFormSubmit = (e) => {
        e.preventDefault();
        const config = {
            headers: {}
        };

        if (this.state.isLoggedIn) {
            config.headers['Authorization'] = "Bearer " + localStorage.getItem("token");
        }
        Axios.post("/api/addanswer", {
            content: this.state.newAnswer,
            anon: this.state.anon,
            question: this.props.match.params.question
        }, config).then(res => {
            if (res.data.success) {
                window.location.reload()
                console.log("added answer")
            } else {
                console.log(res.data.error)
                this.setState(
                    { formErr: res.data.error }
                )
            }
        })
    }

    handleInputChange = (e) => {
        e.preventDefault();
        this.setState({
            newAnswer: e.target.value
        });
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
                    <title>{`Question ${this.state.question.id}`}</title>
                    <link rel="canonical" href={`https://jous.app/question/${this.state.question.id}`} />
                </Helmet>
                <div class="ui basic segment" style={{ width: Math.min(this.state.width * 0.9, 500) }}>
                    <TweetItem2
                        id={this.state.question.id}
                        content={this.state.question.content}
                        author={this.state.question.username}
                        time={this.state.question.time}
                        likes={this.state.question.like_number}
                        answers={this.state.question.answer_number}
                        isOwner={this.state.currentUser.username === this.state.question.username}
                        key={0}
                    />
                    <div class="ui comments">
                        <h3 class="ui dividing header">Answers</h3>
                        {this.state.answers.map((item, index) => {
                            return (
                                <div class="comment">
                                    <div class="content">
                                        <a class="author" href={"/user/" + item.username}>{item.username}</a>
                                        <div class="metadata">
                                            <span class="date">{
                                                moment(item.time, 'ddd, DD MMM YYYY h:mm:ss').format('DD MMM')
                                            }</span>
                                        </div>
                                        <div class="text">
                                            {item.content}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <form class="ui reply form" onSubmit={this.handleFormSubmit} id="submit-form">
                        <div class="field" value={this.state.newAnswer} onChange={this.handleInputChange}>
                            <textarea></textarea>
                        </div>
                        <div class="ui buttons">

                            {this.state.isLoggedIn &&
                                <button type="submit"
                                    class="ui black submit icon button"
                                    value="post"
                                    data-tooltip="add answer"
                                    onClick={() => (this.setState({ anon: 'False' }))}>
                                    <i class="icon edit"></i>
                                </button>
                            }
                            <button type="submit"
                                class="ui black  submit icon button"
                                data-tooltip="add answer anonymously"
                                onClick={() => (this.setState({ anon: 'True' }))}>
                                <i class="user secret icon"></i>
                            </button>
                        </div>
                    </form>
                </div>
            </React.Fragment>
        );
    }
}

export default TweetDetailPage;
