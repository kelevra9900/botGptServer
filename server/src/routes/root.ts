// Create Route for the root of the application
import { Router, Response, Request } from "express";
import mysql, { MysqlError } from "mysql";

import { Bot, CreateBotRequest } from "index";

const router = Router();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
});

router.get("/", (_req: Request, res: Response) => {
  res.json({ message: "Hello World!" });
});

router.get("/getData", (_req: Request, res: Response) => {
  const selectQuery = "SELECT prompt, telegramApiKey, whatsappApiKey FROM bots";

  pool.query(selectQuery, (error: MysqlError | null, results: Bot[]) => {
    if (error) {
      console.error(error);
      return res.status(500).json({
        message: error.message,
        err: JSON.stringify(error),
      });
    }

    return res.status(200).json({
      data: results,
      status: "success",
    });
  });
});

router.post("/createBot", async (req: Request, res: Response) => {
  const { botGoal, telegramApiKey, whatsappApiKey } =
    req.body as CreateBotRequest;

  try {
    if (!botGoal || !telegramApiKey || !whatsappApiKey) {
      return res.status(400).json({
        message: "Invalid Request",
      });
    }

    const prompt = botGoal.trim().toLowerCase();
    const tlKey = telegramApiKey.trim().toLowerCase();
    const wpKey = whatsappApiKey.trim().toLowerCase();

    const connection = await new Promise<mysql.PoolConnection>(
      (resolve, reject) => {
        pool.getConnection((err, connection) => {
          if (err) {
            reject(err);
          } else {
            resolve(connection);
          }
        });
      }
    );

    const insertQuery =
      "INSERT INTO bots (prompt, telegramApiKey, whatsappApiKey) VALUES (?, ?, ?)";
    const insertValues = [prompt, tlKey, wpKey];

    const result = await new Promise<Bot>((resolve, reject) => {
      connection.query(insertQuery, insertValues, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });

    connection.release();

    return res.status(200).json({
      data: result,
      status: "success",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: error.message,
      err: JSON.stringify(error),
    });
  }
});

export default router;
