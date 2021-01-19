require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const { getAuthorizationToken, getUserFromToken } = require("./auth");
const { router } = require("./routes/movies/index");
const dbConnectionProvider = require("./db/dbConnectionProvider");
const morgan = require("morgan");
const {
  INCORRECT_ENV_FILE,
  DB_CONNECTION_ERR,
  APP_RUNNING,
  AUTH_HEADER,
  MUST_BE_BEARER,
} = require("./messages");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const logger = require("./logger");

const swaggerDocument = YAML.load("./src/swagger.yaml");

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

if (!hasDotEnvVars()) {
  logger.error(INCORRECT_ENV_FILE);
  process.exit(1);
}

class AuthorizationSchemeError extends Error {}
class AuthenticationError extends Error {}

function authUserMiddleware(req, res, next) {
  try {
    const token = getAuthorizationToken(req.headers[AUTH_HEADER]);
    const userDetails = getUserFromToken(token);
    req.userDetails = userDetails;
    return next();
  } catch (err) {
    console.log(err);
    if (err instanceof AuthorizationSchemeError) {
      return res.status(400).send(MUST_BE_BEARER);
    } else if (err instanceof AuthenticationError) {
      return res.sendStatus(401);
    }
  }
}

dbConnectionProvider
  .connectToDatabase()
  .then(() => {
    const app = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(morgan("combined", { stream: logger.stream }));
    app.use(
      "/api-docs",
      swaggerUi.serve,
      swaggerUi.setup(swaggerDocument, { explorer: true })
    );
    app.use("/", authUserMiddleware, router);

    app.listen(process.env.PORT, "0.0.0.0", () => {
      logger.info(APP_RUNNING);
    });
  })
  .catch(() => {
    logger.error(DB_CONNECTION_ERR);
    process.exit(1);
  });
