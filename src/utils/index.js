const jwt = require('jsonwebtoken')
const Movie = require('./../db/schema/movieSchema')
const fetch = require('node-fetch')

function hasDotEnvVars() {
    if(!process.env.MONGO_INITDB_DATABASE) return false
    if(!process.env.MONGO_INITDB_ROOT_USERNAME) return false
    if(!process.env.MONGO_INITDB_ROOT_PASSWORD) return false
    if(!process.env.DB_USERNAME) return false
    if(!process.env.DB_PASSWORD) return false
    if(!process.env.DB_URL) return false
    if(!process.env.PORT) return false
    if(!process.env.SECRET) return false
    if(!process.env.OMDB_KEY) return false
    return true
}

function authUser(httpRequest) {
    const authHeader = httpRequest.headers['authorization']
    if (!authHeader) return null
    //if (authHeader.split(' ')[0] !== 'Bearer') return 
    const token = authHeader.split(' ')[1]
    if (!token) return null
    let userDetails
    try {
        userDetails = jwt.verify(token, process.env.SECRET)
    } catch {
        return null
    }
    return userDetails
}

async function getMoviesByUser(userID) {
    const movies = await Movie.find({ createdBy: userID }).exec()
    return movies
}

function fetchMovieDetails(title) {
    return fetch(`http://www.omdbapi.com/?apikey=${process.env.OMDB_KEY}&t=${title}`)
}

async function isUserWithinUsageLimit(userID) {
    const count = await Movie.countDocuments({
        createdBy: userID,
        createdAt: getCurrentMonthAndYear()
    }).exec()
    return count < 5
}

function getCurrentMonthAndYear() {
    const date = new Date()
    return date.getMonth() + '-' + date.getFullYear()
}

async function createMovie(title, userDetails) {
    const fetchedMovie = await fetchMovieDetails(title)
    const fetchedMovieJson = await fetchedMovie.json()
    const savedMovie = await Movie.create({
        createdBy: userDetails.userId,
        createdAt: getCurrentMonthAndYear(),
        Title: fetchedMovieJson.Title,
        Released: fetchedMovieJson.Released,
        Genre: fetchedMovieJson.Genre,
        Director: fetchedMovieJson.Director
    })
    return savedMovie
}

async function checkIfMovieExists(title) {
    const fetchedMovie = await fetchMovieDetails(title)
    const fetchedMovieJson = await fetchedMovie.json()
    const matchCount = await Movie.find({ Title: fetchedMovieJson.Title }).count().exec()
    return matchCount > 0
}

module.exports = {
    hasDotEnvVars,
    authUser,
    getMoviesByUser,
    fetchMovieDetails,
    isUserWithinUsageLimit,
    getCurrentMonthAndYear,
    createMovie,
    checkIfMovieExists
}