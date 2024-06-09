import React from "react";
import Axios from "axios";
import moment from 'moment'

const buttonStyle = {
    boxShadow: 'none', // No shadow by default
    background: 'transparent', // No fill by default
};

const iconStyle = {
    color: 'rgba(0, 0, 0, 0.6)', // Customize color
};

const labelStyle = {
    border: 'none', // No border for the label
    background: 'none', // No background for the label
    paddingLeft: '5px', // Space from the icon
};

class TweetItem2 extends React.Component {
    state = { showGroupNameForm: false, groupName: "", like: 0, mobile: false, minHeight: 200}

    componentDidMount() {
        if (window.innerWidth < 450) {
            this.setState({ mobile: true });
            this.setState({ minHeight: 414 });
        }
    }


    deleteTweet = (e) => {
        Axios.delete("/api/deletequestion/" + this.props.id, { headers: { Authorization: "Bearer " + localStorage.getItem("token") } }).then(res => {
            window.location.reload();
        })
    }

    likeTweet = (e) => {
        Axios.post("/api/likequestion/" + this.props.id, { headers: { Authorization: "Bearer " + localStorage.getItem("token") } }).then(res => {
            if (res.data.success) {
                this.setState({ like: this.state.like += 1 })
            }
        })
    }

    routeToQuestion = (e) => {
        let path = "/question/" + this.props.id;
        window.location.href = path;
    }

    copyQuestionAddressToKeyboard = (e) => {
        let host = window.location.host;
        let path = "https://" + host + "/question/" + this.props.id;
        e.stopPropagation();
        navigator.clipboard.writeText(path);
        // auto closable notification that says copied
        alert("Copied to clipboard");
    }

    routeToAuthor = (e) => {
        e.stopPropagation();
        let path = "/user/" + this.props.author;
        window.location.href = path;
    }


    handleInputChange = (e) => {
        e.preventDefault();
        this.setState({
            groupName: e.target.value
        });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        Axios.post("/api/addquestiontogroup",
            {
                name: this.state.groupName,
                question: this.props.id
            },
            {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            }).then(res => {
                console.log(res.data.success)
            })
        this.setState({
            showGroupNameForm: false
        });
    }

    postToGroupClick = (e) => {
        this.setState({
            showGroupNameForm: !this.state.showGroupNameForm
        });
    }

    render() {
        return (
            <div className="ui fluid card" id={this.props.id} style={{ minHeight: this.state.minHeight }}>
                <div className="content" onClick={this.routeToQuestion} style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'auto' }}>
                        <div class="right floated meta">
                            {moment(this.props.time, 'ddd, DD MMM YYYY h:mm:ss').format('DD MMM YYYY')}
                        </div>
                        <div class="left floated meta" onClick={this.routeToAuthor}>{this.props.author}</div>
                    </div>
                    <div className="center aligned description" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>

                        <p>{this.props.content}</p>
                    </div>
                </div>
                <div className="extra content">
                    <div class="ui mini icon buttons">
                        <div className="ui labeled button" tabIndex="0" data-tooltip="like">
                            <div className="ui icon button circular" onClick={this.likeTweet} style={buttonStyle}
                                onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 0 0 2px #2185D0 inset'}
                                onMouseOut={(e) => e.currentTarget.style.boxShadow = 'none'}>
                                <i className="heart icon" style={iconStyle}></i>
                            </div>
                            <a className="ui basic label" style={labelStyle}>
                                {this.props.likes}
                            </a>
                        </div>
                        <div className="ui labeled button" tabIndex="0" data-tooltip="answer">
                            <div className="ui icon button circular" onClick={this.routeToQuestion} style={buttonStyle}
                                onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 0 0 2px #2185D0 inset'}
                                onMouseOut={(e) => e.currentTarget.style.boxShadow = 'none'}>
                                <i className="reply icon" style={iconStyle}></i>
                            </div>
                            <a className="ui basic label" style={labelStyle}>
                                {this.props.answers}
                            </a>
                        </div>
                        <div className="ui basic button"
                            data-tooltip="share"
                            onClick={this.copyQuestionAddressToKeyboard}>
                            <i class="share alternate icon"></i>
                        </div>
                        {this.props.isLoggedIn &&
                            <div className="ui basic button"
                                data-tooltip="post to group"
                                onClick={this.postToGroupClick}>
                                <i class="share icon"></i>
                            </div>
                        }
                        {this.props.isOwner &&
                            <button className="ui basic button" onClick={this.deleteTweet}><i class="trash alternate outline icon"></i>
                            </button>}
                    </div>
                </div>
                {this.props.isLoggedIn && this.state.showGroupNameForm &&
                    <form class="ui small form" onSubmit={this.handleSubmit}>
                        <div class="field" value={this.state.groupName} onChange={this.handleInputChange}>
                            <label>Group name</label>
                            <input type="text" name="name" placeholder="OlympusJous"></input>
                        </div>
                        <button type="submit" class="ui button">add</button>
                    </form>
                }
            </div >
        );
    }
}

export default TweetItem2