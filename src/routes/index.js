const express = require('express')
const { authUser, getMoviesByUser, isUserWithinUsageLimit, checkIfMovieExists, createMovie } = require('../utils')
const Movie = require('./../db/schema/movieSchema')

const routes = express.Router()

routes.get('/movies', async (req, res) => {
    const userDetails = authUser(req)
    if (!userDetails) return res.sendStatus(400)
    try {
       const movieList = await getMoviesByUser(userDetails.userId)
       return res.json(movieList)
    } catch {
        return res.sendStatus(500)
    }
})

routes.post('/movies', async (req, res) => {
    const userDetails = authUser(req)
    if (!userDetails) return res.sendStatus(401)

    if (userDetails.role === 'basic') {
        try {
            const countCondition = await isUserWithinUsageLimit(userDetails.userId)
            if (!countCondition) return res.json('user reached limit of saved movies')
        } catch {
            return res.sendStatus(500)
        }
    }
        
    try {
        if (await checkIfMovieExists(req.body.title)) {
            return res.status(500).send('movie already exists')
        }
        const savedMovie = await createMovie(req.body.title, userDetails)
        return res.json(savedMovie)
    } catch {
        return res.sendStatus(500)
    }
})

module.exports = routes