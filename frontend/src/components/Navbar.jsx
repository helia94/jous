// Navbar.js
import React, { useState, useEffect } from "react";
import { Button, Modal } from 'semantic-ui-react';
import Axios from "axios";
import moment from 'moment';
import { getCurrentUser } from "../login";
import { useLanguage } from './LanguageContext';
import './Navbar.css';

const activityMessage = {
  answer: "answered your question",
  newGroup: "You are added to ",
  questionInGroup: " posted a question to ",
  answerInGroup: " answered a question in "
};

const activityLink = {
  answer: "question",
  newGroup: "group",
  questionInGroup: "group",
  answerInGroup: "group"
};

function Navbar() {
  const [user, setUser] = useState("noUser");
  const [activities, setActivities] = useState([]);
  const [checkedForActivities, setCheckedForActivities] = useState(false);
  const [open, setOpen] = useState(false);
  const [notify, setNotify] = useState(false);

  const { language, openLanguageModal } = useLanguage();
  const token = localStorage.getItem("token");

  // Get current user
  useEffect(() => {
    if (!token) return;
    getCurrentUser()
      .then(r => setUser(r))
      .catch(e => console.error(e));
  }, [token]);

  // Fetch user activities
  useEffect(() => {
    if (!token || checkedForActivities) return;
    Axios.get("/api/useractivities", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setActivities(res.data);
        setCheckedForActivities(true);
        setNotify(res.data.some(item => !item.read));
      })
      .catch(error => console.error(error));
  }, [token, checkedForActivities]);

  function setActivitiesToRead() {
    if (activities.length > 0) {
      Axios.get(`/api/readuseractivity/${activities[0].id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(() => setNotify(false))
        .catch(error => console.error(error));
    }
  }

  // Generic router with lang
  function route(path) {
    window.location.href = `/${path}?lang=${language}`;
  }

  return (
    <div className="ui menu yellow">
      <a className="item ui basic button no-border" href={`/?lang=${language}`}>
        Jous
      </a>
      <div className="right menu">
        <div className="ui buttons">

          {/* Random */}
          <button className="ui basic button" title="random questions" onClick={() => route("random")}>
            <i className="random icon" />
          </button>

          {/* Activities */}
          <Modal
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
            open={open}
            trigger={
              <div className="ui basic button" title="notifications" >
                <span className="modal-btn">
                  <i className={`lemon ${notify ? "yellow" : "outline"} icon`} />
                </span>
              </div>
            }
          >
            <Modal.Content>
              <Modal.Description>
                {activities.length === 0 ? (
                  <div>No activities to show</div>
                ) : (
                  <div className="ui feed">
                    {activities.map(item => (
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
                        {!item.read && (
                          <div style={{ color: "#ffc107" }}>•</div>
                        )}
                        <div className="date">
                          {moment.utc(item.time).fromNow()}
                        </div>
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
                  setOpen(false);
                  setActivitiesToRead();
                }}
              >
                OK
              </Button>
            </Modal.Actions>
          </Modal>

          {/* User Profile (only if logged in) */}
          {token && (
            <button className="ui basic button" title="profile" onClick={() => route(`user/${user}`)}>
              <i className="user outline icon" />
            </button>
          )}

          {/* Language */}
          <Button className="ui basic button" onClick={openLanguageModal}>
            Language: {language}
          </Button>

          {/* If not logged in -> show Login & Register, else -> Logout */}
          {!token ? (
            <>
              <button className="ui basic button" onClick={() => route("login")}>
                Login
              </button>
            </>
          ) : (
            <button className="ui basic button" onClick={() => route("logout")}>
              Logout
            </button>
          )}

          {/* Report Bug (use icon with hover) */}
          <button
            className="ui basic button"
            onClick={() => route("bug")}
            title="report bug"
          >
            <i className="bug icon" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
