const express = require('express')
const Utilities = require('../utils')
const Movie = require('./../db/schema/movieSchema')

const routes = express.Router()

routes.get('/movies', (req, res) => {
    const userDetails = Utilities.authUser(req)
    if (!userDetails) return res.sendStatus(400)
    Utilities.getMoviesByUser(userDetails.userId)
        .then((movieList) => {
            return res.json(movieList)
        })
        .catch(() => { return res.sendStatus(400) })
})

routes.post('/movies', (req, res) => {
    const userDetails = Utilities.authUser(req)
    if (!userDetails) return res.sendStatus(400)
    if (userDetails.role === 'basic') {
        Utilities.countMoviesFromCurrentMonth(userDetails.userId)
            .then((count) => {
                if (count >= 5) return res.json('user reached limit of saved movies')
            })
            .catch((err) => {
                console.log(err)
                return res.json('error occured while counting user movies')
            })
    }

    Utilities.fetchMovieDetails(req.body.title)
        .then((res) => res.json())
        .then((movieDetails) => {
            return Movie.create({
                createdBy: userDetails.userId,
                createdAt: Utilities.getCurrentMonthAndYear(),
                Title: movieDetails.Title,
                Released: movieDetails.Released,
                Genre: movieDetails.Genre,
                Director: movieDetails.Director
            })
        })
        .then((movieDoc) => {
            return res.json(movieDoc)
        })
        .catch((err) => {
            console.log(err)
            return res.sendStatus(400)
        })
})

module.exports = routes