import React from "react";
import Axios from "axios";
import moment from 'moment'


class GroupQuestion extends React.Component {
    state = { newAnswer: "" }


    routeToQuestion = (e) => {
        let path = "/question/" + this.props.question.id;
        window.location.href = path;
    }

    routeToAuthor = (e) => {
        e.stopPropagation();
        let path = "/user/" + this.props.question.author;
        window.location.href = path;
    }


    handleInputChange = (e) => {
        e.preventDefault();
        this.setState({
            newAnswer: e.target.value
        });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        Axios.post("/api/addanswer",
            {
                question: this.props.question.id,
                group: this.props.group,
                content: this.state.newAnswer,
                anon: false
            },
            {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            }).then(res => {
                console.log(res.data.success)
            })
            window.location.reload()
        
    }

    render() {
        return (
            <div className="ui card" id={this.props.question.id} >
                <div className="content" onClick={this.routeToQuestion}>
                    <div class="right floated meta">{moment(this.props.question.time).format('d MMM')}</div>
                    <div class="left floated meta" onClick={this.routeToAuthor}>{this.props.question.author}</div>
                    <div className="description">
                        <p>{this.props.question.content}</p>
                    </div>
                </div>
                <div className="extra content">
                <div class="ui comments">
                        {this.props.answers.map((item, index) => {
                            return (
                                <div class="comment">
                                    <div class="content">
                                        <a class="author">{item.username}</a>
                                        <div class="metadata">
                                            <span class="date">{moment(item.time).format('d MMM')}</span>
                                        </div>
                                        <div class="text">
                                            {item.content}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                {
                    <form class="ui small form" onSubmit={this.handleSubmit}>
                        <div class="field" value={this.state.newAnswer} onChange={this.handleInputChange}>
                            <label></label>
                            <textarea rows="2" placeholder="your answer"></textarea>
                        </div>
                        <button type="submit" class="ui button" >add</button>
                    </form>
                }
                </div>
            </div >

        );
    }
}

export default GroupQuestion