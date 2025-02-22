import React from "react";
import { logout } from "../login";
import { Helmet } from 'react-helmet';
import { withRouter } from "react-router-dom";

class Logout extends React.Component {
  componentDidMount() {
    logout();
    // Then redirect
    this.props.history.push("/");
  }

  render() {
    return (
      <div className="w3-container w3-xlarge">
        <Helmet>
          <title>Logging out...</title>
          <link rel="canonical" href="https://jous.com/logout" />
        </Helmet>
        <p>Please wait, logging you out...</p>
      </div>
    )
  }
}

export default withRouter(Logout);
