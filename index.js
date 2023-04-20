// server/index.js
require('dotenv').config()
const express = require("express");
const PORT = process.env.PORT || 3001;
const cors = require('cors');
const app = express();
const routes = require('./routes');

app.use(cors());
app.use(express.json());



app.use('/', routes);


app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
  });