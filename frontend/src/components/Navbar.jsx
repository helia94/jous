import React, { useState } from "react";
import { getCurrentUser } from "../login";

function Navbar() {

    let [user, setUser] = React.useState("noUser");

    getCurrentUser().then(r => setUser(r))

    function routeToUser() {
        let path = "/user/" + user;
        window.location.href = path;
    }

    let x = localStorage.getItem("token");
    let a = { name: x ? "Settings" : "Login", link: x ? "/settings" : "/login" }
    let b = { name: x ? "Logout" : "Register", link: x ? "/logout" : "/register" }

    return (
        <div className="ui menu yellow">
            <a className="w3-bar-item w3-button" href="/">
                Jous
            </a>
            <div class="right menu">
                {x ? <a className="w3-bar-item w3-button" onClick={routeToUser}>
                    {<i class="user outline icon"></i>}
                </a> : null}
                <a className="w3-bar-item w3-button" href={a.link}>
                    {a.name}
                </a>
                <a className="w3-bar-item w3-button" href={b.link}>
                    {b.name}
                </a>
            </div>
        </div>
    );
}

export default Navbar;
