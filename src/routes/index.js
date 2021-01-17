const express = require("express");
const joi = require("joi");
const {
  getAuthorizationToken,
  getUserFromToken,
  getMoviesByUser,
  handleMovieCreationRequest,
} = require("../logic");
const {
  MOVIE_LIMIT_REACHED,
  MOVIE_EXISTS,
  MUST_BE_BEARER,
} = require("./../messages");
const { AuthorizationSchemeError, AuthenticationError } = require("./../logic");

const router = express.Router();

function authUserMiddleware(req, res, next) {
  try {
    const token = getAuthorizationToken(req.headers["authorization"]);
    const userDetails = getUserFromToken(token);
    req.userDetails = userDetails;
    return next();
  } catch (err) {
    if (err instanceof AuthorizationSchemeError) {
      return res.status(400).send(MUST_BE_BEARER);
    } else if (err instanceof AuthenticationError) {
      return res.sendStatus(401);
    }
  }
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

const moviePostRequestSchema = joi.object({
  title: joi.string().max(100).required(),
});

router.post("/movies", async (req, res) => {
  try {
    const validationStatus = moviePostRequestSchema.validate(req.body);
    if (validationStatus.error) {
      return res.status(400).send(validationStatus.error);
    }
    const createdMovie = await handleMovieCreationRequest(
      req.body.title,
      req.userDetails
    );
    return res.status(201).json(createdMovie);
  } catch (err) {
    if (err instanceof LimitExceededError) {
      return res.status(403).send(MOVIE_LIMIT_REACHED);
    } else if (err instanceof DuplicateMovieError) {
      return res.status(400).send(MOVIE_EXISTS);
    } else if (err instanceof MovieNotFoundInOmdbError) {
      return res.status(404).send(MOVIE_DOESNT_EXISTS_ON_OMDB);
    }
    return res.status(500);
  }
});

module.exports = { router, authUserMiddleware };
