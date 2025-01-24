// Navbar.js
import React, { useState, useEffect } from "react";
import { Button, Modal } from "semantic-ui-react";
import Axios from "axios";
import moment from "moment";
import { getCurrentUser } from "../login";
import { useLanguage } from "./LanguageContext";
import "./Navbar.css";
import { useFilter } from "./FilterContext"; 
import FilterModal from "./FilterModal";

const activityMessage = {
  answer: "answered your question",
  newGroup: "You are added to ",
  questionInGroup: " posted a question to ",
  answerInGroup: " answered a question in ",
};

const activityLink = {
  answer: "question",
  newGroup: "group",
  questionInGroup: "group",
  answerInGroup: "group",
};

function Navbar() {
  const [user, setUser] = useState("noUser");
  const [activities, setActivities] = useState([]);
  const [checkedForActivities, setCheckedForActivities] = useState(false);
  const [openActivities, setOpenActivities] = useState(false);
  const [notify, setNotify] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const { language, openLanguageModal } = useLanguage();
  const token = localStorage.getItem("token");
  const { chosenFilters } = useFilter();
  const [openFilterModal, setOpenFilterModal] = useState(false);

  useEffect(() => {
    if (!token) return;
    getCurrentUser()
      .then((r) => setUser(r))
      .catch((e) => console.error(e));
  }, [token]);

  useEffect(() => {
    if (!token || checkedForActivities) return;
    Axios.get("/api/useractivities", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        setActivities(res.data);
        setCheckedForActivities(true);
        setNotify(res.data.some((item) => !item.read));
      })
      .catch((error) => console.error(error));
  }, [token, checkedForActivities]);

  function setActivitiesToRead() {
    if (activities.length > 0) {
      Axios.get(`/api/readuseractivity/${activities[0].id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(() => setNotify(false))
        .catch((error) => console.error(error));
    }
  }

  function route(path) {
    window.location.href = `/${path}?lang=${language}`;
  }

  const checkCollapse = () => {
    if (window.innerWidth < 700) {
      setIsCollapsed(true);
    } else {
      setIsCollapsed(false);
      setOpenMenu(false);
    }
  };

  useEffect(() => {
    checkCollapse();
    window.addEventListener("resize", checkCollapse);
    return () => window.removeEventListener("resize", checkCollapse);
  }, []);

  const ActivitiesModal = () => (
    <Modal
      onClose={() => setOpenActivities(false)}
      onOpen={() => setOpenActivities(true)}
      open={openActivities}
    >
      <Modal.Content>
        <Modal.Description>
          {activities.length === 0 ? (
            <div>No activities to show</div>
          ) : (
            <div className="ui feed">
              {activities.map((item) => (
                <div key={item.id} className="summary">
                  <a
                    className="user"
                    href={`/${activityLink[item.type]}/${item.what}`}
                  >
                    {item.fromUid}
                  </a>{" "}
                  {activityMessage[item.type]}
                  {item.type !== "answer" && (
                    <span className="group">{item.what}</span>
                  )}
                  {!item.read && <div style={{ color: "#ffc107" }}>•</div>}
                  <div className="date">{moment.utc(item.time).fromNow()}</div>
                </div>
              ))}
            </div>
          )}
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button
          color="black"
          onClick={() => {
            setOpenActivities(false);
            setActivitiesToRead();
          }}
        >
          OK
        </Button>
      </Modal.Actions>
    </Modal>
  );

  const CollapsedMenu = () => {
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
      <Modal open={openMenu} onClose={() => setOpenMenu(false)} size="tiny">
        <Modal.Content style={menuContainerStyle}>
          <div
            style={menuItemStyle}
            onClick={() => {
              setOpenActivities(true);
              setOpenMenu(false);
            }}
          >
            Notifications{notify ? " (NEW)" : ""}
          </div>
          {token && (
            <div
              style={menuItemStyle}
              onClick={() => {
                route(`user/${user}`);
                setOpenMenu(false);
              }}
            >
              Profile
            </div>
          )}
          <div
            style={menuItemStyle}
            onClick={() => {
              route("random");
              setOpenMenu(false);
            }}
          >
            Random Question
          </div>
          <div
            style={menuItemStyle}
            onClick={() => {
              route("home");
              setOpenMenu(false);
            }}
          >
            All Questions
          </div>
          <div
            style={menuItemStyle}
            onClick={() => {
              setOpenMenu(false);
              setTimeout(() => setOpenFilterModal(true), 0);
            }}
          >
            Filter Questions
          </div>
          <div
            style={menuItemStyle}
            onClick={() => {
              openLanguageModal();
              setOpenMenu(false);
            }}
          >
            Language: {language}
          </div>
          {!token ? (
            <div
              style={menuItemStyle}
              onClick={() => {
                route("login");
                setOpenMenu(false);
              }}
            >
              Login
            </div>
          ) : (
            <div
              style={menuItemStyle}
              onClick={() => {
                route("logout");
                setOpenMenu(false);
              }}
            >
              Logout
            </div>
          )}
          <div
            style={menuItemStyle}
            onClick={() => {
              route("blog");
              setOpenMenu(false);
            }}
          >
            Blog
          </div>
          <div
            style={menuItemStyle}
            onClick={() => {
              route("bug");
              setOpenMenu(false);
            }}
            title="report a bug"
          >
            Report Bug
          </div>
        </Modal.Content>
      </Modal>
    );
  };

  const navbarItems = (
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
        Language: {language}
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

  return (
    <div className="navbar">
      <div className="brand" onClick={() => route("")}>
        Jous
      </div>
      <div className="menu-items">
        <Button
          className="nav-button"
          onClick={() => route("random")}
          title="random questions"
        >
          <i className="random icon" />
        </Button>
        {isCollapsed ? (
          <Button
            className="nav-button"
            title="menu"
            onClick={() => setOpenMenu(true)}
          >
            <i className="bars icon" />
          </Button>
        ) : (
          navbarItems
        )}
      </div>

      <ActivitiesModal />
      <CollapsedMenu />

      <FilterModal
        open={openFilterModal}
        onClose={() => setOpenFilterModal(false)}
        languageId={language}
      />
    </div>
  );
}

export default Navbar;
