import React, { Component } from "react";
import * as posenet from "@tensorflow-models/posenet";
import * as tf from "@tensorflow/tfjs";
import * as math from "mathjs";
import "bootstrap/dist/css/bootstrap.min.css";
import Cookies from "js-cookie";

import twoHandUp from "./pic/stick01.png";
import dap from "./pic/stick02.png";
import oneHandUp from "./pic/stick03.png";
import twoHandDown from "./pic/stick04.png";

tf.ENV.set("WEBGL_PACK", false);
class MyCamera extends Component {
  constructor(props) {
    super(props);
    // need to modify
    this.imgArray = [twoHandUp, dap, oneHandUp, twoHandDown];
    // need to modify
    this.imgArray_len = 4;

    this.state = {
      curr_img_index: 0
    };
  }

  isTwoHandUp = (
    l_shoulder_elbow,
    l_elbow_hand,
    l_buttocks_knee,
    l_knee_foot,
    r_shoulder_elbow,
    r_elbow_hand,
    r_buttocks_knee,
    r_knee_foot
  ) => {
    if (
      l_shoulder_elbow > 90.0 &&
      l_shoulder_elbow < 180.0 &&
      l_elbow_hand > 30.0 &&
      l_elbow_hand < 120.0 &&
      r_shoulder_elbow > 30.0 &&
      r_shoulder_elbow < 100.0 &&
      r_elbow_hand > 40.0 &&
      r_elbow_hand < 160.0
    ) {
      return true;
    }
    return false;
  };

  isOneHandUp = (
    l_shoulder_elbow,
    l_elbow_hand,
    l_buttocks_knee,
    l_knee_foot,
    r_shoulder_elbow,
    r_elbow_hand,
    r_buttocks_knee,
    r_knee_foot
  ) => {
    if (
      l_shoulder_elbow > 120.0 &&
      l_shoulder_elbow < 270.0 &&
      l_elbow_hand > 80.0 &&
      l_elbow_hand < 180.0 &&
      r_elbow_hand > 270.0 &&
      r_elbow_hand < 360.0
    ) {
      return true;
    }
    return false;
  };

  isrightlegbend = (
    l_shoulder_elbow,
    l_elbow_hand,
    l_buttocks_knee,
    l_knee_foot,
    r_shoulder_elbow,
    r_elbow_hand,
    r_buttocks_knee,
    r_knee_foot
  ) => {
    if (
      l_shoulder_elbow > 220 &&
      l_shoulder_elbow < 270 &&
      l_buttocks_knee > 250 &&
      l_buttocks_knee < 290 &&
      r_shoulder_elbow > 270 &&
      r_shoulder_elbow < 320 &&
      r_buttocks_knee > 300 &&
      r_buttocks_knee < 360 &&
      r_knee_foot > 250 &&
      r_knee_foot < 280
    ) {
      return true;
    }
    return false;
  };

  isbothlegbend = (
    l_shoulder_elbow,
    l_elbow_hand,
    l_buttocks_knee,
    l_knee_foot,
    r_shoulder_elbow,
    r_elbow_hand,
    r_buttocks_knee,
    r_knee_foot
  ) => {
    if (
      l_shoulder_elbow > 200 &&
      l_shoulder_elbow < 270 &&
      l_elbow_hand > 270 &&
      l_elbow_hand < 310 &&
      l_knee_foot > 250 &&
      l_knee_foot < 340 &&
      r_shoulder_elbow > 270 &&
      r_shoulder_elbow < 320 &&
      r_elbow_hand > 180 &&
      r_elbow_hand < 250 &&
      r_buttocks_knee > 270 &&
      r_buttocks_knee < 330 &&
      r_knee_foot > 260 &&
      r_knee_foot < 300
    ) {
      return true;
    }
    return false;
  };

  isLeftLegBend = (
    l_shoulder_elbow,
    l_elbow_hand,
    l_buttocks_knee,
    l_knee_foot,
    r_shoulder_elbow,
    r_elbow_hand,
    r_buttocks_knee,
    r_knee_foot
  ) => {
    if (
      l_shoulder_elbow > 200 &&
      l_shoulder_elbow < 270 &&
      l_elbow_hand > 200 &&
      l_elbow_hand < 270 &&
      l_buttocks_knee > 230 &&
      l_buttocks_knee < 270 &&
      l_knee_foot > 270 &&
      l_knee_foot < 300 &&
      r_shoulder_elbow > 270 &&
      r_shoulder_elbow < 320 &&
      r_elbow_hand > 270 &&
      r_elbow_hand < 320 &&
      r_buttocks_knee > 250 &&
      r_buttocks_knee < 275
    ) {
      return true;
    }
    return false;
  };

  isDap = (
    l_shoulder_elbow,
    l_elbow_hand,
    l_buttocks_knee,
    l_knee_foot,
    r_shoulder_elbow,
    r_elbow_hand,
    r_buttocks_knee,
    r_knee_foot
  ) => {
    if (
      l_shoulder_elbow > 120.0 &&
      l_shoulder_elbow < 270.0 &&
      l_elbow_hand > 20.0 &&
      l_elbow_hand < 130.0 &&
      r_shoulder_elbow > 10.0 &&
      r_shoulder_elbow < 90.0 &&
      r_elbow_hand > 10.0 &&
      r_elbow_hand < 90.0
    ) {
      return true;
    }
    return false;
  };

  isTwoHandDown = (
    l_shoulder_elbow,
    l_elbow_hand,
    l_buttocks_knee,
    l_knee_foot,
    r_shoulder_elbow,
    r_elbow_hand,
    r_buttocks_knee,
    r_knee_foot
  ) => {
    if (
      l_shoulder_elbow > 180.0 &&
      l_shoulder_elbow < 270.0 &&
      r_shoulder_elbow > 270.0 &&
      r_shoulder_elbow < 360.0
    ) {
      return true;
    }
    return false;
  };

  isrightHandUp = (
    l_shoulder_elbow,
    l_elbow_hand,
    l_buttocks_knee,
    l_knee_foot,
    r_shoulder_elbow,
    r_elbow_hand,
    r_buttocks_knee,
    r_knee_foot
  ) => {
    if (r_shoulder_elbow > 270.0 && r_shoulder_elbow < 360.0) {
      return true;
    }
    return false;
  };

  left_helper = (origin, point) => {
    let dx = point.x - origin.x;
    let dy = origin.y - point.y;
    let degree;

    // at Q1;
    if (dx > 0.0 && dy >= 0.0) {
      if (dy === 0.0) {
        degree = 0.0;
      } else {
        degree = math.atan(dy / dx) * (180.0 / Math.PI);
      }
      // Q2
    } else if (dx <= 0.0 && dy > 0.0) {
      if (dx === 0.0) {
        degree = 90.0;
      } else {
        degree = math.atan(-dx / dy) * (180.0 / Math.PI) + 90.0;
      }
      // Q3
    } else if (dy <= 0.0 && dx <= 0.0) {
      if (dy === 0.0) {
        degree = 180.0;
      } else {
        degree = 360.0 - math.atan(-dx / -dy) * (180.0 / Math.PI) - 90.0;
      }
      // Q4
    } else if (dy < 0.0 && dx > 0.0) {
      degree = 360.0 - math.atan(-dy / dx) * (180.0 / Math.PI);
    }
    return Math.round(degree);
  };

  takePhoto = async () => {
    // var canvas = document.getElementById("canvas");
    // var context = canvas.getContext("2d");
    // context.drawImage(video, 0, 0, 500, 500);
    let curr_img = this.state.curr_img_index;
    let imageElement = document.getElementById("video");
    var imageScaleFactor = 0.5;
    var outputStride = 16;
    var flipHorizontal = false;

    const net = await posenet.load();
    const pose = await net.estimateSinglePose(
      imageElement,
      imageScaleFactor,
      flipHorizontal,
      outputStride
    );
    // should return pose here

    let s = pose.keypoints;

    let l_shoulder_elbow = this.left_helper(s[6].position, s[8].position);
    let l_elbow_hand = this.left_helper(s[8].position, s[10].position);
    let l_buttocks_knee = this.left_helper(s[12].position, s[14].position);
    let l_knee_foot = this.left_helper(s[14].position, s[16].position);

    let r_shoulder_elbow = this.left_helper(s[5].position, s[7].position);
    let r_elbow_hand = this.left_helper(s[7].position, s[9].position);
    let r_buttocks_knee = this.left_helper(s[11].position, s[13].position);
    let r_knee_foot = this.left_helper(s[13].position, s[15].position);

    let checkArray = [
      this.isTwoHandUp,
      this.isDap,
      this.isOneHandUp,
      this.isTwoHandDown
    ];

    if (pose.score <= 0.7) {
      console.log("need full body");
      return false;
    } else {
      let res = checkArray[curr_img](
        l_shoulder_elbow,
        l_elbow_hand,
        l_buttocks_knee,
        l_knee_foot,
        r_shoulder_elbow,

        r_elbow_hand,
        r_buttocks_knee,
        r_knee_foot
      );

      if (res) {
        if (this.props.ws.readyState === WebSocket.OPEN) {
          this.props.ws.send(
            JSON.stringify({
              type: "update",
              from: Cookies.get("username")
            })
          );
        }
      }
    }

    // let res = (this.state.curr_img_index + 1) % this.imgArray_len;
    // this.setState({ curr_img_index: res });
    // return res;
  };

  componentDidMount() {
    let video = document.getElementById("video");
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then(function (stream) {
          //video.src = window.URL.createObjectURL(stream);
          video.srcObject = stream;
          video.play();
        });
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.timer !== prevProps.timer) {
      let curr_img;
      if (
        this.props.timer.timeleft % 4 === 0 &&
        this.props.timer.timeleft !== 60
      ) {
        curr_img = (this.state.curr_img_index + 1) % this.imgArray_len;
        this.setState({ curr_img_index: curr_img });
      }
      if (this.props.timer.timeleft % 4 === 2) {
        this.takePhoto()
          .then()
          .catch(e => {
            console.log(e);
          });
      }
    }
  }

  render() {

    let load_curr = this.imgArray[this.state.curr_img_index];

    return (
      <div className="d-flex flex-row">
        <img id="picture" height="450" width="450" src={load_curr} alt="gesture" />
        <video id="video" className="p-2" width="400" height="400" autoPlay />
      </div>
    );
  }
}
export default MyCamera;
