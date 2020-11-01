import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import about from "./pages/Home/about";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Dashboard from "./pages/Dashboard/Dashboard";
import Event from "./pages/Dashboard/eventPage/Event";
import TopNav from "./layouts/TopNav";
import MyRegistration from "./pages/Myregistration/MyRegistration";
import NotFound from "./NotFound";

export default function routes() {
  return (
    <BrowserRouter>
      <TopNav />
      <Switch>
        <Route exact path="/" component={Dashboard} />
        <Route exact path="/registration" component={MyRegistration} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
        <Route path="/about" component={about} />
        <Route exact path="/home" component={Home} />
        <Route path="/events" component={Event} />
        <Route component={NotFound} />
      </Switch>
    </BrowserRouter>
  );
}