import React, { useState } from "react";
import { getCurrentUser } from "../login";
import { Button, Modal } from 'semantic-ui-react'
import Axios from "axios";
import moment from 'moment'

const activityMessage = {
    'answer': "answered your question",
    'newGroup': "You are added to ",
    'questionInGroup': " posted a question to ",
    'answerInGroup': " answered a question in "
}

const activityLink = {
    'answer': "question",
    'newGroup': "group",
    'questionInGroup': "group",
    'answerInGroup': "group"
}

function Navbar() {

    let [user, setUser] = useState("noUser");
    let [activities, setActivities] = useState([]);
    let [checkedForActivities, setCheckedForActivities] = useState(false);
    let [open, setOpen] = useState(false)
    let [notify, setNotify] = useState(false)

    getCurrentUser().then(r => setUser(r))

    function routeToUser() {
        let path = "/user/" + user;
        window.location.href = path;
    }

    function routeToRandom() {
        let path = "/random" ;
        window.location.href = path;
    }

    function getActivities() {
        if (activities.length === 0 && !checkedForActivities) {
            Axios.get("/api/useractivities", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            }).then(res => {
                setActivities(res.data)
                setCheckedForActivities(true)
                setNotify(res.data.map((item, index) => item.read).some((element) => element === false))
            }).catch((error) => {
                console.error({ error });
            });;
        }

    }

    function setActivitiesToRead() {
        if (activities.length > 0) {
            Axios.get("/api/readuseractivity/" + activities[0].id, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            }).then(res => {
                console.log('read activities')
                setNotify(false)
            }).catch((error) => {
                console.error({ error });
            });;
        }
    }
    getActivities();

    let x = localStorage.getItem("token");
    let a = { name: x ? "Settings" : "Login", link: x ? "/settings" : "/login" }
    let b = { name: x ? "Logout" : "Register", link: x ? "/logout" : "/register" }
    let c = { name: "Report bugs", link: "/bug" }
    let d = {name: "Random", link: "/random"}
    return (
        <div className="ui menu yellow">
            <a className="w3-bar-item w3-button" href="/">
                Jous
            </a>
            <div class="right menu">
                <Modal
                    onClose={() => setOpen(false)}
                    onOpen={() => {
                        setOpen(true);
                        getActivities();
                    }}
                    open={open}
                    trigger={
                        <div className="w3-bar-item w3-button">
                            {<span class="modal-btn"><i class={"lemon " + (notify ? "yellow" : "outline") + " icon"}></i></span>}
                        </div>
                    }
                >
                    <Modal.Content image>
                        <Modal.Description>
                            {activities.length === 0 ?
                                <div>No activities to show</div> :
                                <div class="ui feed">
                                    {activities.map((item, index) =>
                                        <div class="event">
                                            <div class="label">
                                            </div>
                                            <div class="content" >
                                                <div class="summary" >
                                                    <div class="user" href={'/' + activityLink[item.type] + '/' + item.what}>
                                                        {item.fromUid}
                                                    </div> {activityMessage[item.type]}
                                                    {item.type === "answer" ? "" : <div class="group">
                                                        {item.what}
                                                    </div>}
                                                    {<div style={{ color: '#ffc107', alignItems: 'top' }}>{item.read ? null : '\u2022'}</div>}
                                                    <div class="date">
                                                        {moment.utc(item.time, 'ddd, DD MMM YYYY h:mm:ss').fromNow()}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            }
                        </Modal.Description>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color='black' onClick={() => {
                            setOpen(false);
                            setActivitiesToRead();
                        }}>
                            OK
                        </Button>
                    </Modal.Actions>
                </Modal>
                <a className="w3-bar-item w3-button" href={d.link}>
                {<i class="random icon"></i>}
                </a>
                {x ? <a className="w3-bar-item w3-button" onClick={routeToUser}>
                    {<i class="user outline icon"></i>}
                </a> : null}
                <a className="w3-bar-item w3-button" href={a.link}>
                    {a.name}
                </a>
                <a className="w3-bar-item w3-button" href={b.link}>
                    {b.name}
                </a>
                <a className="w3-bar-item w3-button" href={c.link}>
                    {c.name}
                </a>
            </div>
        </div>
    );
}

export default Navbar;
