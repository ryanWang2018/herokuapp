/*jshint esversion: 6 */
// required package ----------------------------
const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const fs = require("fs");
const path = require("path");
const validator = require("validator");
const crypto = require("crypto");
const cookie = require("cookie");
const session = require("express-session");

// local files ------------------------------------------
const User = require("./backend/models/users");
const Rooms = require("./backend/models/rooms");

// global variables ------------------------------------------
const app = express();
const router = express.Router();

// this is our MongoDB database
const dbRoute = "mongodb+srv://jun:linjun9@facelook-jwbju.mongodb.net/facelook";
// connects our back end code with the database
mongoose.connect(dbRoute, { useNewUrlParser: true });
let db = mongoose.connection;
db.once("open", () => console.log("connected to the database"));
// checks if connection with the database is successful
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// (optional) only made for logging and
// bodyParser, parses the request body to be a readable json format
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger("dev"));
app.use(express.static(path.join(__dirname, "client/build")));
// security --------------------------------------
function generateSalt() {
  return crypto.randomBytes(16).toString("base64");
}

function generateHash(password, salt) {
  let hash = crypto.createHmac("sha512", salt);
  hash.update(password);
  return hash.digest("base64");
}

const sessionParser = session({
  secret: "please change this secret",
  resave: false,
  saveUninitialized: true,
  cookie: { httpOnly: true, sameSite: ture }
});

app.use(sessionParser);
let isAuthenticated = function(req, res, next) {
  if (!req.session.user) return res.status(401).end("access denied");
  next();
};
let checkUsername = function(req, res, next) {
  if (!validator.isAlphanumeric(req.body.username))
    return res.status(400).end("bad input");
  next();
};
let sanitizeContent = function(req, res, next) {
  req.body.content = validator.escape(req.body.content);
  next();
};
let checkId = function(req, res, next) {
  if (!validator.isAlphanumeric(req.params.id))
    return res.status(400).end("bad input");
  next();
};

// https://www.npmjs.com/package/axios  cors header need to fix
app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

// session user && session room
app.use(function(req, res, next) {
  req.user = "user" in req.session ? req.session.user : null;
  let username = req.user ? req.user._id : "";
  res.setHeader(
    "Set-Cookie",
    cookie.serialize("username", username, {
      path: "/",
      maxAge: 60 * 60 * 24 * 7 // 1 week in number of seconds
    })
  );
  console.log("HTTP request", username, req.method, req.url, req.body);
  next();
});

app.use(function(req, res, next) {
  req.room = "room" in req.session ? req.session.room : null;
  next();
});

router.get("/rooms/", isAuthenticated, function(req, res, next) {
  // find the last room in the DB.
  Rooms.find({})
    .sort({ time: -1 })
    .limit(6)
    .exec(function(err, rooms) {
      if (err) return res.status(500).end(err);
      Rooms.find({})
        .count()
        .exec(function(err, total) {
          return res.json({ rooms, total });
        });
    });
});

var longpoll = require("express-longpoll")(app);
longpoll.create("/api/rooms/longpolling/");
process.setMaxListeners(0);

// function pageHelp(pageNum) {
//   Rooms.find({})
//     .sort({ time: -1 })
//     .skip((pageNum - 1) * 6)
//     .limit(6)
//     .exec(function(err, rooms) {
//       if (err) return res.status(500).end(err);
//       console.log(rooms);
//       longpoll.publish("/api/rooms/longpolling/", rooms);
//     });
// }
// add room
router.post("/room/", isAuthenticated, function(req, res) {
  //let pageNum = req.param.pagenum;
  let owner = req.user._id; // id is the owner id
  let users = [];
  Rooms.insertMany({ owner: owner, users: users }, function(err, insertedRoom) {
    if (err) return res.status(500).end("Failed creating new room");
    Rooms.find({})
      .sort({ time: -1 })
      .exec(function(err, rooms) {
        if (err) return res.status(500).end(err);
        longpoll.publish("/api/rooms/longpolling/", rooms);
        return res.json(insertedRoom[0]);
      });
  });
});

router.get("/rooms/:page/", function(req, res, next) {
  let pageId = req.params.page;
  Rooms.find({})
    .sort({ time: -1 })
    .skip((pageId - 1) * 6)
    .limit(6)
    .exec(function(err, rooms) {
      if (err) return res.status(500).end(err);
      return res.json(rooms);
    });
});

router.post("/rooms/nextPage", function(req, res, next) {
  let lst_room = req.body.last;
  Rooms.find({
    time: {
      $lt: lst_room.time
    }
  })
    .sort({ time: -1 })
    .limit(6)
    .exec(function(err, rooms) {
      if (err) return res.status(500).end(err);

      return res.json(rooms);
    });
});

router.post("/rooms/lastPage/", function(req, res, next) {
  let first = req.body.first;
  Rooms.find({
    time: {
      $gt: first.time
    }
  })
    .sort({ time: 1 })
    .limit(6)
    .sort({ time: -1 })
    .exec(function(err, rooms) {
      if (err) return res.status(500).end(err);
      return res.json(rooms);
    });
});

router.delete("/room/:id/", isAuthenticated, function(req, res, next) {
  let id = req.params.id;
  // find the last room in the DB.
  Rooms.find({ _id: id }, function(err, room) {
    if (err) return res.status(500).end(err);
    if (!room)
      return res.status(401).end("We do not find the matched room id.");
    if (id !== req.user._id) return res.status(401).end("Access denied.");
    Rooms.deleteOne({ _id: id }, function(err, deleted) {
      if (err) return res.status(500).end(500);
      return res.json("room deleted");
    });
  });
});

var checkUseremail = function(req, res, next) {
  if (!validator.isEmail(req.body.email))
    return res.status(400).end("bad input");
  next();
};
var checkUserInputName = function(req, res, next) {
  if (
    !validator.isAlphanumeric(req.body.username) ||
    !validator.isAlphanumeric(req.body.first_name) ||
    !validator.isAlphanumeric(req.body.last_name)
  )
    return res.status(400).end("bad input");
  next();
};
router.post("/register", checkUserInputName, checkUseremail, function(
  req,
  res,
  next
) {
  if (!("username" in req.body))
    return res.status(400).end("username is missing");
  if (!("password" in req.body))
    return res.status(400).end("password is missing");
  var username = req.body.username;
  var password = req.body.password;
  var email = req.body.email;
  var first_name = req.body.first_name;
  var last_name = req.body.last_name;
  var salt = generateSalt();
  var hash = generateHash(password, salt);

  // insert new user into the database
  User.findOne({ _id: username }, function(err, user) {
    if (err) return res.status(500).end(err);
    if (user)
      return res
        .status(401)
        .end(username + " exists already, try another name");
    User.insertMany(
      [
        {
          _id: username,
          hash: hash,
          salt: salt,
          email: email,
          first_name: first_name,
          last_name: last_name
        }
      ],
      function(err, result) {
        if (err) {
          return res.status(500).end("insertion error");
        }
        return res.json(user);
      }
    );
  });
});

var checkUsername = function(req, res, next) {
  if (!validator.isAlphanumeric(req.body.username))
    return res.status(400).end("bad input");
  next();
};
router.post("/signin/", checkUsername, function(req, res, next) {
  let username = req.body.username;
  let password = req.body.password;

  User.findOne({ _id: username }, function(err, user) {
    if (err)
      return res.status(500).end("server error, please try again later.");
    if (!user) return res.status(401).end("user does not exist");
    if (user.hash !== generateHash(password, user.salt))
      return res.status(401).end("username and password do not match");
    req.session.user = user;

    // initialize cookie
    res.setHeader(
      "Set-Cookie",
      cookie.serialize("username", username, {
        path: "/",
        maxAge: 60 * 60 * 24 * 7
      })
    );
    return res.json(user);
  });
});

router.get("/signout/", isAuthenticated, function(req, res, next) {
  req.session.destroy();

  res.setHeader(
    "Set-Cookie",
    cookie.serialize("username", "", {
      path: "/",
      maxAge: 60 * 60 * 24 * 7
    })
  );
  return res.redirect("/");
});

router.post("/GoogleSignin/", function(req, res, next) {
  let username = req.body.name;
  let user = { _id: username };
  req.session.user = user;
  // initialize cookie
  res.setHeader(
    "Set-Cookie",
    cookie.serialize("username", username, {
      path: "/",
      maxAge: 60 * 60 * 24 * 7
    })
  );
  return res.json(username);
});

router.get("/user", function(req, res, next) {
  if (req.session.user) {
    return res.json(req.session.user);
  } else {
    return res.status(401).end("Not sign in");
  }
});

// //enter room
router.post("/room/:id/enter/", isAuthenticated, function(req, res, next) {
  let id = req.params.id;
  //let pageNum = req.params.pageNum;
  Rooms.findOne({ _id: id }, function(err, room) {
    if (err) return res.status(500).end(err);
    if (!room) return res.status(401).end("We do not find the match room.");
    if (room.users.includes(req.user._id))
      return res.status(404).end("bad request");
    if (room.users.length >= 2) return res.status(401).end("room is full");
    room.users.push(req.user._id);
    Rooms.updateOne(
      { _id: id },
      { users: room.users, owner: room.users[0] },
      function(err, result) {
        if (err) return res.status(500).end(err);
        req.session.room = room;
        Rooms.find({})
          .sort({ time: -1 })
          .exec(function(err, rooms) {
            if (err) return res.status(500).end(err);
            longpoll.publish("/api/rooms/longpolling/", rooms);
            return res.json(room);
          });
      }
    );
  });
});

//leave room
router.post("/room/:id/leave/", isAuthenticated, function(req, res, next) {
  let id = req.params.id;

  console.log("leave room ", id);
  Rooms.findOne({ _id: id }, function(err, room) {
    if (err) return res.status(500).end(err);
    if (!room) return res.status(401).end("We do not find the match room.");
    if (!room.users.includes(req.user._id))
      return res.status(404).end("bad request");
    room.users.pull(req.user._id);
    req.session.room = null;
    if (room.users.length === 0) {
      Rooms.deleteOne({ _id: id }, function(err, deleted) {
        if (err) return res.status(500).end(500);
        Rooms.find({})
          .sort({ time: -1 })
          .exec(function(err, rooms) {
            if (err) return res.status(500).end(err);
            longpoll.publish("/api/rooms/longpolling/", rooms);
            return res.json("room deleted");
          });
      });
    } else {
      Rooms.updateOne(
        { _id: id },
        { users: room.users, owner: room.users[0] },
        function(err, result) {
          if (err) return res.status(500).end(err);
          Rooms.find({})
            .sort({ time: -1 })
            .exec(function(err, rooms) {
              if (err) return res.status(500).end(err);
              longpoll.publish("/api/rooms/longpolling/", rooms);
              return res.json(room);
            });
        }
      );
    }
  });
});

// append /api for our http requests
app.use("/api", router);
// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});

const expressWs = require("express-ws")(app);
// const http = require("http");

let connects = [];
router.ws("/rooms/:roomId", function(ws, req) {
  // create roomConnection/add ws to existing roomConnection
  let roomConnection = connects.find(c => c.roomId === req.params.roomId);

  if (!roomConnection) {
    let roomState = { players: [], gameState: "", timeleft: 0, winners: [] };
    let newPlayer = {
      playerId: req.session.user._id,
      point: 0,
      isReady: false
    };
    roomState.players.push(newPlayer);
    roomConnection = {
      roomId: req.params.roomId,
      connections: [ws],
      roomState: roomState
    };
    connects.push(roomConnection);
    roomConnection.roomState.gameState = "wait";
    // tell players in room
    ws.send(
      JSON.stringify({
        type: "roomState",
        from: "admin",
        roomState: roomConnection.roomState
      })
    );
  } else if (roomConnection && roomConnection.connections.length >= 2) {
    ws.send(
      JSON.stringify({
        type: "error",
        from: "admin",
        reason: "room is full"
      })
    );
  } else {
    let newPlayer = {
      playerId: req.session.user._id,
      point: 0,
      isReady: false
    };
    roomConnection.roomState.players.push(newPlayer);
    roomConnection.connections.push(ws);
    roomConnection.roomState.gameState = "wait";
    roomConnection.roomState.winners = [];
    roomConnection.connections.forEach(player => {
      player.send(
        JSON.stringify({
          type: "roomState",
          from: "admin",
          roomState: roomConnection.roomState
        })
      );
    });
  }

  ws.on("message", function(message) {
    let msg = "";
    try {
      msg = JSON.parse(message);
    } catch (e) {
      msg = "";
    }
    let type = msg ? msg.type : null;
    // let msg = JSON.parse(message.data);
    switch (type) {
      case "leave":
        roomConnection.roomState.players = roomConnection.roomState.players.filter(
          p => p.playerId !== req.session.user._id
        );
        roomConnection.connections = roomConnection.connections.filter(
          c => c !== ws
        );
        if (roomConnection.roomState.gameState === "gamming") {
          roomConnection.roomState.gameState = "end";
          roomConnection.roomState.players.forEach(p => {
            p.isReady = false;
          });
          clearInterval(roomConnection.timeUpdater);
          clearTimeout(roomConnection.timeOut);
          roomConnection.roomState.winners = roomConnection.roomState.players;
          roomConnection.connections.forEach(client => {
            client.send(
              JSON.stringify({
                type: "roomState",
                from: "admin",
                roomState: roomConnection.roomState
              })
            );
          });
        } else {
          roomConnection.connections.forEach(client => {
            client.send(
              JSON.stringify({
                type: "roomState",
                from: "admin",
                roomState: roomConnection.roomState
              })
            );
          });
        }
        break;
      case "chat":
        roomConnection.connections.forEach(client => {
          client.send(
            JSON.stringify({
              type: "chat",
              from: req.session.user._id,
              chatContent: msg.content
            })
          );
        });
        break;

      case "ready":
        // get the user from session instead of client data
        // add the client to the connection list
        let readyPlayers = roomConnection.roomState.players.filter(
          p => p.isReady
        );
        let readyPlayerIds = readyPlayers.map(p => p.playerId);
        if (!readyPlayerIds.includes(req.session.user._id)) {
          let p = roomConnection.roomState.players.find(
            p => p.playerId === req.session.user._id
          );
          p.isReady = true;
          p.point = 0;
          // roomConnection.roomState.players.push(newPlayer);
        }
        let numOfReady = roomConnection.roomState.players.filter(p => p.isReady)
          .length;
        if (numOfReady === 1) {
          roomConnection.roomState.gameState = "wait";
          roomConnection.connections.forEach(player => {
            player.send(
              JSON.stringify({
                type: "roomState",
                from: "admin",
                roomState: roomConnection.roomState
              })
            );
          });
        } else if (numOfReady === 2) {
          // send start signal to all players in room
          roomConnection.roomState.gameState = "gamming";
          roomConnection.roomState.timeleft = 60;
          roomConnection.roomState.winners = [];
          roomConnection.connections.forEach(player => {
            player.send(
              JSON.stringify({
                type: "roomState",
                from: "admin",
                roomState: roomConnection.roomState
              })
            );
          });
          // update timer every sec
          roomConnection.timeUpdater = setInterval(() => {
            roomConnection.roomState.timeleft =
              roomConnection.roomState.timeleft - 1;

            roomConnection.connections.forEach(client => {
              client.send(
                JSON.stringify({
                  type: "roomState",
                  from: "admin",
                  roomState: roomConnection.roomState
                })
              );
            });
          }, 1000);
          // timeout
          roomConnection.timeOut = setTimeout(() => {
            clearInterval(roomConnection.timeUpdater);
            roomConnection.roomState.gameState = "end";
            roomConnection.roomState.players.forEach(p => {
              p.isReady = false;
            });
            let maxPoint = Math.max.apply(
              Math,
              roomConnection.roomState.players.map(function(o) {
                return o.point;
              })
            );

            let winners = roomConnection.roomState.players.filter(e => {
              return e.point === maxPoint;
            });
            roomConnection.roomState.winners = winners;
            roomConnection.connections.forEach(client => {
              client.send(
                JSON.stringify({
                  type: "roomState",
                  from: "admin",
                  roomState: roomConnection.roomState
                })
              );
            });
          }, 60999);
        } else {
          // room full;

          ws.send(
            JSON.stringify({
              type: "error",
              from: "admin",
              reason: "room is full"
            })
          );
        }
        break;
      case "update":
        let targetPlayer = roomConnection.roomState.players.find(
          p => p.playerId === req.session.user._id
        );
        targetPlayer.point++;

        // check username with session, if pass
        roomConnection.connections.forEach(client => {
          client.send(
            JSON.stringify({
              type: "roomState",
              from: "admin",
              roomState: roomConnection.roomState
            })
          );
        });
        break;
      default:
        //error
        ws.send(JSON.stringify("Bad Request: nice try"));
    }
  });

  ws.on("close", function() {
    let i = roomConnection.connections.indexOf(ws);
    roomConnection.connections.splice(i, 1);
    if (roomConnection.connections.length === 0) {
      connects = connects.filter(conn => {
        return conn.roomId === roomConnection.roomId ? false : true;
      });
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, err => {
  if (err) console.log(err);
  else console.log("HTTP server on http://localhost:%s", PORT);
});
