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
        const movies = await Movie.find({ postedBy: userID }).exec()
        console.log(movies)
    }

    static fetchMovieDetails(title) {
        return fetch(`http://www.omdbapi.com/?apikey=${process.env.OMDB_KEY}&t=${title}`)
    }

    static countMoviesFromCurrentMonth(userID) {
        //return Movie.find({ createdBy: userID }).where().exec()
        return Movie.countDocuments({
            createdBy: userID,
            createdAt: Utilities.getCurrentMonthAndYear()
        }).exec()
    }

    static getCurrentMonthAndYear() {
        const date = new Date()
        return date.getMonth() + '-' + date.getFullYear()
    }

}

module.exports = Utilities