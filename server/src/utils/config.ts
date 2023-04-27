import dotenv from "dotenv";
import { Configuration, OpenAIApi } from "openai";
import mysql from "mysql";
import { Bot } from "../types";

dotenv.config();

export const connection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
});

export const promptGpt = `Actúa como si fueras Geniebot (un asistente con inteligencia artificial entrenado con ChatGPT4 de OpenAI y desarrollado por Adrian Guts, un programador Mexicano de IA y blockchain). 
Acerca de Geniebot: 
a) Geniebot responde idéntico a como lo haría Chatgpt
b) Geniebot responde específicamente a lo que el usuario le está pidiendo o preguntando y nunca cuestiona su pregunta
c) Geniebot responde en menos de 200 tokens permitidos por el API de davincci de OpenAI`;

export const userContentFixed1 = "Hola";
export const userContentFixed2 =
  "Dame un plan de alimentación de 2,100 calorias al día con 3 comidas por día. Solo utiliza huevos, carne de res, queso, arroz, frijoles, platanos, peras, tortillas, espinacas, cebolla, jitomate y yoghurt";
export const assistantContentFixed1 =
  "¡Hola! Soy Gpt4 en Whatsapp, te puedo ayudar en lo que quieras, ¿Qué es lo que necesitas?";
export const assistantContentFixed2 =
  "¡Claro! Esta es una buena lista de ingredientes para un plan de alimentación de 2,100 calorías. Aquí hay algunas ideas de comidas usando tus ingredientes: Desayuno – Tostadas con queso y jitomate, con una taza de yogurt Griego. Almuerzo – Ensalada de espinaca con trozos de queso y cebolla con carne de res asada. Comida – Arroz blanco con frijoles y carne de res, con un plátano y pera para la fruta.";

export const openaiConfig = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
export const openai = new OpenAIApi(openaiConfig);

export const database = process.env.DB_NAME;
export const fb_token = process.env.WHA_API_KEY;

export async function queryAsync(sql: any): Promise<any> {
  return new Promise((resolve, reject) => {
    connection.query(sql, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
}

export async function readIntent(senderId: string) {
  return new Promise((resolve, _) => {
    connection.query(
      `SELECT * FROM ${database}.intents WHERE sender= '${senderId}'`,
      (error, result) => {
        if (!error) {
          if (typeof result[0] != "undefined") {
            const intent = result[0].intent;
            //console.log(intent);
            resolve(intent);
          } else {
            firstIntent(senderId);
            resolve(1);
          }
        }
      }
    );
  });
}

async function firstIntent(senderId: string) {
  queryAsync(
    `INSERT INTO ${database}.intents (intent, sender) values ('1','${senderId}')`
  );
}

export async function readMemories(senderId: string, message: string) {
  const result = await queryAsync(
    `SELECT * FROM ${database}.intents WHERE sender = ${senderId}`
  );

  if (result[0]) {
    const mem2 = result[0].variable_temporal1;
    const mem3 = result[0].variable_temporal2;

    await sendMemorie(senderId, 1, mem2);
    await sendMemorie(senderId, 2, mem3);
    await sendMemorie(senderId, 3, message);
  }
}

export async function redMemoriesGpt(senderId: string, response: string) {
  const result = await queryAsync(
    `SELECT * FROM intents WHERE sender = ${senderId}`
  );
  if (result[0]) {
    const mem2 = result[0].gpt_temporal1;
    const mem3 = result[0].gpt_temporal2;

    await sendMemorieGpt(senderId, 1, mem2);
    await sendMemorieGpt(senderId, 2, mem3);
    await sendMemorieGpt(senderId, 3, response);
  }
}

export async function removeSpaces(message: string) {
  const result = message.replace(/\s+/g, " ");
  return result;
}

export async function sendMemorie(
  senderId: string,
  numMemory: number,
  message: string
) {
  if (message != undefined) {
    message = message.trim();
  }
  const sanitizeMessage = await convertQuotes(message);

  if (numMemory == 1) {
    await queryAsync(
      `UPDATE ${database}.intents SET variable_temporal = "${sanitizeMessage}" WHERE sender= '${senderId}'`
    );
    return;
  }
}

export async function sendMemorieGpt(
  senderId: string | number,
  numMemorie?: number,
  message?: any
) {
  if (message != undefined) {
    message = message.trim();
  }
  const sanitizeMessage = await convertQuotes(message);

  if (numMemorie == 1) {
    await queryAsync(
      `UPDATE ${database}.intents SET gpt_temporal = "${sanitizeMessage}" WHERE sender= '${senderId}'`
    );
    return;
  }
  if (numMemorie == 2) {
    await queryAsync(
      `UPDATE ${database}.intents SET gpt_temporal1 = "${sanitizeMessage}" WHERE sender= '${senderId}'`
    );
    return;
  }
}

async function convertQuotes(str: string) {
  if (typeof str === "string") {
    return str.replace(/"/g, "'");
  }
}

export async function changeIntent(senderId: string, intent: string | number) {
  await queryAsync(
    `UPDATE ${database}.intents SET intent = '${intent}' WHERE sender= '${senderId}'`
  );
}

export async function getMemorie(senderId: string, memory: number) {
  const result = await queryAsync(
    `SELECT * FROM ${database}.intents WHERE sender = '${senderId}'`
  );

  if (result[0]) {
    const mem1 = result[0].variable_temporal;
    const mem2 = result[0].variable_temporal1;
    const mem3 = result[0].variable_temporal2;

    const data =
      (memory >= 1 ? mem1 + "\n" : "") +
      (memory >= 2 ? mem2 + "\n" : "") +
      (memory >= 3 ? mem3 + "\n" : "");
    console.log("la memoria de usuario es : " + data);

    return data;
  }
}

export async function searchBot(botId: string): Promise<Bot> {
  const result = await queryAsync(
    `SELECT * FROM ${database}.bots WHERE whatsappId = '${botId}'`
  );
  if (result[0]) {
    return result[0];
  }
}
