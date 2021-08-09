import React from "react";

function Navbar() {
    let [theme, setTheme] = React.useState(localStorage.getItem("theme") || "light");

    React.useEffect(() => {
        if (theme === "dark") {
            document.body.classList.add("dark");
        } else {
            document.body.classList.remove("dark");
        }
    }, [theme])

    let x = localStorage.getItem("token");
    let a = {name: x ? "Settings" : "Login", link: x ? "/settings" : "/login"}
    let b = {name: x ? "Logout" : "Register", link: x ? "/logout" : "/register"}

    return (
        <div className="ui menu yellow">
            <a className="w3-bar-item w3-button" href="/">
                Jous
            </a>
            <div class="right menu">
                <button className="w3-bar-item w3-btn" onClick={() => {
                    if (theme === "dark") {
                        localStorage.setItem("theme", "light");
                        setTheme("light")
                    } else {
                        localStorage.setItem("theme", "dark");
                        setTheme("dark")
                    }
                }}>{theme === "dark" ? "☀️" : "🌙"}</button>
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
