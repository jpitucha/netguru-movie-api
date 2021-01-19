require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const { hasDotEnvVars, authUserMiddleware } = require("./auth");
const { router } = require("./routes/movies/index");
const dbConnectionProvider = require("./db/dbConnectionProvider");
const {
  INCORRECT_ENV_FILE,
  DB_CONNECTION_ERR,
  APP_RUNNING,
} = require("./messages");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const logger = require("./logger");

const swaggerDocument = YAML.load("./src/swagger.yaml");

if (!hasDotEnvVars()) {
  logger.error(INCORRECT_ENV_FILE);
  process.exit(1);
}

dbConnectionProvider
  .connectToDatabase()
  .then(() => {
    const app = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
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
