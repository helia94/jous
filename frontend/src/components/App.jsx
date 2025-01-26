// src/components/App.jsx

import React, { useEffect, Suspense, lazy, useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import ReactGA from 'react-ga4';
import AsyncCSSLoader from './AsyncCSSLoader';

// Providers
import { LanguageProvider } from "./LanguageContext";
import { FilterProvider } from "./FilterContext";
import { check } from "../login";

// Eagerly Loaded Components
import Navbar from "./Navbar";

// Styles
import './customSemantic.less';
import 'semantic-ui-css/semantic.min.css';
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



function App() {
    const [login, setLogin] = useState(false);

    useEffect(() => {
        // Initialize Google Analytics
        ReactGA.initialize('G-21G3CNF1CB');
        ReactGA.send('pageview');

        // Check authentication status
        check().then(r => setLogin(r));
    }, []);

    return (
        <>
        <AsyncCSSLoader /> 
        <LanguageProvider>
            <FilterProvider>
                <React.Fragment>
                    <Navbar />
                    <Router>
                        <Suspense fallback={<div>Loading...</div>}>
                            <Switch>
                                <Route path="/" exact>
                                    {login ? <MainPage /> : <Homev2 />}
                                </Route>
                                <Route path="/home" component={MainPage} />
                                <Route path="/random" component={Random} />
                                <Route path="/user/:username" component={UserPage} />
                                <Route path="/group/:groupname" component={GroupHome} />
                                <Route path="/question/:question" component={TweetDetailPage} />
                                <Route path="/login" exact component={Login} />
                                <Route path="/register" exact component={Register} />
                                <Route path="/logout" exact component={Logout} />
                                <Route path="/bug" exact component={Bug} />
                                <Route path="/impressum" exact component={Imprint} />
                                <Route path="/blog" exact component={Blog} />
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
        </>
    );
}

export default App;
