const express = require("express");
const {
  getAuthorizationToken,
  getUserFromToken,
  getMoviesByUser,
  isUserWithinUsageLimit,
  checkIfMovieExists,
  createMovie,
} = require("../utils");

const router = express.Router();

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
    if (req.userDetails.role === "basic") {
      const countCondition = await isUserWithinUsageLimit(
        req.userDetails.userId
      );
      if (!countCondition)
        return res.json("user reached limit of saved movies");
    }
    if (await checkIfMovieExists(req.body.title)) {
      return res.status(500).send("movie already exists");
    }
    const savedMovie = await createMovie(req.body.title, req.userDetails);
    return res.json(savedMovie);
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
});

module.exports = { router, authUserMiddleware };
