// Register.js
import React, { Component } from "react";
import axios from "axios";
import Alert from "./Alert";
import { check } from "../login";
import { Helmet } from 'react-helmet';
import './Auth.css';

class Register extends Component {
    state = {
        err: "",
        email: "",
        username: "",
        password: ""
    };

    componentDidMount() {
        check().then(r => {
            if (r) {
                window.location = "/";
            }
        });
    }

    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    };

    register = (e) => {
        e.preventDefault();
        const { email, username, password } = this.state;

        axios
            .post("/api/register", {
                email,
                username,
                pwd: password,
            })
            .then((res) => {
                if (res.data.error) {
                    this.setState({ err: res.data.error });
                } else {
                    window.location = "/login";
                }
            })
            .catch(() => {
                this.setState({ err: "Server error. Please try again later." });
            });
    };

    render() {
        const backgroundStyle = {
            backgroundImage: `url(./jous-awkwart.webp)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
        };

        return (
            <div style={backgroundStyle}>
                <Helmet>
                    <title>Register</title>
                    <link rel="canonical" href="https://jous.app/register" />
                </Helmet>
                <div className="auth-container">
                    <div className="auth-segment">
                        <h2>Register</h2>
                        {this.state.err && (
                            <Alert message={`Check your form and try again! (${this.state.err})`} />
                        )}
                        <form onSubmit={this.register}>
                            <input
                                placeholder="Email (optional for resetting password)"
                                type="email"
                                name="email"
                                value={this.state.email}
                                onChange={this.handleChange}
                            />
                            <input
                                placeholder="Username"
                                type="text"
                                name="username"
                                value={this.state.username}
                                onChange={this.handleChange}
                                required
                            />
                            <input
                                placeholder="Password"
                                type="password"
                                name="password"
                                value={this.state.password}
                                onChange={this.handleChange}
                                required
                            />
                            <button type="submit">Register</button>
                        </form>
                        <div style={{ marginTop: '1em' }}>
                            Already have an account? <a href="/login">Login here</a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Register;
