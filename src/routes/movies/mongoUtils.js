const Movie = require("./../../db/schema/movieSchema");
const { fetchMovieDetails } = require("./../../omdbapi");
const { BASIC_USER_ROLE } = require("./../../messages");

class LimitExceededError extends Error {}
class DuplicateMovieError extends Error {}

function getCurrentMonthAndYear() {
  const date = new Date();
  return date.getMonth() + "-" + date.getFullYear();
}

async function handleMovieCreationRequest(title, userDetails) {
  if (userDetails.role === BASIC_USER_ROLE) {
    const countCondition = await isUserWithinUsageLimit(userDetails.userId);
    if (!countCondition) throw new LimitExceededError();
  }
  const fetchedMovie = await fetchMovieDetails(title);
  if (await checkIfMovieExists(fetchedMovie)) {
    throw new DuplicateMovieError();
  }
  return createMovie(fetchedMovie, userDetails);
}

async function getMoviesByUser(userID) {
  const movies = await Movie.find({ createdBy: userID }).exec();
  return movies;
}

async function isUserWithinUsageLimit(userID) {
  const count = await Movie.countDocuments({
    createdBy: userID,
    createdAt: getCurrentMonthAndYear(),
  }).exec();
  return count < process.env.BASIC_USER_MOVIE_LIMIT;
}

async function createMovie(fetchedMovie, userDetails) {
  const savedMovie = await Movie.create({
    createdBy: userDetails.userId,
    createdAt: getCurrentMonthAndYear(),
    ...fetchedMovie,
  });
  return savedMovie;
}

async function checkIfMovieExists(fetchedMovie) {
  const matchCount = await Movie.find({ title: fetchedMovie.title })
    .countDocuments()
    .exec();
  return matchCount > 0;
}

module.exports = {
  handleMovieCreationRequest,
  getMoviesByUser,
  LimitExceededError,
  DuplicateMovieError,
};
