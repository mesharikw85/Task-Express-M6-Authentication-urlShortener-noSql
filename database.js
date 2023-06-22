const mongoose = require("mongoose");
const dotEnv = require("dotenv");
dotEnv.config();

const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGO_DB_URL);
  console.log(`mongo connected: ${conn.connection.host}`);
};

module.exports = connectDB;
