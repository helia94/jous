import React, { useEffect, Suspense, lazy, useState } from "react";
import { BrowserRouter as Router, Redirect, Route, Switch } from "react-router-dom";

// Providers
import { LanguageProvider } from "./LanguageContext";
import { FilterProvider } from "./FilterContext";
import { initAnalytics } from "./analytics";
import { conversationCardSpokePages } from "./conversationCardSeoPages";

// Eagerly Loaded Components
import Navbar from "./Navbar";

// Styles
import "./theme.css";

// Lazy-loaded Components
const Homev2 = lazy(() => import("./Homev2"));
const Random = lazy(() => import("./Random"));
const Login = lazy(() => import("./Login"));
const Bug = lazy(() => import("./Bug"));
const Register = lazy(() => import("./Register"));
const MainPage = lazy(() => import("./MainPage"));
const Logout = lazy(() => import("./Logout"));
const NotFound = lazy(() => import("./NotFound"));
const UserPage = lazy(() => import("./UserPage"));
const GroupHome = lazy(() => import("./GroupHome"));
const TweetDetailPage = lazy(() => import("./TweetDetailPage"));
const Imprint = lazy(() => import("./Imprint"));
const Blog = lazy(() => import("./Blog"));
const DatabaseBlogList = lazy(() => import("./DatabaseBlogList"));
const BlogRoutes = lazy(() => import("./BlogRoutes"));
const ConversationCards = lazy(() => import("./ConversationCards"));
const ConversationCardSpoke = lazy(() => import("./ConversationCardSpoke"));
const PrintableConversationCards = lazy(() => import("./PrintableConversationCards"));
const conversationCardSpokePaths = Object.keys(conversationCardSpokePages);

function App() {
    const [login, setLogin] = useState(() => Boolean(localStorage.getItem("token")));

    useEffect(() => {
        window.setTimeout(() => {
            initAnalytics().catch(() => {});
        }, 2500);

        if (!localStorage.getItem("token")) {
            setLogin(false);
            return;
        }

        import("../login")
            .then(({ check }) => check())
            .then(r => setLogin(r))
            .catch(() => setLogin(false));
    }, []);

    return (
        <LanguageProvider>
            <FilterProvider>
                <React.Fragment>
                    <Navbar style={{ position: 'relative', zIndex: 1 }} />

                    <Router>
                        <Suspense fallback={<div>Loading...</div>}>
                            <Switch>
                                <Route path="/" exact>
                                    {login ? <MainPage /> : <Homev2 />}
                                </Route>
                                <Route path="/home" component={MainPage} />
                                <Route path="/random" component={Random} />
                                <Route path="/conversation-cards" exact component={ConversationCards} />
                                <Route path="/conversation-cards-for-friends" exact>
                                    <Redirect to="/random?occasion=0" />
                                </Route>
                                <Route path="/conversation-cards-for-couples" exact>
                                    <Redirect to="/random?occasion=3" />
                                </Route>
                                <Route path="/printable-conversation-cards" exact component={PrintableConversationCards} />
                                <Route path={conversationCardSpokePaths} exact component={ConversationCardSpoke} />
                                <Route path="/user/:username" component={UserPage} />
                                <Route path="/group/:groupname" component={GroupHome} />
                                <Route path="/question/:question" component={TweetDetailPage} />
                                <Route path="/login" exact component={Login} />
                                <Route path="/register" exact component={Register} />
                                <Route path="/logout" exact component={Logout} />
                                <Route path="/bug" exact component={Bug} />
                                <Route path="/impressum" exact component={Imprint} />
                                <Route path="/blog" exact component={Blog} />
                                <Route path="/more-blogs" exact component={DatabaseBlogList} />
                                <Route path="/blog/:url" component={BlogRoutes} />
                                <Route component={NotFound} />
                            </Switch>
                        </Suspense>
                    </Router>

                    <footer className="impressum-footer">
                        <a href="/impressum">Impressum</a>
                    </footer>
                </React.Fragment>
            </FilterProvider>
        </LanguageProvider>
    );
}

export default App;
