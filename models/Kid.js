const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create schema

const KidSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  name: {
    type: String,

    required: true,
  },
  age: {
    type: Number,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Kid = mongoose.model('kids', KidSchema);
