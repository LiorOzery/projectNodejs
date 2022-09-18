const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    minlength: 5,
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
  },
  description: {
    type: String,
    required: true,
    minlength: 2,
  },
  address: {
    type: String,
    required: true,
    minlength: 2,
  },
  phone: {
    type: String,
    required: true,
    minlength: 9,
    maxlength: 10,
  },
  image: {
    type: String,
    required: true,
    minlength: 2,
  },
  bizNumber: {
    type: Number,
  },
});

const Card = mongoose.model("card", cardSchema);
module.exports = Card;
