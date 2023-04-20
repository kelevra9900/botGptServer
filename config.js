const mysql = require('mysql');
require('dotenv').config()

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const openaiConfig = {
  apiKey: process.env.OPENAI_API_KEY,
};

module.exports = {
  connection, 
  openaiConfig
};  