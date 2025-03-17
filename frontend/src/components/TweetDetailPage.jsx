// TweetDetailPage.jsx
import React from "react";
import Axios from "axios";
import moment from 'moment';
import TweetItem2 from "./TweetItem2";
import { Helmet } from 'react-helmet';
import { LanguageContext } from "./LanguageContext";
import { getFontClassForCards } from './FontUtils';
import ConfettiBackground from "./ConfettiBackground"

class TweetDetailPage extends React.Component {
  static contextType = LanguageContext;

  constructor(props, context) {
    super(props, context);
    const { availableLanguages = [], language } = context;
    const selectedLanguage = availableLanguages.find(
      (lang) => lang.frontend_code === language
    ) || { frontend_code: "original", backend_code: null };

    this.state = {
      question: { id: 0, content: "", author: "", time: "" },
      answers: [],
      isLoggedIn: false,
      currentUser: { username: "" },
      newAnswer: "",
      anon: "False",
      width: 500,
      height: 500,
      selectedLanguageFrontendCode: selectedLanguage.frontend_code,
      selectedLanguageBackendCode: selectedLanguage.backend_code
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this.updateDimensions);
    this.setState({ width: window.innerWidth, height: window.innerHeight });

    Axios.get("/api/question/" + this.props.match.params.question, {
      params: {
        language_id: this.state.selectedLanguageBackendCode
      }
    }).then(res => {
      this.setState({
        question: res.data.question,
        answers: res.data.answers
      });
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

    window.addEventListener('resize', this.updateDimensions);
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }


  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }

  updateDimensions = () => {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  };

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
        const newAnswerObj = {
          content: this.state.newAnswer,
          username: this.state.currentUser.username,
          time: moment().format('ddd, DD MMM YYYY h:mm:ss')
        };
        this.setState(prevState => ({
          answers: [...prevState.answers, newAnswerObj],
          newAnswer: ""
        }));
      } else {
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
      <>
        <Helmet>
          <title>{`Question ${this.state.question.id}`}</title>
          <link
            rel="canonical"
            href={`https://jous.app/question/${this.state.question.id}`}
          />
        </Helmet>
      <ConfettiBackground />
        <div className="Questin-and-Answer"
        style={{ maxWidth: Math.min(this.state.width, 500), 
          margin: "0 auto", 
          padding: "1rem", 
          position: "relative", 
          zIndex: 1  }}
        >
          {this.renderTweetItem(this.state.question)}
          <div style={{ marginTop: "1rem" }}>
            <h3 style={{ fontFamily: "Limelight", marginBottom: "1rem" }}>Answers</h3>
            {this.state.answers.map((item, index) => {
              return (
                <div key={index} style={{ margin: "1rem 0" }}>
                  <div style={{ marginBottom: "0.3rem", fontFamily:"Limelight" }}>
                    <a style={{ textDecoration: "underline" }} href={"/user/" + item.username}>
                      {item.username}
                    </a>
                    <span style={{ marginLeft: "1rem", opacity: 0.7, fontFamily:"Limelight" }}>
                      {moment(item.time, "ddd, DD MMM YYYY h:mm:ss").format("DD MMM")}
                    </span>
                  </div>
                  <p className = {getFontClassForCards(item.content)} style={{fontSize: "1.5rem" }}>
                    {item.content}
                  </p>
                </div>
              );
            })}
          </div>
          <form className="c-form" onSubmit={this.handleFormSubmit} id="submit-form">
            <div className="c-field">
              <textarea
                className={getFontClassForCards(this.state.newAnswer)}
                value={this.state.newAnswer}
                onChange={this.handleInputChange}
              />
            </div>
            <div>
              {this.state.isLoggedIn && (
                <button
                  type="submit"
                  className="c-button"
                  onClick={() => this.setState({ anon: "False" })}
                  style={{ marginRight: "0.5rem" }}
                >
                  <i className="icon edit"></i>
                </button>
              )}
              <button
                type="submit"
                className="c-button"
                onClick={() => this.setState({ anon: "True" })}
              >
                <i className="user secret icon"></i>
              </button>
            </div>
          </form>
        </div>
      </>
    );
  }
}


export default TweetDetailPage;
