import React, { Component } from 'react';
import "./gameRoomsPage.css";
import GameRooms from "./gameRooms.jsx";

class GameRoomsPage extends Component {
  render() {
    return (
      <div className="container sub-body">
        <div className="row">
          <div className="col mx-auto">
            <div className="card card-signin my-5">
              <div className="card-body">
                <GameRooms></GameRooms>
              </div>
            </div>
          </div>
        </div>
      </div>);
  }
}

export default GameRoomsPage;