// src/components/CollapsedMenu.js
import React from "react";
import { Modal } from "semantic-ui-react";

function CollapsedMenu({
  open,
  onClose,
  setOpenActivities,
  route,
  user,
  token,
  notify,
  language,
  openLanguageModal,
  setOpenFilterModal,
}) {
  const menuContainerStyle = {
    backgroundColor: "#fff",
    padding: "1rem",
    fontFamily: "Helvetica, Arial, sans-serif",
  };

  const menuItemStyle = {
    margin: "0.5rem 0",
    fontSize: "1em",
    fontWeight: "600",
    color: "#333",
    cursor: "pointer",
    borderBottom: "1px solid #ddd",
    paddingBottom: "0.5rem",
  };

  return (
    <Modal open={open} onClose={onClose} size="tiny">
      <Modal.Content style={menuContainerStyle}>
        <div
          style={menuItemStyle}
          onClick={() => {
            setOpenActivities(true);
            onClose();
          }}
        >
          Notifications{notify ? " (NEW)" : ""}
        </div>
        {token && (
          <div
            style={menuItemStyle}
            onClick={() => {
              route(`user/${user}`);
              onClose();
            }}
          >
            Profile
          </div>
        )}
        <div
          style={menuItemStyle}
          onClick={() => {
            route("random");
            onClose();
          }}
        >
          Random Question
        </div>
        <div
          style={menuItemStyle}
          onClick={() => {
            route("home");
            onClose();
          }}
        >
          All Questions
        </div>
        <div
          style={menuItemStyle}
          onClick={() => {
            onClose();
            setOpenFilterModal(true);
          }}
        >
          Filter Questions
        </div>
        <div
          style={menuItemStyle}
          onClick={() => {
            openLanguageModal();
            onClose();
          }}
        >
          Language: {language}
        </div>
        {!token ? (
          <div
            style={menuItemStyle}
            onClick={() => {
              route("login");
              onClose();
            }}
          >
            Login
          </div>
        ) : (
          <div
            style={menuItemStyle}
            onClick={() => {
              route("logout");
              onClose();
            }}
          >
            Logout
          </div>
        )}
        <div
          style={menuItemStyle}
          onClick={() => {
            route("blog");
            onClose();
          }}
        >
          Blog
        </div>
        <div
          style={menuItemStyle}
          onClick={() => {
            route("bug");
            onClose();
          }}
          title="report a bug"
        >
          Report Bug
        </div>
      </Modal.Content>
    </Modal>
  );
}

export default React.memo(CollapsedMenu);
