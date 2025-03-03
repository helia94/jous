// TweetItem2.js
import React, { Suspense, lazy } from "react";
import ReactGA from 'react-ga4';
import Axios from "axios";
import moment from "moment";
import "./TweetItem2.css";
import { getFontForCards } from "./FontUtils";

const ShareModal = lazy(() => import("./ShareModal"));

class TweetItem2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      likes: Number(props.likes) || 0,
      mobile: false,
      minHeight: 200,
      showShareModal: false,
    };
  }

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
      headers: { Authorization: "Bearer " + localStorage.getItem("token") },
    }).then(() => {
      window.location.reload();
    });
  };

  likeTweet = (e) => {
    e.stopPropagation();
    Axios.post("/api/likequestion/" + this.props.id, null, {
      headers: { Authorization: "Bearer " + localStorage.getItem("token") },
    }).then((res) => {
      if (res.data.success) {
        this.setState((prevState) => ({ likes: prevState.likes + 1 }));
      }
    });
  };

  routeToQuestion = () => {
    const path = `/question/${this.props.id}?lang=${this.props.selectedLanguageFrontendCode}`;
    window.location.href = path;
  };

  routeToAuthor = (e) => {
    e.stopPropagation();
    const path = "/user/" + this.props.author;
    window.location.href = path;
  };

  toggleShareModal = (e) => {
    e.stopPropagation();
    this.setState({ showShareModal: !this.state.showShareModal });
  };

  copyQuestionContent = () => {
    const contentToCopy = `${this.props.content}\nMore on https://jous.app`;
    navigator.clipboard.writeText(contentToCopy)
      .then(() => {
        alert("Content copied to clipboard!");
      })
      .catch(() => {
        alert("Failed to copy content to clipboard.");
      });

    ReactGA.event({
      category: 'share',
      action: 'copy question',
      label: "copy_button",
    });
  };

  render() {
    const contentFont = getFontForCards(this.props.content);
    const cardStyle = { minHeight: this.state.minHeight };
    const buttonStyle = { boxShadow: "none", background: "transparent" };
    const iconStyle = { color: "rgba(0, 0, 0, 0.6)" };
    const labelStyle = { border: "none", background: "none", paddingLeft: "5px" };

    return (
      <>
        <div className="ui fluid card" id={this.props.id} style={cardStyle}>
          <div
            className="content"
            onClick={this.routeToQuestion}
            style={{ display: "flex", flexDirection: "column", height: "100%" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "auto" }}>
              <div className="right floated meta">
                {moment(this.props.time, "ddd, DD MMM YYYY h:mm:ss").format("DD MMM YYYY")}
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
                  onMouseOver={(e) => (e.currentTarget.style.boxShadow = "0 0 0 2px #ffff inset")}
                  onMouseOut={(e) => (e.currentTarget.style.boxShadow = "none")}
                >
                  <i className="heart icon" style={iconStyle}></i>
                </div>
                <a className="ui basic label" style={labelStyle}>
                  {this.state.likes}
                </a>
              </div>
              <div className="ui labeled button" tabIndex="0" data-tooltip="answer">
                <div
                  className="ui icon button circular"
                  onClick={this.routeToQuestion}
                  style={buttonStyle}
                  onMouseOver={(e) => (e.currentTarget.style.boxShadow = "0 0 0 2px #ffff inset")}
                  onMouseOut={(e) => (e.currentTarget.style.boxShadow = "none")}
                >
                  <i className="reply icon" style={iconStyle}></i>
                </div>
                <a className="ui basic label" style={labelStyle}>
                  {this.props.answers}
                </a>
              </div>
              <div className="ui basic button" data-tooltip="share" onClick={this.toggleShareModal}>
                <i className="share alternate icon"></i>
              </div>
              <div className="ui labeled button" tabIndex="0" data-tooltip="copy">
                <div
                  className="ui icon button circular"
                  onClick={this.copyQuestionContent}
                  style={buttonStyle}
                  onMouseOver={(e) => (e.currentTarget.style.boxShadow = "0 0 0 2px #ffff inset")}
                  onMouseOut={(e) => (e.currentTarget.style.boxShadow = "none")}
                >
                  <i className="copy icon" style={iconStyle}></i>
                </div>
                <a className="ui basic label" style={labelStyle}>
                </a>
              </div>
              {this.props.isOwner && (
                <button className="ui basic button" onClick={this.deleteTweet}>
                  <i className="trash alternate outline icon"></i>
                </button>
              )}
            </div>
          </div>
        </div>
        {this.state.showShareModal && (
          <Suspense fallback={<div>Loading...</div>}>
            <ShareModal
              content={this.props.content}
              id={this.props.id}
              selectedLanguageFrontendCode={this.props.selectedLanguageFrontendCode}
              onClose={this.toggleShareModal}
            />
          </Suspense>
        )}
      </>
    );
  }
}

export default TweetItem2;