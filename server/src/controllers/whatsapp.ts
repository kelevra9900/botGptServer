import { Request, Response, NextFunction } from "express";

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(200).json({
    message: "Token verified",
  });
};

export const receivedMessage = (req: Request, res: Response) => {
  const { message } = req.body;
  const { body, from } = message;
  const { number } = from;
  const { text } = body;

  console.log("Received message from", number, ":", text);
  res.status(200).json({
    message: "Message received",
  });
};
