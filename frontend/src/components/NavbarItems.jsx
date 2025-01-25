// src/components/NavbarItems.js
import React, { useEffect, useState } from "react";
import { Button } from "semantic-ui-react";

function NavbarItems({
  notify,
  token,
  route,
  user,
  openLanguageModal,
  setOpenFilterModal,
  setOpenActivities,
}) {
  const [Icon, setIcon] = useState(null);

  useEffect(() => {
    if (!Icon) {
      import("semantic-ui-react/dist/commonjs/elements/Icon/Icon").then((module) =>
        setIcon(() => module.default)
      );
    }
  }, [Icon]);

  if (!Icon) {
    return null; // Or a loader/spinner
  }

  return (
    <>
      <Button
        className="nav-button"
        title="notifications"
        onClick={() => setOpenActivities(true)}
      >
        <i className={`lemon ${notify ? "yellow" : "outline"} icon`} />
      </Button>
      {token && (
        <Button
          className="nav-button"
          title="profile"
          onClick={() => route(`user/${user}`)}
        >
          <i className="user outline icon" />
        </Button>
      )}
      <Button
        className="nav-button"
        onClick={() => setOpenFilterModal(true)}
        title="Filters"
      >
        <i className="filter icon" />
      </Button>
      <Button className="nav-button" onClick={openLanguageModal}>
        Language
      </Button>
      <Button className="nav-button" onClick={() => route("blog")}>
        Blog
      </Button>
      {!token ? (
        <Button className="nav-button" onClick={() => route("login")}>
          Login
        </Button>
      ) : (
        <Button className="nav-button" onClick={() => route("logout")}>
          Logout
        </Button>
      )}
      <Button className="nav-button" onClick={() => route("bug")}>
        <i className="bug icon" />
      </Button>
    </>
  );
}

export default React.memo(NavbarItems);
