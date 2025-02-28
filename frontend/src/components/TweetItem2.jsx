// TweetItem2.js
import React from "react";
import Axios from "axios";
import moment from "moment";
import "./TweetItem2.css";
import { getFontForCards } from "./FontUtils";
import html2canvas from "html2canvas";

class TweetItem2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      likes: Number(props.likes) || 0,
      mobile: false,
      minHeight: 200,
      showShareModal: false,
    };
    this.cardRef = React.createRef();
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

  copyQuestionAddressToClipboard = () => {
    const host = window.location.host;
    const link = `https://${host}/question/${this.props.id}?lang=${this.props.selectedLanguageFrontendCode}`;
    navigator.clipboard.writeText(link);
    alert("Link copied to clipboard");
  };

  shareToX = () => {
    const text = encodeURIComponent(this.props.content);
    const shareUrl = `https://twitter.com/intent/tweet?text=${text}`;
    window.open(shareUrl, "_blank");
  };

  shareToWhatsApp = () => {
    const text = encodeURIComponent(this.props.content);
    const shareUrl = `https://api.whatsapp.com/send?text=${text}`;
    window.open(shareUrl, "_blank");
  };

  shareToTelegram = () => {
    const text = encodeURIComponent(this.props.content);
    const shareUrl = `https://t.me/share/url?url=${text}`;
    window.open(shareUrl, "_blank");
  };

  shareToInstagram = async () => {
    try {
      const cardElement = this.cardRef.current;
      const canvas = await html2canvas(cardElement);
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = "card.png";
      link.href = dataUrl;
      link.click();
      alert("Screenshot ready for Instagram. Double check if everything looks good.");
    } catch (error) {
      console.error(error);
      alert("Screenshot failed. Double check if you have the right setup.");
    }
  };

  render() {
    const contentFont = getFontForCards(this.props.content);
    const cardStyle = { minHeight: this.state.minHeight };
    const buttonStyle = { boxShadow: "none", background: "transparent" };
    const iconStyle = { color: "rgba(0, 0, 0, 0.6)" };
    const labelStyle = { border: "none", background: "none", paddingLeft: "5px" };

    return (
      <>
        <div className="ui fluid card" id={this.props.id} style={cardStyle} ref={this.cardRef}>
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
              <div className="ui labeled button" tabIndex="0" data-tooltip="answer">
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
              <div className="ui basic button" data-tooltip="share" onClick={this.toggleShareModal}>
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
        {this.state.showShareModal && (
          <div className="ui dimmer modals visible active" onClick={this.toggleShareModal}>
            <div
              className="ui standard modal visible active"
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: "400px", margin: "auto" }}
            >
              <div className="header">Share This Question</div>
              <div className="content" style={{ textAlign: "center" }}>
                <button className="ui button" onClick={this.copyQuestionAddressToClipboard}>
                  Copy Link
                </button>
                <button className="ui button" onClick={this.shareToInstagram}>
                  Instagram (screenshot)
                </button>
                <button className="ui button" onClick={this.shareToX}>
                  X
                </button>
                <button className="ui button" onClick={this.shareToTelegram}>
                  Telegram
                </button>
                <button className="ui button" onClick={this.shareToWhatsApp}>
                  WhatsApp
                </button>
              </div>
              <div className="actions">
                <div className="ui button" onClick={this.toggleShareModal}>
                  Close
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }
}

export default TweetItem2;
