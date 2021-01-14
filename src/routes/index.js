const express = require('express')
const Utilities = require('../utils')

const routes = express.Router()

routes.get('/movies', (req, res) => {

})

routes.post('/movies', (req, res) => {
    const userDetails = Utilities.authUser(req)
    if (!userDetails) return res.sendStatus(400)
    return res.json(userDetails)
})

module.exports = routes