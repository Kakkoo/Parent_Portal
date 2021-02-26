const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create schema

const WorkSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  name: {
    type: String,
    required: true,
  },
  work: {
    type: String,
    required: true,
  },
  money: {
    type: String,
    required: true,
  },
  status: {
type: String,
default: "assigned",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Work = mongoose.model("works", WorkSchema);
