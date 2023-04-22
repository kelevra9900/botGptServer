import { createConnection } from "mysql";
import dotenv from "dotenv";

dotenv.config();

const connection = createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
});

connection.connect();

connection.query(
  `INSERT INTO bots (prompt, telegramApiKey, file_created, file_running, database_created, assistant_content3, assistant_content2, assistant_content1, user_content3, user_content2, user_content1, whatsapp_enable, whatsappApiKey, whatsappId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  [
    "Este es el prompt",
    "telegramApiKey",
    "0",
    "0",
    "0",
    "contenido 3 asistente",
    "contenido 2 asistente",
    "contenido 1 asistente",
    "contenido 3 usuario",
    "contenido 2 usuario",
    "contenido 1 usuario",
    "0",
    "whatsappApiKey",
    "whatsappId",
  ],
  (error, results) => {
    if (error) throw error;
    console.log("Se ha insertado un nuevo bot");
  }
);

connection.end();
