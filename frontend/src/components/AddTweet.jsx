// AddTweet.jsx
import React from "react";
import Axios from "axios";
import { getFontClassForCards } from "./FontUtils";

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
          <div className="c-card" id="addTweet">
            <div style={{ textAlign: "right" }}>
              <span 
                style={{ cursor: "pointer", fontWeight: "bold" }}
                onClick={onClose}
              >
                X
              </span>
            </div>
            <div style={{ fontFamily: "Limelight", fontSize: "1.2rem", marginBottom: "1rem" }}>
              Add a question
            </div>
            <form className="c-form" onSubmit={this.submitForm} id="submit-form">
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
              <div>
                {this.state.isLoggedIn && (
                  <button
                    type="submit"
                    className="c-button"
                    onClick={() => this.setState({ anon: "False" })}
                  >
                    <i className="icon edit"></i>
                  </button>
                )}
                <button
                  type="submit"
                  className="c-button"
                  onClick={() => this.setState({ anon: "True" })}
                >
                  <i className="user secret icon"></i>
                </button>
              </div>
            </form>
          </div>
        );
      }
    }
    
    export default AddTweet;
