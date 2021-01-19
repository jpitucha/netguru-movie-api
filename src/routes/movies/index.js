const express = require("express");
const joi = require("joi");
const {
  LimitExceededError,
  DuplicateMovieError,
  getMoviesByUser,
  handleMovieCreationRequest,
} = require("./../movies/mongoUtils");
const {
  MOVIE_LIMIT_REACHED,
  MOVIE_EXISTS,
  MOVIE_DOES_NOT_EXIST_ON_OMDB,
  INVALID_FETCH,
} = require("../../messages");
const { MovieNotFoundInOmdbError } = require("../../omdbapi");
const { ValidationError } = require("mongoose").Error;
const logger = require("./../../logger");

const router = express.Router();

router.get("/movies", async (req, res) => {
  try {
    const movieList = await getMoviesByUser(req.userDetails.userId);
    return res.json(movieList);
  } catch (err) {
    logger.error(err);
    return res.sendStatus(500);
  }
});

const moviePostRequestSchema = joi.object({
  title: joi.string().trim().max(200).required(),
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
    }
    if (err instanceof DuplicateMovieError) {
      return res.status(400).send(MOVIE_EXISTS);
    }
    if (err instanceof MovieNotFoundInOmdbError) {
      return res.status(404).send(MOVIE_DOES_NOT_EXIST_ON_OMDB);
    }
    if (err instanceof ValidationError) {
      return res.status(500).send(INVALID_FETCH);
    }
    return res.status(500);
  }
});

module.exports = { router };
