import React from "react";
import Axios from "axios";
import InfiniteScroll from 'react-infinite-scroll-component';
import TweetItem2 from "./TweetItem2";
import AddTweet from "./AddTweet";
import { check } from "../login";
import { Helmet } from 'react-helmet';
import { LanguageContext } from "./LanguageContext";
import { FilterContext } from "./FilterContext";
import ConfettiBackground from "./ConfettiBackground"

class MainPage extends React.Component {
  static contextType = LanguageContext;

  constructor(props, context) {
    super(props, context);
    const { availableLanguages = [], language } = context;
    const selectedLanguage = availableLanguages.find(
      (lang) => lang.frontend_code === language
    ) || { frontend_code: "original", backend_code: null };

    this.state = {
      tweets: [],
      currentUser: { username: "" },
      login: false,
      hasMore: true,
      page: 0,
      width: 500,
      height: 600,
      showAddQuestion: false,
      selectedLanguageFrontendCode: selectedLanguage.frontend_code,
      selectedLanguageBackendCode: selectedLanguage.backend_code
    };
  }

  componentDidMount() {
    check().then(r => this.setState({ login: r }));
    window.addEventListener('resize', this.updateDimensions);
    this.setState({ width: window.innerWidth, height: window.innerHeight });
    this.fetchQuestions(true); // initial fetch
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }

  componentDidUpdate(prevProps) {
    // if chosen filters changed, refetch from scratch
    const { chosenFilters } = this.props.filterContext;
    const oldFilters = prevProps.filterContext.chosenFilters;
    if (JSON.stringify(chosenFilters) !== JSON.stringify(oldFilters)) {
      this.setState({ page: 0, tweets: [], hasMore: true }, () => {
        this.fetchQuestions(true);
      });
    }
  }

  fetchQuestions = (reset = false) => {
    const { chosenFilters } = this.props.filterContext;
    Axios.get(`/api/questions`, {
      params: {
        offset: reset ? 0 : this.state.page,
        language_id: this.state.selectedLanguageBackendCode,
        ...chosenFilters
      }
    }).then(res => {
      const newTweets = res.data.reverse();
      this.setState((prevState) => ({
        tweets: reset ? newTweets : prevState.tweets.concat(newTweets),
        page: (reset ? 1 : prevState.page + 1),
        hasMore: newTweets.length > 0
      }));
    }).catch(err => console.error(err));
  }

  fetchMoreData = () => {
    this.fetchQuestions(false);
  }

  updateDimensions = () => {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  };

  toggleShowAddQuestion = () => {
    this.setState({ showAddQuestion: !this.state.showAddQuestion });
  };

  addNewTweet = (content, anon) => {
    const newTweet = {
      id: Date.now(),
      content: content,
      username: 'you',
      time: new Date().toUTCString(),
      like_number: 0,
      answer_number: 0
    };
    this.setState(prevState => ({
      tweets: [newTweet, ...prevState.tweets],
      showAddQuestion: false
    }));
  }

  render() {
    return (
      <React.Fragment>
      <Helmet>
        <title>Jous Home</title>
        <link rel="canonical" href="https://jous.app/home" />
        <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": this.state.tweets.map((tweet) => ({
            "@type": "Question",
            "name": "q",
            "text": tweet.content,
            "dateCreated": tweet.time,
            "author": {
              "@type": "Person",
              "name": tweet.username
            },
            "answerCount": tweet.answer_number,
            "upvoteCount": tweet.like_number,
            "acceptedAnswer": tweet.answer_number > 0
              ? {
                  "@type": "Answer",
                  "text": "This question has answers, view them on the site.",
                  "dateCreated": tweet.time,
                  "author": {
                    "@type": "Person",
                    "name": "Various Users"
                  }
                }
              : undefined
          }))
        })}
        </script>
      </Helmet> 
      <div style={{ justifyItems: "center" }}>
          <ConfettiBackground />
          <div
            style={{
              maxWidth: Math.min(this.state.width * 0.95, 768),
              position: "relative",
              zIndex: 1,
            }}
          >
            <h1  className="c-heading" >Home</h1>
            {!this.state.showAddQuestion && (
              <button className="c-button" onClick={this.toggleShowAddQuestion}>
                Add a question
              </button>
            )}
            {this.state.showAddQuestion && (
              <AddTweet
                onClose={this.toggleShowAddQuestion}
                onAdd={this.addNewTweet}
              />
            )}
            <InfiniteScroll
              dataLength={this.state.tweets.length}
              next={this.fetchMoreData}
              hasMore={this.state.hasMore}
              loader={<h4>Loading...</h4>}
              endMessage={
                <p style={{ textAlign: "center" }}>
                  <b>The end.</b>
                </p>
              }
              useWindow={false}
              height={Math.max(this.state.height - 200, 300)}
            >
              {this.state.tweets.map((item, index) => (
                <div style={{ padding: "0rem", marginBottom: "2rem" }} key={item.id || index}>
                  <TweetItem2
                    id={item.id}
                    content={item.content}
                    author={item.username}
                    time={item.time}
                    likes={item.like_number}
                    answers={item.answer_number}
                    isOwner={this.state.currentUser.username === item.username}
                    isLoggedIn={this.state.login}
                    selectedLanguageFrontendCode={
                      this.state.selectedLanguageFrontendCode
                    }
                  />
                </div>
              ))}
            </InfiniteScroll>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

// Wrap MainPage with FilterContext so it has access to filter props
export default (props) => (
  <FilterContext.Consumer>
    {filterCtx => <MainPage {...props} filterContext={filterCtx} />}
  </FilterContext.Consumer>
);
