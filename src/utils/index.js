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

}

module.exports = Utilities