import React from "react";
import Axios from "axios";

class AddGroup extends React.Component {
    state = { users: [], name: "" }

    handleInputChangeName = (e) => {
        e.preventDefault();
        this.setState({
            name: e.target.value
        });
    }

    handleInputChangeUsers = (e) => {
        e.preventDefault();
        this.setState({
            users: e.target.value
        });
    }

    submitForm = (e) => {
        e.preventDefault()
        if (this.state.users.length === 0) {
            return;
        }
        if (this.state.name.length === 0) {
            return;
        }
        Axios.post("/api/addgroup", {
            name: this.state.name,
            users: this.state.users
        }, {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
            }
        }).then(res => {
            if (res.data.success) {
                window.location.reload()
                console.log("added group")
            } else {
                console.log(res.data.error)
                this.setState(
                    { formErr: res.data.error }
                )
            }
        })
    }

    render() {
        return (
            <div class="ui basic segment" id="addGroup">
                <form class="ui small form"  onSubmit={this.submitForm}>
                    <h4 class="ui small grey header">Make a group</h4>
                    <div class="field" value={this.state.name} onChange={this.handleInputChangeName}>
                        <label>Name</label>
                        <input type="text" name="name" placeholder="OlympusJous"></input>
                    </div>
                    <div class="field" value={this.state.users} onChange={this.handleInputChangeUsers}>
                        <label>Usernames</label>
                        <input type="text" name="usernames" placeholder="athena,aphrodite,hera"></input>
                    </div>
                    <button  type="submit" class="ui button" type="submit">add</button>
                </form>
            </div>
        )
    }
}

export default AddGroup