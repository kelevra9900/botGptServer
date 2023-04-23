import { Request, Response } from "express";
import { Process } from "../common/whatsapp/processMessage";

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

export const receivedMessage = (req: Request, res: Response) => {
  try {
    const entry = req.body["entry"][0];
    const changes = entry["changes"][0];
    const value = changes["value"];
    const messageObject = value["messages"];

    if (typeof messageObject != "undefined") {
      const messages = messageObject[0];
      const number = messages["from"];

      const text = GetTextUser(messages);

      if (text != "") {
        Process(text, number);
      }
    }

    res.send("EVENT_RECEIVED");
  } catch (e) {
    res.send("EVENT_RECEIVED");
  }
};

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
      console.log("sin mensaje");
    }
  } else {
    console.log("sin mensaje");
  }
  return text;
}
