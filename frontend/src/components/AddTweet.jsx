// AddTweet.jsx
import React from "react";
import Axios from "axios";
import { getFontClassForCards } from "./FontUtils";
import VoiceTranscribeButton from "./VoiceTranscribeButton";
import { Icon } from "./ui";

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

    appendTranscript = (transcript) => {
        this.setState((prevState) => ({
            content: prevState.content ? `${prevState.content} ${transcript}` : transcript,
            contentErr: "",
            formErr: ""
        }));
    }

    submitForm = (e, anon = this.state.anon) => {
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
            anon
        }, config).then(res => {
            if (res.data.success) {
                this.props.onAdd(this.state.content, anon);
            } else {
                this.setState({ formErr: res.data.error })
            }
        })
    }

    render() {
        const { onClose } = this.props;
    
        return (
          <div className="c-card add-question-card" id="addTweet">
            <div className="add-question-card__close-row">
              <button
                type="button"
                className="add-question-card__close"
                onClick={onClose}
                aria-label="Close add question"
              >
                X
              </button>
            </div>
            <div className="add-question-card__title">
              Add a question
            </div>
            <form className="c-form" onSubmit={this.submitForm} id="submit-form">
              <VoiceTranscribeButton
                onTranscription={this.appendTranscript}
                placeholder="Record your question, then edit before posting."
              />
              <div className="c-field">
                <textarea
                  className={getFontClassForCards(this.state.content)}
                  rows="3"
                  value={this.state.content}
                  onChange={this.handleInputChange}
                />
              </div>
              {this.state.contentErr && <div className="c-form-error">{this.state.contentErr}</div>}
              {this.state.formErr && <div className="c-form-error">{this.state.formErr}</div>}
              <div className="add-question-card__actions">
                {this.state.isLoggedIn && (
                  <button
                    type="button"
                    className="c-button"
                    onClick={(e) => this.submitForm(e, "False")}
                    aria-label="Submit question"
                    title="Submit question"
                  >
                    <Icon name="edit" />
                  </button>
                )}
                <button
                  type="button"
                  className="c-button"
                  onClick={(e) => this.submitForm(e, "True")}
                  aria-label="Submit question anonymously"
                  title="Submit question anonymously"
                >
                  <Icon name="user secret" />
                </button>
              </div>
            </form>
          </div>
        );
      }
    }
    
    export default AddTweet;
