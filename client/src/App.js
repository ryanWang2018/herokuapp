import React, { Component } from 'react';
import './App.css';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import LoginPage from './components/loginPage';
import RegisterForm from './components/registerForm';
import PrepareRoom from './components/prepareRoom';
import GameRoomsPage from "./components/gameRoomsPage";

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={LoginPage} />

          <Route exact path="/api/register/" component={RegisterForm} />
          <Route exact path="/api/rooms/" component={GameRoomsPage} />
          <Route exact path="/api/rooms/:roomId/" component={PrepareRoom} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
