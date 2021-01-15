const jwt = require('jsonwebtoken')
const Movie = require('./../db/schema/movieSchema')
const fetch = require('node-fetch')
class Utilities {

    static dbConn

    static hasDotEnvVars() {
        if(!process.env.MONGO_INITDB_DATABASE) return false
        if(!process.env.MONGO_INITDB_ROOT_USERNAME) return false
        if(!process.env.MONGO_INITDB_ROOT_PASSWORD) return false
        if(!process.env.DB_USERNAME) return false
        if(!process.env.DB_PASSWORD) return false
        if(!process.env.DB_URL) return false
        return true
    }

    static authUser(httpRequest) {
        const authHeader = httpRequest.headers['authorization']
        if (!authHeader) return null
        const token = authHeader.split(' ')[1]
        if (!token) return null
        let userDetails
        try {
            userDetails = jwt.verify(token, process.env.SECRET)
        } catch {
            return null
        }
        return Utilities.dbConn = userDetails
    }

    static async getMoviesByUser(userID) {
        const movies = await Movie.find({ createdBy: userID }).exec()
        return movies
        console.log(movies)
    }

    static fetchMovieDetails(title) {
        return fetch(`http://www.omdbapi.com/?apikey=${process.env.OMDB_KEY}&t=${title}`)
    }

    static async checkUserDocCount(userID) {
        const count = await Movie.countDocuments({
            createdBy: userID,
            createdAt: Utilities.getCurrentMonthAndYear()
        }).exec()
        if (count >= 5) return false
        return true
    }

    static getCurrentMonthAndYear() {
        const date = new Date()
        return date.getMonth() + '-' + date.getFullYear()
    }

    static async createMovie(title, userDetails) {
        try {
            const fetchedMovie = await Utilities.fetchMovieDetails(title)
            const fetchedMovieJson = await fetchedMovie.json()
            const savedMovie = await Movie.create({
                createdBy: userDetails.userId,
                createdAt: Utilities.getCurrentMonthAndYear(),
                Title: fetchedMovieJson.Title,
                Released: fetchedMovieJson.Released,
                Genre: fetchedMovieJson.Genre,
                Director: fetchedMovieJson.Director
            })
            return savedMovie
        } catch {
            return null
        }
    }

    static async checkIfMovieExists(title) {
        try {
            const fetchedMovie = await Utilities.fetchMovieDetails(title)
            const fetchedMovieJson = await fetchedMovie.json()
            const matchCount = await Movie.find({ Title: fetchedMovieJson.Title }).count().exec()
            if (matchCount > 0) return true
            return false
        } catch {
            return null
        }
    }

}

module.exports = Utilities