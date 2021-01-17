const mongoose = require("mongoose");
const { DB_CONNECTION_ERR } = require("../messages");

class dbConnectionProvider {
  static async connectToDatabase() {
    const conn = await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: true,
      useCreateIndex: true,
    });
    if (!conn) throw DB_CONNECTION_ERR;
    return conn;
  }
}

module.exports = dbConnectionProvider;
