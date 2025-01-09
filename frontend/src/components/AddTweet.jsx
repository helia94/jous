// AddTweet.jsx
import React from "react";
import Axios from "axios";

class AddTweet extends React.Component {
    state = { 
        content: "", 
        titleErr: "", 
        contentErr: "", 
        formErr: "", 
        anon: "False", 
        isLoggedIn: false 
    }

    componentDidMount() {
        const token = localStorage.getItem("token");
        if (token) {
            Axios.get("/api/getcurrentuser", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then(res => {
                if (res.status === 200) {
                    this.setState({ isLoggedIn: true })
                }
            }).catch(() => {})
        }
    }

    handleInputChange = (e) => {
        this.setState({
            content: e.target.value
        });
    }

    submitForm = (e) => {
        e.preventDefault()
        if (this.state.content.trim().length === 0) {
            this.setState({ contentErr: "Add some data to the content!" })
            return;
        }
        const config = {};
        
        if (this.state.isLoggedIn) {
            config.headers = {
                'Authorization': "Bearer " + localStorage.getItem("token")
            };
        }
        Axios.post("/api/addquestion", {
            content: this.state.content,
            anon: this.state.anon
        }, config).then(res => {
            if (res.data.success) {
                this.props.onAdd(this.state.content, this.state.anon);
            } else {
                this.setState({ formErr: res.data.error })
            }
        })
    }

    render() {
        const { onClose } = this.props;
        
        return (
            <div className="ui fluid card" id="addTweet">
                <div className="extra content">
                    <div className="right floated meta">
                        <span 
                            className="w3-button w3-display-topright w3-hover-none w3-hover-text-white" 
                            onClick={onClose}
                        >
                            X
                        </span>
                    </div>
                    <div className="left floated meta">
                        Add a question
                    </div>
                    <p></p>
                    <form className="ui form" onSubmit={this.submitForm} id="submit-form">
                        <div className="field">
                            <textarea 
                                rows="3" 
                                value={this.state.content} 
                                onChange={this.handleInputChange}
                            ></textarea>
                        </div>
                        {this.state.contentErr && <div className="ui pointing red basic label">{this.state.contentErr}</div>}
                        {this.state.formErr && <div className="ui pointing red basic label">{this.state.formErr}</div>}
                        <div className="ui mini buttons">
                            {this.state.isLoggedIn && 
                                <button 
                                    type="submit" 
                                    className="ui black submit icon button" 
                                    onClick={() => this.setState({ anon: 'False' })}
                                >
                                    <i className="icon edit"></i>
                                </button>
                            }
                            <button 
                                type="submit" 
                                className="ui black submit icon button" 
                                onClick={() => this.setState({ anon: 'True' })}
                            >
                                <i className="user secret icon"></i>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}

export default AddTweet;
