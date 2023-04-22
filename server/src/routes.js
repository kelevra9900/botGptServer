const express = require("express");
const router = express.Router();
const { connection } = require("./utils/config");

router.get("/getData", (req, res) => {
  let sql = "SELECT * FROM bots";
  connection.query(sql, (err, results) => {
    if (err) {
      console.log(err);
    } else {
      console.log(results);
      res.send(JSON.stringify(results));
    }
  });
});

router.post("/createBot", async (req, res) => {
  console.log(req.body);
  var prompt = req.body["botGoal"].trim();
  var telegramApiKey = req.body["telegramApiKey"].trim();
  //Agregar a la tabla de bots el botGoal y el telegramApiKey
  var insertQuery = `INSERT INTO bots (prompt, telegramApiKey) values ('${prompt}', '${telegramApiKey}')`;
  connection.query(insertQuery, (err, response) => {
    if (err) {
      console.log("Error inserting data into db: " + err);
      return;
    }
  });
  res.status(201).send("Your Gpt4sales was created successfully!!");
});

module.exports = router;
