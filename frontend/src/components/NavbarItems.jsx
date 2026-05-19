// src/components/NavbarItems.js
import React from "react";
import { Icon } from "./ui";

function NavbarItems({
  notify,
  token,
  route,
  user,
  openLanguageModal,
  setOpenFilterModal,
  setOpenActivities,
}) {
  return (
    <>
      <button
        className="nav-button"
        title="notifications"
        onClick={() => setOpenActivities(true)}
      >
        <Icon name="lemon" color={notify ? "yellow" : undefined} outline={!notify} />
      </button>
      {token && (
        <button
          className="nav-button"
          title="profile"
          onClick={() => route(`user/${user}`)}
        >
          <Icon name="user" outline />
        </button>
      )}
      <button
        className="nav-button"
        onClick={() => setOpenFilterModal(true)}
        title="Filters"
      >
        <Icon name="filter" />
      </button>
      <button className="nav-button" onClick={openLanguageModal} title="Language">
        <Icon name="language" />
      </button>
      <button className="nav-button" onClick={() => route("blog")}>
        Blog
      </button>
      <button className="nav-button" onClick={() => route("conversation-cards")}>
        Cards
      </button>
      {!token ? (
        <button className="nav-button" onClick={() => route("login")}>
          Login
        </button>
      ) : (
        <button className="nav-button" onClick={() => route("logout")}>
          Logout
        </button>
      )}
      <button className="nav-button" onClick={() => route("bug")}>
        <Icon name="bug" />
      </button>
    </>
  );
}

export default React.memo(NavbarItems);
