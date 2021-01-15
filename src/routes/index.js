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
            console.log(countCondition)
            if (!countCondition) return res.json('user reached limit of saved movies')
        } catch {
            console.log('limit reached')
            return res.sendStatus(500)
        }
    }
        
    try {
        const existence = await checkIfMovieExists(req.body.title)
        if (existence === null) return res.sendStatus(500)
        if (existence) return res.json('movie already exists')
        const savedMovie = await createMovie(req.body.title, userDetails)
        return res.json(savedMovie)
    } catch {
        return res.sendStatus(500)
    }
})

module.exports = routes