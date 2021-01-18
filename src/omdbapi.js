const { Error } = require("mongoose");
const fetch = require("node-fetch");

class MovieNotFoundInOmdbError extends Error {}

function fetchMovieDetails(title) {
  const hostname = `https://www.omdbapi.com/?apikey=${process.env.OMDB_KEY}&t=${title}`;
  return fetch(hostname)
    .then((resp) => resp.json())
    .then((json) => {
      if (json.Error) throw MovieNotFoundInOmdbError();
      return {
        title: json.Title,
        released: json.Released,
        genre: json.Genre.split(", "),
        director: json.Director,
      };
    });
}

module.exports = { fetchMovieDetails, MovieNotFoundInOmdbError };
