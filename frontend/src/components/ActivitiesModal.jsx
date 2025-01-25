// src/components/ActivitiesModal.js
import React, { useEffect, useState } from "react";
import { Button, Modal } from "semantic-ui-react";

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

function ActivitiesModal({ open, onClose, activities, setActivitiesToRead, notify }) {
  const [moment, setMoment] = useState(null);

  useEffect(() => {
    if (open && !moment) {
      import("moment").then((module) => setMoment(module.default));
    }
  }, [open, moment]);

  if (!moment) {
    return null; // Or a loader/spinner
  }

  return (
    <Modal onClose={onClose} open={open}>
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
            onClose();
            setActivitiesToRead();
          }}
        >
          OK
        </Button>
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(ActivitiesModal);
