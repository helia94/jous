import React from "react";
import TweetItem from "./TweetItem";
import Axios from "axios";
import moment from 'moment'

class TweetDetailPage extends React.Component {
    state = { question: { id: 0, content: "", author: "", time: "" }, answers: [], currentUser: { username: "" }, newAnswer: "", anon: "False" }

    componentDidMount() {
        console.log(this.props.match.params.question)
        Axios.get("/api/question/" + this.props.match.params.question, { headers: { Authorization: "Bearer " + localStorage.getItem("token") } }).then(res => {
            console.log(res.data)
            this.setState({ question: res.data.question, answers: res.data.answers });
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

    handleFormSubmit = (e) => {
        e.preventDefault();
        Axios.post("/api/addanswer", {
            content: this.state.newAnswer,
            anon: this.state.anon,
            question: this.props.match.params.question
        }, {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
            }
        }).then(res => {
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

    render() {
        return (
            <React.Fragment>
                <div class="ui basic segment" style={{ width: 400 }}>
                    <TweetItem
                        id={this.state.question.id}
                        content={this.state.question.content}
                        author={this.state.question.username}
                        time={this.state.question.time}
                        likes={this.state.question.like_number}
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
                            <button type="submit" 
                            class="ui olive  submit icon button" 
                            value="post" 
                            data-tooltip="add answer"
                            onClick={() => (this.setState({anon : 'False'}))}>
                                <i class="icon edit"></i>
                                </button>
                            <button type="submit" 
                            class="ui olive  submit icon button"
                            data-tooltip="add answer anonymously"  
                            onClick={() => (this.setState({anon : 'True'}))}>
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
