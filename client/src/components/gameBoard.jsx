import React, { Component } from "react";
import MyCamera from "./myCamera.jsx";

class GameBoard extends Component {
  render() {
    // const result = this.props.result;
    const scoreList = this.props.scoreList;
    const timer = this.props.timer;
    const emojiList = this.props.emojiList;
    const ws = this.props.ws;
    const result = this.props.result; // draw or winner's playerId
    return (
      <div className="container">
        <div>
          <MyCamera ws={ws} scoreList={scoreList} timer={timer} />
        </div>
      </div>
    );
  }
}

export default GameBoard;
