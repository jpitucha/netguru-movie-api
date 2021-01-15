const express = require('express')
const Utilities = require('../utils')
const Movie = require('./../db/schema/movieSchema')

const routes = express.Router()

routes.get('/movies', async (req, res) => {
    const userDetails = Utilities.authUser(req)
    if (!userDetails) return res.sendStatus(400)
    try {
       const movieList = await Utilities.getMoviesByUser(userDetails.userId)
       return res.json(movieList)
    } catch {
        return res.sendStatus(400)
    }
})

routes.post('/movies', async (req, res) => {
    const userDetails = Utilities.authUser(req)
    if (!userDetails) return res.sendStatus(401)

    if (userDetails.role === 'basic') {
        try {
            const countCondition = await Utilities.checkUserDocCount(userDetails.userId)
            if (!countCondition) return res.json('user reached limit of saved movies')
        } catch {
            return res.sendStatus(500)
        }
    }
        
    try {
        // check if movie already exists
        const savedMovie = await Utilities.createMovie(req.body.title, userDetails, Movie)
        if (!savedMovie) return res.sendStatus(400)
        return res.json(savedMovie)
    } catch {
        return res.sendStatus(400)
    }
})

module.exports = routes