const express = require('express')
const bodyParser = require('body-parser')
const Utilities = require('./utils/index')
const routes = require('./routes/index')

require('dotenv').config()

if (!Utilities.hasDotEnvVars()) {
    console.log('.env file incorrect, bye')
    process.exit(1)
}

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(routes)

app.listen(process.env.PORT, () => {
    console.log(`API is running at http://localhost:${process.env.PORT}`)
})