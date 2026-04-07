import React from "react";
import { Redirect } from 'react-router-dom';

class LogoutButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loggedOut: false
        };
        this.handleLogout = this.handleLogout.bind(this);
    }

    handleLogout() {
        document.cookie = "Token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        this.setState({ loggedOut: true });
    }

    render() {
        if (this.state.loggedOut) {
            return (<Redirect to="/login" />);
        }

        return (
            <button onClick={this.handleLogout} style={{ cursor: "pointer" }}>
                Se déconnecter
            </button>
        );
    }
}

export default LogoutButton;