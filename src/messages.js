module.exports = {
  INCORRECT_ENV_FILE: ".env file incorrect, bye",
  DB_CONNECTION_ERR: "error while connecting to db",
  MOVIE_LIMIT_REACHED: "user reached limit of saved movies",
  MOVIE_EXISTS: "movie already exists",
  MOVIE_DOES_NOT_EXIST_ON_OMDB: "movie doesn't exist on OMDB",
  MUST_BE_BEARER: "authentication scheme must be 'Bearer'",
  INVALID_FETCH: "fetched data from OMBD are incomplete or malformed",
  APP_RUNNING: `API is running at http://localhost:${process.env.PORT}`,
  BASIC_USER_ROLE: "basic",
  AUTH_TYPE: "Bearer",
  AUTH_HEADER: "authorization",
};
