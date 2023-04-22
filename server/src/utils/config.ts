import dotenv from "dotenv";
import mysql from "mysql";

dotenv.config();

export const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
});

export const openaiConfig = {
  apiKey: process.env.OPENAI_API_KEY,
};
