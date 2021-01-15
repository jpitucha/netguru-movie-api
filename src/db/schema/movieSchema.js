const mongoose = require('mongoose')

const movieSchema = new mongoose.Schema({
    createdBy: String,
    createdAt: String,
    Title: String,
    Released: String,
    Genre: String,
    Director: String
})

const Movie = mongoose.model('movie', movieSchema)

module.exports = Movie

