import React from "react";
import GroupQuestion from "./GroupQuestion";
import Axios from "axios";
import AddUserToGroup from "./AddUserToGroup";

class GroupHome extends React.Component {
    state = { questions: [], currentUser: { username: "" }, users:[] }

    componentDidMount() {
        Axios.get("/api/groupquestions/" + this.props.match.params.groupname, {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
            }
        }).then(res => {
            this.setState({ questions: res.data })
        });
        setTimeout(() => {
            Axios.get("/api/getcurrentuser", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            }).then(res => {
                this.setState({ currentUser: res.data })
            })
        }, 500)
    }

    render() {
        return (
            <React.Fragment>
                <div class="ui basic segment" style={{ width: 400 }}>
                    <div class="ui right dividing rail">
                        <h4 class="ui small grey header">Members</h4>
                        <div class="ui list">
                            {this.state.users.map((item, index) => {
                                return (
                                    <div class="item">item</div>
                                );
                            })}
                        </div>
                        <AddUserToGroup
                        name= {this.props.match.params.groupname}/>
                    </div>
                    <h1>Home of {this.props.match.params.groupname}</h1>
                    <div class="ui hidden divider"></div>
                    <div class="ui feed">
                        {this.state.questions.length === 0 ?
                            <p className="ui card" >No questions yet! Create
                                one</p> : this.state.questions.map((item, index) => {
                                    return (
                                        <div class="event">
                                            <GroupQuestion
                                                question={item.question}
                                                answers={item.answers}
                                                group={this.props.match.params.groupname}
                                                key={index}
                                            />
                                        </div>
                                    );
                                })}
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default GroupHome;
