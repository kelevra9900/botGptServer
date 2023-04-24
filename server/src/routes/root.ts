// Create Route for the root of the application
import { Router, Response, Request } from "express";
import mysql, { MysqlError } from "mysql";
import { verifyToken, receivedMessage } from "../controllers/whatsapp";

import { Bot, CreateBotRequest } from "../types";

const router = Router();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
  waitForConnections: true,
  connectionLimit: 1000,
  queueLimit: 1000,
});
pool.on("connection", (connection) => {
  console.log("New Connection");
  connection.query("SET SESSION auto_increment_increment=1");
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
  const body = req.body as CreateBotRequest;

  try {
    if (!body.botGoal && !body.telegramApiKey) {
      console.log("Invalid Request", req.body);
      return res.status(400).json({
        message: "Invalid Request",
      });
    }

    // If is number or is empty string
    if (typeof body.botGoal !== "string" || !body.botGoal.trim()) {
      return res.status(400).json({
        message: "Invalid Request",
      });
    }

    const prompt = body.botGoal.trim().toLowerCase();
    const tlKey = body.telegramApiKey.trim().toLowerCase();
    const wpKey = body.whatsappApiKey.trim().toLowerCase();

    const data = {
      prompt,
      telegramApiKey: tlKey,
      whatsappApiKey: wpKey,
      assistant_content1: body.assistant_content1,
      assistant_content2: body.assistant_content2,
      assistant_content3: body.assistant_content3,
      user_content1: body.user_content1,
      user_content2: body.user_content2,
      user_content3: body.user_content3,
    };

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

    const insertQuery = "INSERT INTO bots SET ?";
    const insertValues = data;

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

router.get("/whatsapp", verifyToken);

router.post("/whatsapp", receivedMessage);

export default router;
