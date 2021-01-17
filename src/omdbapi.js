const fetch = require("node-fetch");

function fetchMovieDetails(title) {
  const hostname = `http://www.omdbapi.com/?apikey=${process.env.OMDB_KEY}&t=${title}`;
  return fetch(hostname).then((resp) => resp.json());
}

module.exports = { fetchMovieDetails };
