const jwt = require("jsonwebtoken");
const Movie = require("./db/schema/movieSchema");
const { fetchMovieDetails } = require("./omdbapi");
const { BASIC_USER_ROLE, AUTH_TYPE } = require("./messages");

function hasDotEnvVars() {
  if (!process.env.MONGO_INITDB_DATABASE) return false;
  if (!process.env.MONGO_INITDB_ROOT_USERNAME) return false;
  if (!process.env.MONGO_INITDB_ROOT_PASSWORD) return false;
  if (!process.env.DB_USERNAME) return false;
  if (!process.env.DB_PASSWORD) return false;
  if (!process.env.DB_URL) return false;
  if (!process.env.PORT) return false;
  if (!process.env.JWT_SECRET) return false;
  if (!process.env.OMDB_KEY) return false;
  if (!process.env.BASIC_USER_MOVIE_LIMIT) return false;
  return true;
}

class DuplicateMovieError extends Error {}
class LimitExceededError extends Error {}

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

class AuthorizationSchemeError extends Error {}
class AuthenticationError extends Error {}

function getAuthorizationToken(authorizationHeader) {
  if (!/(.+) (.+)/.test(authorizationHeader)) {
    throw new AuthorizationSchemeError();
  }
  const [scheme, token] = authorizationHeader.split(" ");
  if (scheme !== AUTH_TYPE) {
    throw new AuthorizationSchemeError();
  }
  return token;
}

function getUserFromToken(token) {
  try {
    const userDetails = jwt.verify(token, process.env.JWT_SECRET);
    return userDetails;
  } catch (err) {
    throw new AuthenticationError();
  }
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

function getCurrentMonthAndYear() {
  const date = new Date();
  return date.getMonth() + "-" + date.getFullYear();
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
  hasDotEnvVars,
  getUserFromToken,
  getMoviesByUser,
  fetchMovieDetails,
  getCurrentMonthAndYear,
  getAuthorizationToken,
  handleMovieCreationRequest,
  DuplicateMovieError,
  LimitExceededError,
  AuthorizationSchemeError,
  AuthenticationError,
};
