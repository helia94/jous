// TweetItem2.js
import React from "react";
import Axios from "axios";
import moment from "moment";
import "./TweetItem2.css";
import { getFontForCards } from "./FontUtils";

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
      const canvas = document.createElement("canvas");
      canvas.width = 1080;
      canvas.height = 1080;

      const ctx = canvas.getContext("2d");
      // Bright orange background
      ctx.fillStyle = "#ff6600";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // White text, Georgia font, centered
      ctx.fillStyle = "#ffffff";
      ctx.font = "80px Georgia";
      ctx.textAlign = "center";
      ctx.textBaseline = "top";

      // We will wrap text if it doesn't fit in 80% width
      const maxWidth     = canvas.width * 0.8;
      const xCenter      = canvas.width / 2;
      const lineHeight   = 80;
      const words        = this.props.content.split(" ");
      const wrappedLines = [];
      let tempLine       = "";
      
      // First pass: split into an array of wrapped lines
      words.forEach((word, idx) => {
        const testLine = tempLine + word + " ";
        const metrics  = ctx.measureText(testLine);
        if (metrics.width > maxWidth && idx > 0) {
          wrappedLines.push(tempLine.trim());
          tempLine = word + " ";
        } else {
          tempLine = testLine;
        }
      });
      // Push final line
      wrappedLines.push(tempLine.trim());
      
      // Now calculate total height for vertical centering
      const totalHeight = wrappedLines.length * lineHeight;
      let startY        = (canvas.height - totalHeight) / 2; // center vertically
      
      wrappedLines.forEach((ln) => {
        ctx.fillText(ln, xCenter, startY, maxWidth);
        startY += lineHeight;
      });

      // Turn canvas into file
      const dataUrl = canvas.toDataURL("image/png");
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const file = new File([blob], "instagram.png", { type: "image/png" });

      // Native share if supported
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "Instagram Post",
          text: "Check out this question",
        });
      } else {
        // Fallback: open image in new tab + try opening Instagram
        const newTab = window.open();
        newTab.document.write(`<img src="${dataUrl}" style="max-width:100%" />`);
        newTab.document.title = "Instagram Card";
        window.open("instagram://camera", "_blank");
      }
    } catch (error) {
      alert("Could not share to Instagram, double check your browser/device.");
    }
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
          <div className="ui dimmer modals visible active" onClick={this.toggleShareModal}>
            <div
              className="ui standard modal visible active"
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: "400px", margin: "auto" }}
            >
              <div className="header">Share This Question</div>
              <div className="content share-modal" style={{ textAlign: "center" }}>
                <button className="ui button " onClick={this.copyQuestionAddressToClipboard}>
                  Copy Link
                </button>
                <button className="ui button" onClick={this.shareToInstagram}>
                  Instagram
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
