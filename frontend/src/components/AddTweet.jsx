import React from "react";
import Axios from "axios";

class AddTweet extends React.Component {
    state = { content: "", titleErr: "", contentErr: "", formErr: "", anon: "False" }

    handleInputChange = (e) => {
        e.preventDefault();
        this.setState({
            content: e.target.value
        });
    }

    submitForm = (e) => {
        e.preventDefault()
        if (this.state.content.length === 0) {
            this.setState(
                { contentErr: "Add some data to the content!" }
            )
            return;
        }
        console.log("will try to add your tweet")
        Axios.post("/api/addquestion", {
            content: this.state.content,
            anon: this.state.anon
        }, {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
            }
        }).then(res => {
            if (res.data.success) {
                window.location.reload()
                console.log("added tweet")
            } else {
                console.log(res.data.error)
                this.setState(
                    { formErr: res.data.error }
                )
            }
        })
    }

    render() {
        return (
            <div class="ui fluid card" id="addTweet">
                <div className="extra content">
                    <div class="right floated meta">
                        <span className="w3-button w3-display-topright w3-hover-none w3-hover-text-white" onClick={() => {
                            document.getElementById("addTweet").style.display = "none"
                        }}>X</span></div>
                    <div class="left floated meta" >
                            Add a question
                    </div>
                    <p></p>
                    <form class="ui form" onSubmit={this.submitForm} id="submit-form">
                        <div class="field" value={this.state.content} onChange={this.handleInputChange}>
                            <textarea rows="3"></textarea>
                        </div>
                        <div class="ui mini buttons">
                            <button type="submit" class="ui olive  submit icon button" value="post" onClick={() => (this.setState({ anon: 'False' }))}><i class="icon edit"></i></button>
                            <button type="submit" class="ui olive  submit icon button" onClick={() => (this.setState({ anon: 'True' }))}><i class="user secret icon"></i></button>
                        </div>
                    </form>
                </div>
            </div>

        )
    }
}

export default AddTweet