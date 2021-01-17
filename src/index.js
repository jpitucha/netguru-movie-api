require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const { hasDotEnvVars } = require("./logic");
const { router, authUserMiddleware } = require("./routes/index");
const dbConnectionProvider = require("./db/dbConnectionProvider");
const { INCORRECT_ENV_FILE, DB_CONNECTION_ERR } = require("./messages");

if (!hasDotEnvVars()) {
  console.log(INCORRECT_ENV_FILE);
  process.exit(1);
}

dbConnectionProvider
  .connectToDatabase()
  .then(() => {
    const app = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use("/", authUserMiddleware, router);

    app.listen(process.env.PORT, () => {
      console.log(`API is running at http://localhost:${process.env.PORT}`);
    });
  })
  .catch(() => {
    console.log(DB_CONNECTION_ERR);
    process.exit(1);
  });
