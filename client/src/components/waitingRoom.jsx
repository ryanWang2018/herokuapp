import React, { Component } from 'react';
import "./waitingRoom.css";
import Cookies from "js-cookie";
class WaitingRoom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chatContent: ""
    };
  }

  render() {
    let playerList = this.props.playerList; //{ playerId: req.session.user._id, point: 0, isReady: false}
    let user0 = playerList[0];
    let user1 = playerList[1];
    let myUserName, opponentUserName;
    if (user0 && Cookies.get("username") === user0.playerId) {
      myUserName = user0.playerId;
    } else if (user1 && Cookies.get("username") === user1.playerId) {
      myUserName = user1.playerId;
    }
    if (user0 && myUserName === user0.playerId && user1) {
      opponentUserName = user1.playerId;
    } else if (user1 && myUserName === user1.playerId && user0) {
      opponentUserName = user0.playerId;
    }
    return (
      <div>
        <div className="row justify-content-md-center  text-center">
          <div className="col-lg-3 col-md-4 col-6">

            <img className="img-fluid img-thumbnail" src="https://source.unsplash.com/pWkk7iiCoDM/400x300" alt="" />
            <p>Player: {(user0) ? user0.playerId : ""}</p>
            {(user0 && user0.isReady) ? <img src="/media/ready.png" alt="ready" /> : <img src="/media/not_ready.png" alt="not ready" />}



          </div>
          <div className="col-md-auto">
            V.S.
          </div>
          <div className="col-lg-3 col-md-4 col-6">

            <img className="img-fluid img-thumbnail" src="https://source.unsplash.com/aob0ukAYfuI/400x300" alt="" />
            <p>
              Player: {user1 ? (user1.playerId) : ""}
            </p>
            {(user1 && user1.isReady) ? <img src="/media/ready.png" alt="ready" /> : <img src="/media/not_ready.png" alt="not ready" />}
          </div>
        </div>

        <div className="row justify-content-md-end  text-center">
          <button className="button-r button5" onClick={this.sendReady}>Ready</button>
        </div>

        <div className="row justify-content-md-center text-center chat-t">
          <div className="col-md-8 col-xl-6 chat">
            <div className="card-w">
              <div className="card-body msg_card_body">
                {this.props.chatContent.map(chat =>
                  (chat.from === opponentUserName)
                    ?
                    <div className="d-flex justify-content-start mb-4">
                      <div className="msg_cotainer">
                        {chat.chatContent}
                      </div>
                    </div>
                    :
                    <div className="d-flex justify-content-end mb-4">
                      <div className="msg_cotainer_send">
                        {chat.chatContent}
                      </div>
                    </div>)
                }
              </div>
              <div className="card-footer">
                <div className="input-group">
                  <textarea name=""
                    type="text"
                    value={this.state.chatContent}
                    onChange={this.handleOnChange}
                    className="form-control type_msg"
                    placeholder="Type your message...">
                  </textarea>
                  <div className="input-group-append">
                    <button className="send_btn" onClick={this.sendChatContent}>send</button>
                  </div>
                </div>
              </div>
            </div>
          </div>


        </div>

      </div >
    );
  }
  sendReady = () => {
    this.props.ws.send(JSON.stringify({
      type: 'ready',
      from: Cookies.get("username"),
      roomId: this.props.roomId
    }));
  }

  sendChatContent = (event) => {
    event.preventDefault();

    this.props.ws.send(JSON.stringify({
      type: 'chat',
      from: Cookies.get("username"),
      content: this.state.chatContent,
      roomId: this.props.roomId
    }));
  }

  handleOnChange = (e) => {
    let chatContent = e.target.value;
    this.setState({ chatContent });
  }
}

export default WaitingRoom;