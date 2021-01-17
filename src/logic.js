const jwt = require("jsonwebtoken");
const Movie = require("./db/schema/movieSchema");
const { fetchMovieDetails } = require("./omdbapi");

function hasDotEnvVars() {
  if (!process.env.MONGO_INITDB_DATABASE) return false;
  if (!process.env.MONGO_INITDB_ROOT_USERNAME) return false;
  if (!process.env.MONGO_INITDB_ROOT_PASSWORD) return false;
  if (!process.env.DB_USERNAME) return false;
  if (!process.env.DB_PASSWORD) return false;
  if (!process.env.DB_URL) return false;
  if (!process.env.PORT) return false;
  if (!process.env.SECRET) return false;
  if (!process.env.OMDB_KEY) return false;
  return true;
}

class DuplicateMovieError extends Error {}
class LimitExceededError extends Error {}

async function handleMovieCreationRequest(title, userDetails) {
  if (userDetails.role === "basic") {
    const countCondition = await isUserWithinUsageLimit(userDetails.userId);
    if (!countCondition) throw new LimitExceededError();
  }
  if (await checkIfMovieExists(title)) {
    throw new DuplicateMovieError();
  }
  return createMovie(title, userDetails);
}

class AuthorizationSchemeError extends Error {}
class AuthenticationError extends Error {}

function getAuthorizationToken(authorizationHeader) {
  if (!/(.+) (.+)/.test(authorizationHeader)) {
    throw new AuthorizationSchemeError();
  }
  const [scheme, token] = authorizationHeader.split(" ");
  if (scheme !== "Bearer") {
    throw new AuthorizationSchemeError();
  }
  return token;
}

function getUserFromToken(token) {
  try {
    const userDetails = jwt.verify(token, process.env.SECRET);
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
  return count < 5;
}

function getCurrentMonthAndYear() {
  const date = new Date();
  return date.getMonth() + "-" + date.getFullYear();
}

async function createMovie(title, userDetails) {
  const fetchedMovie = await fetchMovieDetails(title);
  const savedMovie = await Movie.create({
    createdBy: userDetails.userId,
    createdAt: getCurrentMonthAndYear(),
    Title: fetchedMovie.Title,
    Released: fetchedMovie.Released,
    Genre: fetchedMovie.Genre,
    Director: fetchedMovie.Director,
  });
  return savedMovie;
}

async function checkIfMovieExists(title) {
  const fetchedMovie = await fetchMovieDetails(title);
  const matchCount = await Movie.find({ Title: fetchedMovie.Title })
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
