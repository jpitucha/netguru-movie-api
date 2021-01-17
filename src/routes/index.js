const express = require("express");
const {
  getAuthorizationToken,
  getUserFromToken,
  getMoviesByUser,
  handleMovieCreationRequest,
} = require("../logic");
const { MOVIE_LIMIT_REACHED, MOVIE_EXISTS } = require("./../messages");

const router = express.Router();

// TODO handle errors
function authUserMiddleware(req, res, next) {
  const token = getAuthorizationToken(req.headers["Authorization"]);
  const userDetails = getUserFromToken(token);
  if (!userDetails) return res.sendStatus(400);
  req.userDetails = userDetails;
  return next();
}

router.get("/movies", async (req, res) => {
  try {
    const movieList = await getMoviesByUser(req.userDetails.userId);
    return res.json(movieList);
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
});

router.post("/movies", async (req, res) => {
  try {
    const createdMovie = await handleMovieCreationRequest(
      req.body.title,
      req.userDetails
    );
    return res.json(createdMovie);
  } catch (err) {
    if (err instanceof LimitExceededError) {
      return res.status(403).send(MOVIE_LIMIT_REACHED);
    } else if (err instanceof DuplicateMovieError) {
      return res.status(400).send(MOVIE_EXISTS);
    }
    return res.status(500);
  }
});

module.exports = { router, authUserMiddleware };
