import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Icon from "./Icon";

const focusableSelector =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

function Modal({
  open,
  onClose,
  closeIcon = false,
  size = "medium",
  className = "",
  style,
  centered = true,
  children,
}) {
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const previousActive = document.activeElement;
    window.setTimeout(() => {
      const focusable = panelRef.current?.querySelector(focusableSelector);
      (focusable || panelRef.current)?.focus();
    }, 0);

    return () => {
      document.body.style.overflow = previousOverflow;
      if (previousActive && typeof previousActive.focus === "function") {
        previousActive.focus();
      }
    };
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose?.();
        return;
      }

      if (event.key !== "Tab" || !panelRef.current) return;
      const focusable = Array.from(panelRef.current.querySelectorAll(focusableSelector));
      if (focusable.length === 0) {
        event.preventDefault();
        panelRef.current.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose, open]);

  if (!open) return null;

  const classes = [
    "jb-modal",
    `jb-modal--${size}`,
    centered ? "jb-modal--centered" : "jb-modal--top",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return createPortal(
    <div
      className={`jb-modal-dimmer ${centered ? "jb-modal-dimmer--centered" : "jb-modal-dimmer--top"}`}
      onMouseDown={onClose}
    >
      <div
        ref={panelRef}
        className={classes}
        style={style}
        role="dialog"
        aria-modal="true"
        tabIndex="-1"
        onMouseDown={(event) => event.stopPropagation()}
      >
        {closeIcon && (
          <button className="jb-modal-close" type="button" onClick={onClose} aria-label="Close">
            <Icon name="close" />
          </button>
        )}
        {children}
      </div>
    </div>,
    document.body
  );
}

Modal.Header = function ModalHeader({ children, className = "", ...props }) {
  return (
    <div className={`jb-modal-header ${className}`.trim()} {...props}>
      {children}
    </div>
  );
};

Modal.Content = function ModalContent({ children, scrolling = false, className = "", ...props }) {
  const classes = ["jb-modal-content", scrolling ? "jb-modal-content--scrolling" : "", className]
    .filter(Boolean)
    .join(" ");
  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

Modal.Description = function ModalDescription({ children, className = "", ...props }) {
  return (
    <div className={`jb-modal-description ${className}`.trim()} {...props}>
      {children}
    </div>
  );
};

Modal.Actions = function ModalActions({ children, className = "", ...props }) {
  return (
    <div className={`jb-modal-actions ${className}`.trim()} {...props}>
      {children}
    </div>
  );
};

export default Modal;
