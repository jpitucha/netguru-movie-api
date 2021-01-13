const express = require('express')
const body_parser = require('body-parser')
const Utilities = require('./utils')

require('dotenv').config()

if (!Utilities.hasDotEnvVars()) {
    console.log('.env file incorrect, bye')
    process.exit(1)
}

const app = express()
app.use(body_parser.json())
app.use(body_parser.urlencoded({ extended: false }))

app.listen(process.env.PORT, () => {
    console.log(`API is running at http://localhost:${process.env.PORT}`)
})