import React, { useEffect }  from "react";
import Homev2 from "./Homev2";
import Random from "./Random";
import Navbar from "./Navbar";
import Login from "./Login";
import Bug from "./Bug";
import Register from "./Register";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import MainPage from "./MainPage";
import {check} from "../login";
import Logout from "./Logout";
import UserSettings from "./UserSettings";
import NotFound from "./NotFound"
import UserPage from "./UserPage"
import GroupHome from "./GroupHome"
import TweetDetailPage from "./TweetDetailPage"
import "./theme.css"
import ReactGA from 'react-ga4';


function App() {
    let [login, setLogin] = React.useState(false);

    useEffect(() => {
        ReactGA.initialize('G-21G3CNF1CB');
        ReactGA.send('pageview');
      }, []);

    check().then(r => setLogin(r))

    return (
        <React.Fragment>
            <Navbar />
            <Router>
                <Switch>
                    <Route path="/" exact>
                        {login ? <MainPage/> : <Homev2/>}
                    </Route>
                    <Route path="/home" component={MainPage}/>
                    <Route path="/random" component={Random}/>
                    <Route path="/user/:username" component={UserPage}/>
                    <Route path="/group/:groupname" component={GroupHome}/>
                    <Route path="/question/:question" component={TweetDetailPage}/>
                    <Route path="/login" exact component={Login}/>
                    <Route path="/register" exact component={Register}/>
                    <Route path="/logout" exact component={Logout}/>
                    <Route path="/settings" exact component={UserSettings}/>
                    <Route path="/bug" exact component={Bug}/>
                    <Route component={NotFound} />
                </Switch>
            </Router>
        </React.Fragment>
    );
}

export default App;
