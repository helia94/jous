// src/components/NavbarItems.js
import React from "react";
import { FaBell, FaUser, FaFilter, FaBug } from 'react-icons/fa';

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
        <FaBell color={notify ? "#fbbd08" : undefined} />
      </button>
      {token && (
        <button
          className="nav-button"
          title="profile"
          onClick={() => route(`user/${user}`)}
        >
          <FaUser />
        </button>
      )}
      <button
        className="nav-button"
        onClick={() => setOpenFilterModal(true)}
        title="Filters"
      >
        <FaFilter />
      </button>
      <button className="nav-button" onClick={openLanguageModal}>
        Language
      </button>
      <button className="nav-button" onClick={() => route("blog")}>
        Blog
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
        <FaBug />
      </button>
    </>
  );
}

export default React.memo(NavbarItems);
