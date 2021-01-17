const fetch = require("node-fetch");

function fetchMovieDetails(title) {
  return fetch(
    `http://www.omdbapi.com/?apikey=${process.env.OMDB_KEY}&t=${title}`
  ).then(resp => resp.json());
}

module.exports = { fetchMovieDetails }