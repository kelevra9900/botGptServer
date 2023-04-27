import { Request, Response } from "express";
import { Process } from "../common/whatsapp/processMessage";
import * as fs from "fs";

const myConsole = new console.Console(fs.createWriteStream("./log.txt"));

export const verifyToken = (req: Request | any, res: Response) => {
  try {
    const accessToken = "RTKWWTVHBDEJ1J4IKIKWQS9090DS";
    const token = req.query["hub.verify_token"] as string;
    const challenge = req.query["hub.challenge"] as string;

    if (challenge != null && token != null && token == accessToken) {
      res.send(challenge);
    } else {
      res.status(400).json({
        message: "Error, Access Token is not valid",
      });
    }
  } catch (e) {
    console.log("Error:", e);
    res.sendStatus(500);
  }
};

export async function receivedMessage(req: Request, res: Response) {
  try {
    // Extract the token from the headers of the request
    const wpToken = req.headers["authorization"] as string;
    const sanitizedToken = wpToken.replace("Bearer ", "");

    console.log(wpToken);
    const entry = req.body["entry"][0];
    const changes = entry["changes"][0];
    const value = changes["value"];
    const messageObject = value["messages"];

    if (typeof messageObject != "undefined") {
      const messages = messageObject[0];
      const number = messages["from"];
      const botId = entry.id;

      const text = GetTextUser(messages);

      if (text != "") {
        myConsole.log("Mensaje recibido: " + text);
        myConsole.log("Número: " + number);
        const resProcess = await Process({
          textUser: text,
          number,
          botId,
          whatsappApiKey: sanitizedToken,
        });
        myConsole.log("Mensaje enviado: " + resProcess);
      }
    }

    res.send("EVENT_RECEIVED");
  } catch (e) {
    myConsole.log(JSON.stringify(e));
    res.send("EVENT_RECEIVED");
  }
}

export function GetTextUser(messages: any) {
  let text = "";
  const typeMessge = messages["type"];
  if (typeMessge == "text") {
    text = messages["text"]["body"];
  } else if (typeMessge == "interactive") {
    const interactiveObject = messages["interactive"];
    const typeInteractive = interactiveObject["type"];

    if (typeInteractive == "button_reply") {
      text = interactiveObject["button_reply"]["title"];
    } else if (typeInteractive == "list_reply") {
      text = interactiveObject["list_reply"]["title"];
    } else {
      myConsole.log("sin mensaje");
    }
  } else {
    myConsole.log("sin mensaje");
  }
  return text;
}
