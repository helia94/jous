import React from "react";
import {Editor} from "@tinymce/tinymce-react/lib/cjs/main/ts";
import Axios from "axios";
import Alert from "./Alert";

class AddTweet extends React.Component {
    state = {content: "<p>I have to edit this!</p>", titleErr: "", contentErr: "", formErr: ""}

    handleEditorChange = (content, editor) => {
        this.setState({content})
    }

    submitForm = (e) => {
        e.preventDefault()
        if (this.state.content.length === 0) {
            this.setState(
                {contentErr: "Add some data to the content!"}
            )
            return;
        }
        if (document.getElementById("title").value.length === 0) {
            this.setState(
                {titleErr: "Add a title!"}
            )
            return;
        }
        console.log("will try to add your tweet")
        Axios.post("/api/addquestion", {
            content: this.state.content
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
                        {formErr: res.data.error }
                    )
            }
        })
    }

    render() {
        return (<div className="w3-modal w3-animate-opacity" id="addTweet">
            <div className="w3-modal-content w3-card">
                <header className="w3-container w3-blue">
                <span className="w3-button w3-display-topright w3-hover-none w3-hover-text-white" onClick={() => {
                    document.getElementById("addTweet").style.display = "none"
                }}>X</span>
                    <h2>Add question</h2>
                </header>
                <form className="w3-container" onSubmit={this.submitForm}>
                    {this.state.formErr.length > 0 && <Alert message={this.state.formErr}/>}
                    <div className="w3-section">
                        <p>
                            <label htmlFor="title">Title</label>
                            <input type="text" id="title" className="w3-input w3-border w3-margin-bottom"/>
                            <small className="w3-text-gray">{this.state.titleErr}</small>
                        </p>
                        <p>
                            <Editor
                                initialValue=""
                                init={{
                                    height: 300,
                                    menubar: false,
                                    statusbar: false,
                                    toolbar_mode: "sliding",
                                }}
                                onEditorChange={this.handleEditorChange}
                            />
                            <small className="w3-text-gray">{this.state.contentErr}</small>
                        </p>

                        <p>
                            <button type="submit" className="w3-button w3-blue">Post</button>
                        </p>
                    </div>
                </form>
            </div>
        </div>)
    }
}

export default AddTweet