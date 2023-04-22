// Create Route for the root of the application
import { Router, Response, Request } from "express";
import { connection } from "../utils/config";

const router = Router();

router.get("/", (_req: Request, res: Response) => {
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

router.post("/createBot", async (req: Request, res: Response) => {
  const { botGoal, telegramApiKey } = req.body;
  if (!botGoal || !telegramApiKey) {
    return res
      .status(400)
      .send("Please provide a bot goal and telegram api key");
  }
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
