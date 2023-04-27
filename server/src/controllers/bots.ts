import { Request, Response, NextFunction } from "express";
import mysql from "mysql";
import axios from "axios";
import { CreateBotSchema } from "../types";
import { connection as pool } from "../utils/config";
import {
  openai,
  fb_token,
  promptGpt,
  assistantContentFixed1,
  assistantContentFixed2,
  userContentFixed1,
  userContentFixed2,
} from "../utils/config";
import { GetTextUser } from "./whatsapp";
import { Process } from "../common/whatsapp/processMessage";
import * as fs from "fs";
const myConsole = new console.Console(fs.createWriteStream("./log.txt"));
// const whatsappBusinessId = `110564661969436`;

export const createBot = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { value, error } = CreateBotSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }

    const prompt = value.botGoal.trim().toLowerCase();
    const tlKey = value.telegramApiKey.trim().toLowerCase();
    const wpKey = value.whatsappApiKey.trim().toLowerCase();

    const data = {
      prompt,
      telegramApiKey: tlKey,
      whatsappApiKey: wpKey,
      assistant_content1: value.assistant_content1,
      assistant_content2: value.assistant_content2,
      assistant_content3: value.assistant_content3,
      user_content1: value.user_content1,
      user_content2: value.user_content2,
      user_content3: value.user_content3,
    };

    const insertQuery = "INSERT INTO bots SET ?";
    const insertValues = data;

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

    const result = await new Promise((resolve, reject) => {
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
    next(error);
  }
};

export async function runCompletionWithMemory(
  message: string,
  memory: number | string,
  gptMemory: unknown
) {
  const messages: any = [
    { role: "system", content: promptGpt },
    { role: "user", content: userContentFixed1 },
    { role: "assistant", content: assistantContentFixed1 },
    { role: "user", content: userContentFixed2 },
    { role: "assistant", content: assistantContentFixed2 },
  ];

  for (let i = 1; i <= 3; i++) {
    if (gptMemory[`mensaje${i}`]) {
      messages.push({ role: "user", content: memory[`mensaje${i}`] });
      messages.push({ role: "assistant", content: gptMemory[`mensaje${i}`] });
    }
  }
  messages.push({ role: "user", content: message });
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages,
    frequency_penalty: 0.19,
    presence_penalty: 0.79,
    top_p: 1,
    max_tokens: 70,
    temperature: 0.7,
  });
  const respuesta = response.data.choices[0].message.content;
  return respuesta
    ? [respuesta, true]
    : [
        "Sorry, we're experiencing a high demand at the moment, please come back in a few minutes",
        false,
      ];
}

export async function sendMessage(
  sender: string,
  message: string,
  token?: string,
  wpId?: string
) {
  const payload = {
    messaging_product: "whatsapp",
    to: `${sender}`,
    text: { body: `${message}` },
  };

  const session = axios.create({
    baseURL: `https://graph.facebook.com/v16.0/${wpId}`,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  try {
    await session.post("/messages", payload);
    return { message: message, status: 200 };
  } catch (error) {
    console.error("Error while sending the message:", error.response.data);
    return { message: "Error while sending the message", status: 500 };
  }
}
