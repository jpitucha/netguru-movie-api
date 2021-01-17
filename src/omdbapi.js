const { Error } = require("mongoose");
const fetch = require("node-fetch");

class MovieNotFoundInOmdbError extends Error {}

function fetchMovieDetails(title) {
  const hostname = `http://www.omdbapi.com/?apikey=${process.env.OMDB_KEY}&t=${title}`;
  return fetch(hostname).then((resp) => resp.json()).then((json) => {
    if (json.Error) throw MovieNotFoundInOmdbError();
    return json;
  });
}

module.exports = { fetchMovieDetails, MovieNotFoundInOmdbError };
