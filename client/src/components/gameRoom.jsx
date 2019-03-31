import React, { Component } from "react";
import "./gameRooms.css";

class GameRoom extends Component {
  // this is like this.method which binds handlerIncreae to "this"
  // instead of writting bind in constructor
  //   handlerIncrease = () => {
  //     this.setState({ current_users: this.state.current_users + 1 });
  //   };

  render() {
    let str_player = "";
    for (let i = 0; i < this.props.room.users.length; i++) {
      str_player += this.props.room.users[i];
      if (i + 1 < this.props.room.users.length) {
        str_player += " and ";
      }
    }
    return (
      <div
        className="col-lg-6 mbr-col-md-10"
        onClick={() => this.props.onEnter(this.props.room._id)}
      >
        <div className="wrap">
          <div className="ico-wrap">
            <span className="mbr-iconfont room-icon" />
          </div>
          <div className="text-wrap vcenter">
            <h2 className="mbr-fonts-style mbr-bold mbr-section-title3 display-5">
              Room: <span>{this.props.room.owner}</span>
            </h2>
            <p className="mbr-fonts-style text1 mbr-text display-6">
              Players: {str_player}
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default GameRoom;
