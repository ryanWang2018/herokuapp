import React, { Component } from "react";
import Timer from "./timer.jsx";
import "./score.css";
class Scores extends Component {
  render() {
    const scoreList = this.props.scoreList; // [{playerId: "", point:""}]
    const timer = this.props.timer; // {timeleft: 0}
    return (
      <div className="scorePanel">
        <div className="scoreHead">
          <h2 className="socreText">{scoreList[0].playerId}</h2>
          <h2 className="socreText">{scoreList[1].playerId}</h2>
        </div>
        <div className="scoreBody">
          <div className="scoreLeft bodyItem">
            <h4 className="socreText">Score</h4>
            <h2 className="textElement">{scoreList[0].point}</h2>
          </div>
          <div className="scoreMiddle bodyItem">
            <h4 className="socreText">TimeLeft</h4>
            <h2 className="textElement">{timer.timeleft}</h2>
          </div>
          <div className="scoreRight bodyItem">
            <h4 className="socreText">Score</h4>
            <h2 className="textElement">{scoreList[1].point}</h2>
          </div>
        </div>
      </div>
    );
  }
}

export default Scores;
