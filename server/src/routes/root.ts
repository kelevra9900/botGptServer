/* eslint-disable no-var */
// Create Route for the root of the application
import { Router, Response, Request } from "express";
import mysql, { MysqlError } from "mysql";
import { verifyToken, receivedMessage } from "../controllers/whatsapp";

import { Bot, CreateBotRequest } from "../types";
import { readIntent } from "../utils";
import { completionWithNewGpt } from "../services/chatgptService";
import { sendMemorie } from "../utils/config";
import { sendMemorieGpt } from "../utils/config";
import { changeIntent } from "../utils";
import { sendMessage } from "../services/chatgptService";
import { getMemory } from "../utils";
import { runCompletionWithMemory } from "../controllers/bots";

const router = Router();
let counter = 0;

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

router.get("/chatbot", (req: Request, res: Response) => {
  const challenge = req.query["hub.challenge"];
  if (challenge) {
    return res.status(200).send(challenge);
  } else {
    res.status(200).send("Soy tu amigo Fiel");
  }
});

router.post("/chatbot", async (req: Request, res: Response) => {
  counter++;
  const { entry } = req.body;
  try {
    const message = entry[0].changes[0].value.messages[0].text.body;
    const phoneId = entry[0].changes[0].value.metadata.phone_number_id;

    if (message && phoneId === "110564661969436") {
      const sender = entry[0].changes[0].value.messages[0].from;
      const intent = await readIntent(sender);

      if (intent) {
        var response = "";
        switch (intent) {
          case 1:
            response = await completionWithNewGpt(message);
            await Promise.all([
              sendMemorie(sender, 1, message),
              sendMemorieGpt(sender, 1, response),
              changeIntent(sender, 2),
            ]);
            await sendMessage(sender, response);
            res.send(response);
            break;
          case 2:
            var memory = await getMemory(sender);
            var memoryGpt = await getMemory(sender, true);
            var response1 = await runCompletionWithMemory(
              message,
              memory,
              memoryGpt
            );
            await Promise.all([
              sendMemorie(sender, 2, message),
              sendMemorieGpt(sender, 2, response1),
              changeIntent(sender, 1),
            ]);
            res.send(response1);
            break;
          case 3:
            var memory = await getMemory(sender);
            var memoryGpt = await getMemory(sender, true);
            var response2 = await runCompletionWithMemory(
              message,
              memory,
              memoryGpt
            );
            await Promise.all([
              sendMemorie(sender, 3, message),
              sendMemorieGpt(sender, 3, response2),
              changeIntent(sender, 1),
            ]);
            res.send(response2);
            break;
        }
      }
    }
  } catch (e) {
    return res.status(500).send("Internal server error");
  }
});

router.get("/getData", (_req: Request, res: Response) => {
  const selectQuery =
    "SELECT id, prompt, telegramApiKey, whatsappApiKey FROM bots";
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

router.post("/updateWhatsappEnable", async (req, res) => {
  console.log(req.body);
  var whatsapp_enable = req.body["whatsapp_enable"];
  var botId = req.body["botId"];
  var insertQuery = `UPDATE bots SET whatsapp_enable = ${whatsapp_enable} WHERE id = ${botId}`;
  pool.query(insertQuery, (err, _response) => {
    if (err) {
      console.log("Error inserting data into db: " + err);
      return;
    }
  });
  res.status(201).send("Whatsapp Enable has been updated");
});

router.post("/updateTelegramEnable", async (req, res) => {
  console.log(req.body);
  var telegram_enable = req.body["telegram_enable"];
  var botId = req.body["botId"];
  var insertQuery = `UPDATE bots SET telegram_enable = ${telegram_enable} WHERE id = ${botId}`;
  pool.query(insertQuery, (err, _response) => {
    if (err) {
      console.log("Error inserting data into db: " + err);
      return;
    }
  });
  res.status(201).send("Telegram enable has been updated");
});

router.get("/whatsapp", verifyToken);

router.post("/whatsapp", receivedMessage);

export default router;
