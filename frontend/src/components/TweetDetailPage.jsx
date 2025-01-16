import React from "react";
import Axios from "axios";
import moment from 'moment';
import TweetItem2 from "./TweetItem2";
import { Helmet } from 'react-helmet';
import { LanguageContext } from "./LanguageContext"; 

class TweetDetailPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            question: { id: 0, content: "", author: "", time: "" },
            answers: [],
            isLoggedIn: false,
            currentUser: { username: "" },
            newAnswer: "",
            anon: "False",
            width: 500,
            height: 500,
            selectedLanguageFrontendCode: "original"
        };
    }

    static contextType = LanguageContext;
    
    componentDidMount() {
        const { availableLanguages = [], language } = this.context; 
        const selectedLanguage = availableLanguages.find(
          (lang) => lang.frontend_code === language
        );

        this.setState({ selectedLanguageFrontendCode: selectedLanguage.frontend_code });

        Axios.get("/api/question/" + this.props.match.params.question, {
            params: { 
                language_id: selectedLanguage.backend_code
             } }).then(res => {
            this.setState({ question: res.data.question, answers: res.data.answers });
        });
        
        setTimeout(() => {
            const token = localStorage.getItem("token");
            if (token) {
                Axios.get("/api/getcurrentuser", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }).then(res => {
                    this.setState({ isLoggedIn: true, currentUser: res.data });
                });
            }
        }, 20);
        this.setState({ width: window.innerWidth, height: window.innerHeight });
        window.addEventListener('resize', this.updateDimensions);
    }

    handleFormSubmit = (e) => {
        e.preventDefault();
        const config = {
            headers: {}
        };
        if (this.state.isLoggedIn) {
            config.headers['Authorization'] = "Bearer " + localStorage.getItem("token");
        }

        Axios.post("/api/addanswer", {
            content: this.state.newAnswer,
            anon: this.state.anon,
            question: this.props.match.params.question
        }, config).then(res => {
            if (res.data.success) {
                // Remove window.location.reload() and update state directly
                // Double check if your API returns the newly created answer in res.data.answer
                // or build it from the current form data
                const newAnswerObj = {
                    content: this.state.newAnswer,
                    username: this.state.currentUser.username,
                    time: moment().format('ddd, DD MMM YYYY h:mm:ss') 
                };
                this.setState(prevState => ({
                    answers: [...prevState.answers, newAnswerObj],
                    newAnswer: ""
                }));
                console.log("added answer");
            } else {
                console.log(res.data.error);
                this.setState({ formErr: res.data.error });
            }
        });
    }

    handleInputChange = (e) => {
        e.preventDefault();
        this.setState({ newAnswer: e.target.value });
    }

    updateDimensions = () => {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
    };

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateDimensions);
    }

    renderTweetItem(item) {
        return (
            item && (
                    <TweetItem2
                        id={item.id}
                        content={item.content}
                        author={item.username}
                        time={item.time}
                        likes={item.like_number}
                        answers={item.answer_number}
                        isOwner={this.state.currentUser.username === item.username}
                        isLoggedIn={this.state.login}
                        selectedLanguageFrontendCode={this.state.selectedLanguageFrontendCode}
                    />
            )
        );
    }
    

    render() {
        return (
            <React.Fragment>
                <Helmet>
                    <title>{`Question ${this.state.question.id}`}</title>
                    <link
                        rel="canonical"
                        href={`https://jous.app/question/${this.state.question.id}`}
                    />
                </Helmet>
                <div className="ui basic segment" style={{ width: Math.min(this.state.width * 0.9, 500) }}>
                {this.renderTweetItem(this.state.question)}
                    <div className="ui comments">
                        <h3 className="ui dividing header">Answers</h3>
                        {this.state.answers.map((item, index) => {
                            return (
                                <div className="comment" key={index}>
                                    <div className="content">
                                        <a className="author" href={"/user/" + item.username}>
                                            {item.username}
                                        </a>
                                        <div className="metadata">
                                            <span className="date">
                                                {moment(item.time, 'ddd, DD MMM YYYY h:mm:ss').format('DD MMM')}
                                            </span>
                                        </div>
                                        <div className="text">
                                            {item.content}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <form className="ui reply form" onSubmit={this.handleFormSubmit} id="submit-form">
                        <div className="field" value={this.state.newAnswer} onChange={this.handleInputChange}>
                            <textarea value={this.state.newAnswer} />
                        </div>
                        <div className="ui buttons">
                            {this.state.isLoggedIn && (
                                <button
                                    type="submit"
                                    className="ui black submit icon button"
                                    data-tooltip="add answer"
                                    onClick={() => this.setState({ anon: 'False' })}
                                >
                                    <i className="icon edit"></i>
                                </button>
                            )}
                            <button
                                type="submit"
                                className="ui black submit icon button"
                                data-tooltip="add answer anonymously"
                                onClick={() => this.setState({ anon: 'True' })}
                            >
                                <i className="user secret icon"></i>
                            </button>
                        </div>
                    </form>
                </div>
            </React.Fragment>
        );
    }
}

export default TweetDetailPage;
