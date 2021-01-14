import mongoose from 'mongoose'

export default class dbConnectionProvider {

    static async connectToDatabase() {
        const conn = await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: true,
            useCreateIndex: true
        })
        if (!conn) throw 'error occured while connecting to db'
        return conn
    }
    
}