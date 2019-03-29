let path = require('path');
const mongoose = require("mongoose");

const User = require("./models/users");
const Rooms = require("./models/rooms");

// this is our MongoDB database
const dbRoute = "mongodb+srv://jun:linjun9@facelook-jwbju.mongodb.net/facelook";

// connects our back end code with the database
mongoose.connect(dbRoute, { useNewUrlParser: true });

let db = mongoose.connection;
db.once("open", () => console.log("connected to the database"));
// checks if connection with the database is successful
db.on("error", console.error.bind(console, "MongoDB connection error:"));

exports.getRooms = function(callback) {
    Rooms.find({}).sort({ time: -1 }).limit(6).exec(callback);
};

exports.addRooms = function(owner, callback) {
    Rooms.insertMany({ _id: owner, users: [] }, callback);
};

getRoom = function(roomId, callback) {
    Rooms.findOne({ _id: roomId }, callback);
};

// exports.enterRoom = function(roomId, user, callback) {
//   this.enterRoom(roomId, function(err, room) {
//   })
// }