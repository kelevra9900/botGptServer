// Create Route

import { Router, Response, Request } from "express";
import { connection } from "../utils/config";

const router = Router();

router.get("/", (req, res) => {
  res.json({ message: "Hello World!" });
});

router.get("/getData", (_req: Request, res: Response) => {
  // Create a query compatible with TYPESCRIPT
  connection.query("SELECT * FROM bots", (err: any, results: any) => {
    if (err) {
      return res
        .status(500)
        .json({ message: err.message, err: JSON.stringify(err) });
    } else {
      return res
        .json({
          data: results,
          status: "success",
        })
        .status(200);
    }
  });
});

router.post("/createBot", async (req, res) => {
  const { botGoal, telegramApiKey } = req.body;
  try {
    // trim the data to remove any whitespace
    const prompt = botGoal.trim();
    const apiKey = telegramApiKey.trim();
    // insert the data into the database
    const insertQuery = `INSERT INTO bots (prompt, telegramApiKey) values ('${prompt}', '${apiKey}')`;
    connection.query(insertQuery, (err, response) => {
      if (err) {
        console.log("Error inserting data into db: " + err);
        return;
      } else {
        res.status(201).send("Your Gpt4sales was created successfully!!");
      }
    });
  } catch (e) {
    console.log(e);
    res.status(500).send("Error creating a bot");
  }
});

export default router;
