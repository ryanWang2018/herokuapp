import React, { Component } from "react";
import MyCamera from "./myCamera.jsx";

class EmojiBar extends Component {


  render() {
    let timer = this.props.timer;
    let ws = this.props.ws;
    return (
      <div>
        <MyCamera ws={ws} timer={timer} />
      </div>
    );
  }

  componentDidMount() {
    this.setState({
      currentEmoji: this.props.emojiList[
        Math.floor(Math.random() * this.props.emojiList.length)
      ]
    });
  }
  componentDidUpdate(prevProps) {
    if (
      this.props.timer.timeleft !== prevProps.timer.timeleft &&
      this.props.timer.timeleft % 4 === 0
    ) {
      this.setState({
        currentEmoji: this.props.emojiList[
          Math.floor(Math.random() * this.props.emojiList.length)
        ]
      });
    }
  }
}

export default EmojiBar;
