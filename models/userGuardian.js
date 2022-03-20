const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create schema

const UserSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },

  email: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: false,
  },
  avatar: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = User = mongoose.model("users", UserSchema);
