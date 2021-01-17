const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  createdBy: String,
  createdAt: String,
  title: String,
  released: String,
  genre: [String],
  director: String,
});

const Movie = mongoose.model("movie", movieSchema);

module.exports = Movie;
