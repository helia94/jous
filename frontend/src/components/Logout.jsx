import React from "react";
import { logout } from "../login";
import { Helmet } from 'react-helmet';

class Logout extends React.Component {
    componentDidMount() {
        logout()
    }

    render() {
        return (
            <div className="w3-container w3-xlarge">
                <Helmet>
                    <title>Logging out...</title>
                    <link rel="canonical" href="https://www.jous.com/logout" />
                </Helmet>
                <p>Please wait, logging you out...</p>
            </div>
        )
    }
}

export default Logout;