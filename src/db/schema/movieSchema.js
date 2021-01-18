const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  createdBy: {
    type: String,
    required: true,
  },
  createdAt: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
    maxlength: 100,
  },
  released: {
    type: String,
    required: true,
  },
  genre: {
    type: [String],
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
});

const Movie = mongoose.model("movie", movieSchema);

module.exports = Movie;
