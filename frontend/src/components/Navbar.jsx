import React, { useState, useEffect } from "react";
import { getCurrentUser } from "../login";
import { Button, Modal } from 'semantic-ui-react';
import Axios from "axios";
import moment from 'moment';
import './Navbar.css';

const activityMessage = {
  'answer': "answered your question",
  'newGroup': "You are added to ",
  'questionInGroup': " posted a question to ",
  'answerInGroup': " answered a question in "
};

const activityLink = {
  'answer': "question",
  'newGroup': "group",
  'questionInGroup': "group",
  'answerInGroup': "group"
};

function Navbar() {
  const [user, setUser] = useState("noUser");
  const [activities, setActivities] = useState([]);
  const [checkedForActivities, setCheckedForActivities] = useState(false);
  const [open, setOpen] = useState(false);
  const [notify, setNotify] = useState(false);

  // Grab the token from localStorage (if any).
  const token = localStorage.getItem("token");

  /**
   * Fetch current user on mount (only if token exists).
   */
  useEffect(() => {
    if (!token) return;
    getCurrentUser().then((r) => setUser(r)).catch((e) => console.error(e));
  }, [token]);

  /**
   * Fetch user activities once if token exists.
   */
  useEffect(() => {
    if (!token || checkedForActivities) return;

    Axios.get("/api/useractivities", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((res) => {
        setActivities(res.data);
        setCheckedForActivities(true);
        // If there's at least one unread activity, set notify = true
        const hasUnread = res.data.some((item) => item.read === false);
        setNotify(hasUnread);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [token, checkedForActivities]);

  /**
   * Mark activities as read in the backend (if we have any).
   */
  function setActivitiesToRead() {
    if (activities.length > 0) {
      Axios.get(`/api/readuseractivity/${activities[0].id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(() => {
          setNotify(false);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }

  /**
   * Redirect user to /user/<username>.
   */
  function routeToUser() {
    window.location.href = `/user/${user}`;
  }

  /**
   * Redirect user to /random.
   */
  function routeToRandom() {
    window.location.href = "/random";
  }

  // Decide which links to show based on token presence
  let a = { name: token ? "Settings" : "Login", link: token ? "/settings" : "/login" };
  let b = { name: token ? "Logout" : "Register", link: token ? "/logout" : "/register" };
  let c = { name: "Report bugs", link: "/bug" };

  return (
    <div className="ui menu yellow">
      <a className="item ui basic button no-border" href="/">
        Jous
      </a>
      <div className="right menu">
        <div className="ui buttons">
          {/* Activities Modal Trigger */}
          <Modal
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
            open={open}
            trigger={
              <div className="ui basic button">
                <span className="modal-btn">
                  {/* If notify = true, show a filled icon (or color) */}
                  <i className={`lemon ${notify ? "yellow" : "outline"} icon`} />
                </span>
              </div>
            }
          >
            <Modal.Content image>
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
                        {!item.read && (
                          <div style={{ color: "#ffc107", alignItems: "top" }}>
                            •
                          </div>
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

          {/* Random */}
          <button className="ui basic button" onClick={routeToRandom}>
            <i className="random icon" />
          </button>

          {/* Show user icon only if logged in */}
          {token && (
            <button className="ui basic button" onClick={routeToUser}>
              <i className="user outline icon" />
            </button>
          )}

          {/* Settings/Login */}
          <a className="ui basic button" href={a.link}>
            {a.name}
          </a>

          {/* Logout/Register */}
          <a className="ui basic button" href={b.link}>
            {b.name}
          </a>

          {/* Bug Reports */}
          <a className="ui basic button" href={c.link}>
            {c.name}
          </a>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
