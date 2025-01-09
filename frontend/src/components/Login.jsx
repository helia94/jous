// Login.js
import React, { Component } from "react";
import Alert from "./Alert";
import { login, check } from "../login";
import { Helmet } from 'react-helmet';
import { Form, Button, Segment, Container } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import './Auth.css'; // Ensure this file exists with the provided styles

class Login extends Component {
    state = {
        err: "",
        email: "",
        password: ""
    };

    componentDidMount() {
        const token = localStorage.getItem("token");
        if (token) {
            check().then(r => {
                if (r) {
                    window.location = "/";
                }
            });
        }
    }

    handleChange = (e, { name, value }) => {
        this.setState({ [name]: value });
    };

    loginUser = (e) => {
        e.preventDefault();
        const { email, password } = this.state;

        login(email, password)
            .then(r => {
                if (r === true) {
                    window.location = "/";
                } else {
                    this.setState({ err: r });
                }
            })
            .catch(() => {
                this.setState({ err: "Server error. Please try again later." });
            });
    };

    render() {
        const backgroundStyle = {
            backgroundImage: `url(./jous-awkwart.jpg)`,
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
                    <title>Login</title>
                    <link rel="canonical" href="https://jous.app/login" />
                </Helmet>
                <Container textAlign="center">
                    <Segment padded="very" className="auth-segment">
                        <h2>Login</h2>
                        {this.state.err && (
                            <Alert message={`Check your form and try again! (${this.state.err})`} />
                        )}
                        <Form onSubmit={this.loginUser}>
                            <Form.Input
                                fluid
                                label="Email"
                                placeholder="Email"
                                type="text"
                                name="email"
                                value={this.state.email}
                                onChange={this.handleChange}
                                required
                            />
                            <Form.Input
                                fluid
                                label="Password"
                                placeholder="Password"
                                type="password"
                                name="password"
                                value={this.state.password}
                                onChange={this.handleChange}
                                required
                            />
                            <Button type="submit" color="blue" fluid>
                                Login
                            </Button>
                        </Form>
                        <div style={{ marginTop: '1em' }}>
                            Don't have an account? <a href="/register">Register here</a>
                        </div>
                    </Segment>
                </Container>
            </div>
        );
    }
}

export default Login;
