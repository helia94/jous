import React, { useEffect } from "react";
import "./SwipePopup.css"; // Add CSS for animations

const SwipePopup = ({ onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 2000); // Close after 3 seconds
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="swipe-popup">
      <div className="finger-icon">
      <i class="hand point up icon"></i>
      </div>
      <p>Swipe right to left</p>
    </div>
  );
};

export default SwipePopup;