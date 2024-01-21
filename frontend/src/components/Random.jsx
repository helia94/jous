import React from "react";
import Axios from "axios";
import TweetItem from "./TweetItem";


class Random extends React.Component {
    state = { question: ""}

    nextRandomQuestion = () => {
        Axios.get("/api/question/random").then(res => {
            this.setState({
                question: res.data.question,
            })
        });
    }

    componentDidMount() {
        Axios.get("/api/question/random").then(res => {
            this.setState({
                question: res.data.question,
            })
        });    
    }
    
    render() {
        return (
        <React.Fragment>
            <div className="ui center aligned yellow inverted segment">
                <h1 className="w3-jumbo">Random Jous</h1>
            </div>
            <div class="ui container">
                <div class="event">
                    <TweetItem
                        id={this.state.question.id}
                        content={this.state.question.content}
                        author={this.state.question.username}
                        time={this.state.question.time}
                        likes={this.state.question.like_number}
                        answers={this.state.question.answer_number}
                        isOwner={false}
                        key={0}
                    />
                </div>
                <div className="ui yellow button"
                            onClick={this.nextRandomQuestion}>
                            Next
                        </div>
            </div>
        </React.Fragment>
    );
}
}

export default Random;
