var express = require("express");
const bodyParser = require("body-parser");
var app = express();

// to help with parsing the form requests
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/contacts", (req, res, next) => {
  res.json(["Tony", "Lisa", "Michael", "Ginger", "Food"]);
});
app.post("/contacts", (req, res, next) => {
  console.log(req.body);
});
app.put("/contacts", (req, res, next) => {
  res.json(["Tony", "Lisa", "Michael", "Ginger", "Food"]);
});
app.get("/contacts/{id}", (req, res, next) => {
  res.json(["Tony", "Lisa", "Michael", "Ginger", "Food"]);
});
app.delete("/contacts/{id}", (req, res, next) => {
  res.json(["Tony", "Lisa", "Michael", "Ginger", "Food"]);
});

app.get("/", (req, res, next) => {
  res.sendFile(__dirname + "/index.html");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
