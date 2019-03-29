import React, { Component } from "react";
import Scores from "./scores.jsx";
import Result from "./result.jsx";
import EmojiBar from "./emojiBar.jsx";

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
        <div className="row">
          <Scores scoreList={scoreList} timer={timer}></Scores>
        </div>
        <Result result={result} className="row"></Result>
        <div >
          <EmojiBar ws={ws} emojiList={emojiList} timer={timer} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}></EmojiBar>
        </div>

      </div>
    );
  }
}

export default GameBoard;
