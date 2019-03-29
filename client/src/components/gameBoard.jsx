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
        <Result result={result} className="row" />
        <div>
          <EmojiBar
            ws={ws}
            emojiList={emojiList}
            timer={timer}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh"
            }}
          />
        </div>
      </div>
    );
  }
}

export default GameBoard;
