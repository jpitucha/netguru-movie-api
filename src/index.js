const express = require('express')
const bodyParser = require('body-parser')
const Utilities = require('./utils/index')
const routes = require('./routes/index')
const dbConnectionProvider = require('./db/dbConnectionProvider')

require('dotenv').config()

if (!Utilities.hasDotEnvVars()) {
    console.log('.env file incorrect, bye')
    process.exit(1)
}

dbConnectionProvider.connectToDatabase()
    .then(() => {

        const app = express()
        app.use(bodyParser.json())
        app.use(bodyParser.urlencoded({ extended: false }))
        app.use(routes)

        app.listen(process.env.PORT, () => {
            console.log(`API is running at http://localhost:${process.env.PORT}`)
        })

    })
    .catch(() => {
        console.log('error while connecting to db')
        process.exit(1)
    })

