import { Request, Response, NextFunction } from "express";
import mysql from "mysql";
import { CreateBotSchema } from "../types";
import { connection as pool } from "../utils/config";

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
