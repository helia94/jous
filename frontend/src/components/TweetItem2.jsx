// TweetItem2.js
import React, { Suspense, lazy } from "react";
import ReactGA from "react-ga4";
import Axios from "axios";
import moment from "moment";
import "./TweetItem2.css";
import { getFontForCards } from "./FontUtils";

const ShareModal = lazy(() => import("./ShareModal"));

export default class TweetItem2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      likes: Number(props.likes) || 0,
      showShareModal: false,
    };
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
    }).then(() => window.location.reload());
  };

  likeTweet = (e) => {
    e.stopPropagation();
    Axios.post("/api/likequestion/" + this.props.id, null, {
      headers: { Authorization: "Bearer " + localStorage.getItem("token") },
    }).then((res) => {
      if (res.data.success) {
        this.setState((prev) => ({ likes: prev.likes + 1 }));
      }
    });
  };

  routeToQuestion = () => {
    window.location.href = `/question/${this.props.id}?lang=${this.props.selectedLanguageFrontendCode}`;
  };

  routeToAuthor = (e) => {
    e.stopPropagation();
    window.location.href = `/user/${this.props.author}`;
  };

  toggleShareModal = (e) => {
    e.stopPropagation();
    this.setState((prev) => ({ showShareModal: !prev.showShareModal }));
  };

  copyQuestionContent = () => {
    const content = `${this.props.content}\nMore on https://jous.app`;
    navigator.clipboard.writeText(content)
      .then(() => alert("Copied!"))
      .catch(() => alert("Failed to copy!"));

    ReactGA.event({ category: "share", action: "copy question", label: "copy_button" });
  };

  render() {
    const contentFont = getFontForCards(this.props.content);

    return (
      <>
        <div className="tweet-card-parisian" onClick={this.routeToQuestion}>
          <div className="bg-ornament" />
          <div className="tweet-header-parisian">
            <span className="tweet-time-parisian">
              {moment(this.props.time, "ddd, DD MMM YYYY h:mm:ss").format("DD MMM YYYY")}
            </span>
            <span className="tweet-author-parisian" onClick={this.routeToAuthor}>
              {this.props.author}
            </span>
          </div>
          <div className="tweet-content-parisian">
            <p style={{ fontFamily: contentFont }}>{this.props.content}</p>
          </div>
          <div className="tweet-footer-parisian">
            <div className="parisian-buttons">
              <div className="action-btn" onClick={this.likeTweet}>
                <i className="heart icon"></i><span>{this.state.likes}</span>
              </div>
              <div className="action-btn" onClick={this.routeToQuestion}>
                <i className="reply icon"></i><span>{this.props.answers}</span>
              </div>
              <div className="action-btn" onClick={this.toggleShareModal}>
                <i className="share alternate icon"></i>
              </div>
              <div className="action-btn" onClick={this.copyQuestionContent}>
                <i className="copy icon"></i>
              </div>
              {this.props.isOwner && (
                <div className="action-btn" onClick={this.deleteTweet}>
                  <i className="trash alternate outline icon"></i>
                </div>
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
