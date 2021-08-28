import React from "react";
import Axios from "axios";

class AddUserToGroup extends React.Component {
    state = { user: "" }

    handleInputChangeUser = (e) => {
        e.preventDefault();
        this.setState({
            user: e.target.value
        });
    }

    submitForm = (e) => {
        e.preventDefault()
        if (this.state.user.length === 0) {
            return;
        }

        Axios.post("/api/adduserstogroup", {
            name: this.props.name,
            users: this.state.user
        }, {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
            }
        }).then(res => {
            if (res.data.success) {
                window.location.reload()
                console.log("added user to group")
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
            <div class="ui basic segment" id="addUser">
                <form class="ui small form"  onSubmit={this.submitForm}>
                    <h4 class="ui small grey header">Add a member to the group</h4>
                    <div class="field" value={this.state.users} onChange={this.handleInputChangeUser}>
                        <label>Username</label>
                        <input type="text" name="usernames" placeholder="paris"></input>
                    </div>
                    <button  type="submit" class="ui button">add</button>
                </form>
            </div>
        )
    }
}

export default AddUserToGroup