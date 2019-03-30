import React, { Component } from "react";
import GameRoom from "./gameRoom.jsx";
import api from "./api.js";
import { Redirect } from "react-router";
import "./gameRooms.css";
import ErrorMessage from "./errorMessage.jsx";

class GameRooms extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rooms: [],
      time: Date.now(),
      // exit: false,
      inRoom: "",
      error: { content: "", shown: "" },
      totalRooms: [1],
      curr_page: 1
    };
  }

  handlerGetRoomsLongPolling() {
    api
      .get("/rooms/longpolling/", null)
      .then(res => {
        let rooms = res.data;
        this.setState({ rooms });
        this.handlerGetRoomsLongPolling();
      })
      .catch(err => {
        console.log(err);
      });
  }

  getNextPage = () => {
    let curr_rooms = this.state.rooms;
    let lastroom = curr_rooms[curr_rooms.length - 1];

    if (curr_rooms.length == 6) {
      api
        .post("/rooms/nextPage", { last: lastroom })
        .then(res => {
          console.log(res);
          this.setState({ rooms: res.data });
          this.setState({ curr_page: this.state.curr_page + 1 });
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      console.log("this is the last page");
    }
  };

  getLastPage = () => {
    let curr_rooms = this.state.rooms;
    api
      .post("/rooms/lastPage/", { first: curr_rooms[0] })
      .then(res => {
        let result = res.data;
        console.log(result);
        if (result.length > 0) {
          this.setState({ rooms: res.data });
          this.setState({ curr_page: this.state.curr_page - 1 });
        } else {
          console.log("this is the ever first page");
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  handleAddRoom = curr_page => {
    //add the updated rooms into database
    api
      .post("/room/" + curr_page + "/", null)
      .then(res => {
        //enter created room
        console.log(res);
        this.enterRoom(res.data._id);
      })
      .catch(err => {
        if (err.response) {
          this.handleOnError(err.response.data);
        } else {
          this.handleOnError(err.message);
        }
      });
  };

  handlerGetRooms() {
    api
      .get("/rooms/", null)
      .then(res => {
        //console.log(res);
        let rooms = res.data.rooms;
        this.setState({ rooms });
        let total = res.data.total;
        total = Math.floor(total / 6) + 1;
        let lst = [];
        for (let i = 1; i <= total; i++) {
          lst.push(i);
        }
        this.setState({ totalRooms: lst });
      })
      .catch(err => {
        console.log(err);
      });
  }

  // handlerDelete = room => {
  //   api
  //     .delete("/room/" + room._id + "/")
  //     .then(res => {
  //       let rooms = res.data;
  //       // this.setState({ rooms });
  //     })
  //     .catch(err => {
  //       console.log(err);
  //     });
  // };

  handlerClick = roomId => {
    console.log("room is clicked", roomId);
  };

  enterRoom = roomId => {
    api
      .post("/room/" + roomId + "/enter/")
      .then(res => {
        this.setState({ inRoom: res.data._id });
      })
      .catch(err => {
        if (err.response) {
          this.handleOnError(err.response.data);
        } else {
          this.handleOnError(err.message);
        }
      });
  };

  componentDidMount() {
    this.handlerGetRooms();
    this.handlerGetRoomsLongPolling();
  }
  // clean up data before something is removed from DOM.
  componentWillUnmount() {
    clearInterval(this.interval);
  }

  handleSignOut = () => {
    //add the updated rooms into database
    api
      .get("/signout/")
      .then(res => {
        console.log(res);
        // this.setState({ exit: true });
      })
      .catch(err => {
        console.log(err);
      });
  };

  setPage = room => {
    if (room === this.state.curr_page) {
      return "btn btn-primary";
    } else {
      return "btn btn-secondary";
    }
  };
  selectPage = room => {
    this.setState({ curr_page: room });
    api
      .get("/rooms/" + room + "/")
      .then(res => {
        this.setState({ rooms: res.data });
      })
      .catch(err => {
        console.log(err);
      });
  };

  handleOnError = (err, shown) => {
    let error = { ...this.state.error };
    error.content = err;
    error.shown = "alert alert-primary";
    this.setState({ error });
  };

  render() {
    if (this.state.inRoom)
      return <Redirect to={"/api/rooms/" + this.state.inRoom} />;
    return (
      <div>
        <a
          href="/"
          className="btn btn-lg btn-danger"
          onClick={this.handleSignOut}
        >
          <span className="glyphicon glyphicon-chevron-left" /> Sign Out
        </a>
        <ErrorMessage onChange={this.handleOnError} error={this.state.error} />
        <div className="d-flex flex-wrap">
          {this.state.rooms.map(room => (
            <GameRoom
              key={room._id}
              onRoomClick={this.handlerClick}
              onRoomDelete={this.handlerDelete}
              onEnter={this.enterRoom}
              room={room}
            />
          ))}
        </div>

        <div className="d-flex flex-row justify-content-sm-between">
          <button className="p-2 btn-info" onClick={this.getLastPage}>
            &laquo;
          </button>

          {this.state.totalRooms.map(room => (
            <button
              className={this.setPage(room)}
              key={room}
              onClick={() => this.selectPage(room)}
            >
              {room}
            </button>
          ))}
          <button className="p-2 btn-info" onClick={this.getNextPage}>
            &raquo;
          </button>
        </div>

        <button
          onClick={() => this.handleAddRoom(this.state.curr_page)}
          className="btn btn-lg btn-danger"
        >
          Create Room
        </button>
      </div>
    );
  }
}

export default GameRooms;
