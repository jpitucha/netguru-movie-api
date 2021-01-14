const jwt = require('jsonwebtoken')
class Utilities {

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
        return userDetails
    }

}

module.exports = Utilities