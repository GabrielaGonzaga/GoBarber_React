import React from "react";
import { Switch } from "react-router-dom";
import Route from "./Route";

import SignIn from "../pages/SignIn";
import SignUp from "../pages/SignUp";
import DashBoard from "../pages/DashBoard";
import ForgotPassword from "../pages/ForgotPassword";

const Routes: React.FC = () => (
    <Switch>
        <Route exact path="/" component={SignIn}/>
        <Route path="/signup" component={SignUp}/>
        <Route path="/dashboard" component={DashBoard} isPrivate/>
        <Route path="/forgot" component={ForgotPassword} />
    </Switch>
);

export default Routes;