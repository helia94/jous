// TweetItem2.js
import React from "react";
import Axios from "axios";
import moment from "moment";
import "./TweetItem2.css";
import { LanguageContext } from "./LanguageContext"; 

// Simple helper to detect Persian characters
function isPersian(text) {
  return /[\u0600-\u06FF]/.test(text);
}

class TweetItem2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      likes: Number(props.likes) || 0,
      mobile: false,
      minHeight: 200,
      language_id: props.language_id
    };
  }
  
  static contextType = LanguageContext;
  

  componentDidMount() {
    if (window.innerWidth < 450) {
      this.setState({ mobile: true, minHeight: 414 });
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.likes !== this.props.likes) {
      this.setState({ likes: Number(this.props.likes) });
    }
  }

  deleteTweet = (e) => {
    e.stopPropagation();
    Axios.delete("/api/deletequestion/" + this.props.id, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    }).then(() => {
      window.location.reload();
    });
  };

  likeTweet = (e) => {
    e.stopPropagation();
    Axios.post("/api/likequestion/" + this.props.id, null, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    }).then((res) => {
      if (res.data.success) {
        this.setState((prevState) => ({ likes: prevState.likes + 1 }));
      }
    });
  };

  routeToQuestion = () => {
    const path = `/question/${this.props.id}?lang=${this.state.language_id}`;
    window.location.href = path;
  };

  copyQuestionAddressToKeyboard = (e) => {
    e.stopPropagation();
    const host = window.location.host;
    const path = `https://${host}/question/${this.props.id}?lang=${this.state.language_id}`;
    navigator.clipboard.writeText(path);
    alert("Copied to clipboard");
  };

  routeToAuthor = (e) => {
    e.stopPropagation();
    const path = "/user/" + this.props.author;
    window.location.href = path;
  };

  render() {
    // Choose fonts conditionally
    const contentFont = isPersian(this.props.content) ? "Vazirmatn RD" : "Montserrat";

    const cardStyle = {
      minHeight: this.state.minHeight,
    };

    const buttonStyle = {
      boxShadow: "none",
      background: "transparent",
    };

    const iconStyle = {
      color: "rgba(0, 0, 0, 0.6)",
    };

    const labelStyle = {
      border: "none",
      background: "none",
      paddingLeft: "5px",
    };

    return (
      <div className="ui fluid card" id={this.props.id} style={cardStyle}>
        <div
          className="content"
          onClick={this.routeToQuestion}
          style={{ display: "flex", flexDirection: "column", height: "100%" }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "auto",
            }}
          >
            <div className="right floated meta">
              {moment(this.props.time, "ddd, DD MMM YYYY h:mm:ss").format(
                "DD MMM YYYY"
              )}
            </div>
            <div className="left floated meta" onClick={this.routeToAuthor}>
              {this.props.author}
            </div>
          </div>
          <div
            className="center aligned description"
            style={{
              flexGrow: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <p style={{ fontFamily: contentFont }}>{this.props.content}</p>
          </div>
        </div>
        <div className="extra content">
          <div className="ui mini icon buttons">
            <div className="ui labeled button" tabIndex="0" data-tooltip="like">
              <div
                className="ui icon button circular"
                onClick={this.likeTweet}
                style={buttonStyle}
                onMouseOver={(e) =>
                  (e.currentTarget.style.boxShadow = "0 0 0 2px #2185D0 inset")
                }
                onMouseOut={(e) => (e.currentTarget.style.boxShadow = "none")}
              >
                <i className="heart icon" style={iconStyle}></i>
              </div>
              <a className="ui basic label" style={labelStyle}>
                {this.state.likes}
              </a>
            </div>
            <div
              className="ui labeled button"
              tabIndex="0"
              data-tooltip="answer"
            >
              <div
                className="ui icon button circular"
                onClick={this.routeToQuestion}
                style={buttonStyle}
                onMouseOver={(e) =>
                  (e.currentTarget.style.boxShadow = "0 0 0 2px #2185D0 inset")
                }
                onMouseOut={(e) => (e.currentTarget.style.boxShadow = "none")}
              >
                <i className="reply icon" style={iconStyle}></i>
              </div>
              <a className="ui basic label" style={labelStyle}>
                {this.props.answers}
              </a>
            </div>
            <div
              className="ui basic button"
              data-tooltip="share"
              onClick={this.copyQuestionAddressToKeyboard}
            >
              <i className="share alternate icon"></i>
            </div>
            {this.props.isOwner && (
              <button className="ui basic button" onClick={this.deleteTweet}>
                <i className="trash alternate outline icon"></i>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default TweetItem2;
