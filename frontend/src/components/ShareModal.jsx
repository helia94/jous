// ShareModal.js
import React from "react";
import ReactGA from 'react-ga4';

const ShareModal = ({ content, id, selectedLanguageFrontendCode, onClose }) => {
  const copyQuestionAddressToClipboard = () => {
    const host = window.location.host;
    const link = `https://${host}/question/${id}?lang=${selectedLanguageFrontendCode}`;
    navigator.clipboard.writeText(link);
    alert("Link copied to clipboard");
  };

  const shareToX = () => {
    const text = encodeURIComponent(content + " \nby jous.app");
    const shareUrl = `https://twitter.com/intent/tweet?text=${text}`;
    window.open(shareUrl, "_blank");
    
        ReactGA.event({
          category: 'share',
          action: 'x',
          label: "x",
        });
  };

  const shareToWhatsApp = () => {
    const text = encodeURIComponent(content + " \nby jous.app");
    const shareUrl = `https://api.whatsapp.com/send?text=${text}`;
    window.open(shareUrl, "_blank");
    
    ReactGA.event({
      category: 'share',
      action: 'WhatsApp',
      label: "WhatsApp",
    });
  };

  const shareToTelegram = () => {
    const text = encodeURIComponent(content + " \nby jous.app");
    const shareUrl = `https://t.me/share/url?url=${text}`;
    window.open(shareUrl, "_blank");
    
    ReactGA.event({
      category: 'share',
      action: 'Telegram',
      label: "Telegram",
    });
  };

  const shareToInstagram = async () => {
    try {
        const canvas = document.createElement("canvas");
        canvas.width = 1080;
        canvas.height = 1080;

        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#ff6600";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#ffffff";
        ctx.font = "80px Georgia";
        ctx.textAlign = "center";
        ctx.textBaseline = "top";

        const maxWidth = canvas.width * 0.8;
        const xCenter = canvas.width / 2;
        const lineHeight = 80;
        const words = content.split(" ");
        const wrappedLines = [];
        let tempLine = "";

        words.forEach((word, idx) => {
            const testLine = tempLine + word + " ";
            const metrics = ctx.measureText(testLine);
            if (metrics.width > maxWidth && idx > 0) {
                wrappedLines.push(tempLine.trim());
                tempLine = word + " ";
            } else {
                tempLine = testLine;
            }
        });
        wrappedLines.push(tempLine.trim());

        const totalHeight = wrappedLines.length * lineHeight;
        let startY = (canvas.height - totalHeight) / 2;

        wrappedLines.forEach((ln) => {
            ctx.fillText(ln, xCenter, startY, maxWidth);
            startY += lineHeight;
        });

        // Load the logo image
        const logo = new Image();
        logo.src = "/favicon.ico"; // Adjust the path if necessary

        // Wait for the logo to load
        await new Promise((resolve) => {
            logo.onload = resolve;
        });

        // Draw the logo in the bottom right corner
        const logoSize = 300; // Adjust the size of the logo as needed
        const logoX = canvas.width - logoSize - 20; // 20 pixels from the right edge
        const logoY = canvas.height - logoSize - 20; // 20 pixels from the bottom edge
        ctx.drawImage(logo, logoX, logoY, logoSize, logoSize);

        const dataUrl = canvas.toDataURL("image/png");
        const res = await fetch(dataUrl);
        const blob = await res.blob();
        const file = new File([blob], "instagram.png", { type: "image/png" });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({
                files: [file],
                title: "Instagram Post",
                text: "Check out this question",
            });
        } else {
            const newTab = window.open();
            newTab.document.write(`<img src="${dataUrl}" style="max-width:100%" />`);
            newTab.document.title = "Instagram Card";
            window.open("instagram://camera", "_blank");
        }
    } catch (error) {
        alert("Could not share to Instagram, double check your browser/device.");
    }
    
    ReactGA.event({
      category: 'share',
      action: 'Instagram',
      label: "Instagram",
    });
};

return (
  <div className="c-modal" onClick={onClose}>
    <div
      className="c-modal-content"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="c-modal-header">Share This Question</div>
      <div style={{ textAlign: "center", marginBottom: "1rem" }}>
        <button className="c-button" onClick={copyQuestionAddressToClipboard}>
          Copy Link
        </button>
        <button className="c-button" onClick={shareToInstagram}>
          Instagram
        </button>
        <button className="c-button" onClick={shareToX}>
          X
        </button>
        <button className="c-button" onClick={shareToTelegram}>
          Telegram
        </button>
        <button className="c-button" onClick={shareToWhatsApp}>
          WhatsApp
        </button>
      </div>
      <div style={{ textAlign: "center" }}>
        <button className="c-button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  </div>
);
};

export default ShareModal;