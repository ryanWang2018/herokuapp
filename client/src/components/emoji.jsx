import React, { Component } from "react";

import twoHandUp from "./pic/stick01.png";
import dap from "./pic/stick02.png";
import oneHandUp from "./pic/stick03.png";
import twoHandDown from "./pic/stick04.png";

class Emoji extends Component {
  constructor(props) {
    super(props);
    this.imgArray = [twoHandUp, dap, oneHandUp, twoHandDown];
    this.imgArray_len = 4;
    this.state = {
      curr_img_index: 0
    };
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.timer !== prevProps.timer &&
      this.props.timer.timeleft % 4 === 0
    ) {
      let curr_img = (this.state.curr_img_index + 1) % this.imgArray_len;
      this.setState({ curr_img_index: curr_img });
      let result_str = ["isTwoHandUp", "isDap", "isOneHandUp", "isTwoHandDown"];
      console.log(result_str[this.state.curr_img_index]);
    }
  }

  render() {
    // console.log("emoji: " + this.props.url);
    let load_curr = this.imgArray[this.state.curr_img_index];
    //let result_str = ["isTwoHandUp", "isDap", "isOneHandUp", "isTwoHandDown"];

    return (
      <div>
        <img id="picture" height="300" width="300" src={load_curr} />
      </div>
    );
  }
}

export default Emoji;
