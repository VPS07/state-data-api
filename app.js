const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const scrapeData = require("./stateData");

app.get("/", (req, res) => {
  res.redirect("/api/state_data/");
});

app.get("/api/state_data/", async (req, res) => {
  const objValue = await scrapeData("gujarat");
  res.json(objValue);
});

app.get("/api/state_data/:state_name", async (req, res) => {
  const objValue = await scrapeData(req.params.state_name);
  res.send(objValue);
});

app.listen(port, () => {
  console.log("Server is listening on http://localhost:5000/api/state_data/");
});
