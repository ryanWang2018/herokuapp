let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let roomSchema = new Schema({

    owner: { // owner's id
        type: String,
        required: true
    },
    users: {
        type: Array,
        required: true
    },
    time: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Rooms", roomSchema);