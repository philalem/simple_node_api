var express = require("express");
var app = express();
const bodyParser = require("body-parser");
const contactsDao = require("./contactsDao");

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/contacts", (req, res) => {
  console.log("here actually");
  const writeDataToBrowser = (data) => {
    res.send(data);
  };
  contactsDao.getAllContacts(writeDataToBrowser).catch((error) => {
    console.error(error);
    res.sendStatus(500);
  });
});

app.post("/contacts", (req, res) => {
  console.log("here1");
  var jsonContact = {};
  try {
    jsonContact = JSON.parse(req.body.contact);
  } catch (e) {
    jsonContact = req.body.contact;
  }
  contactsDao.addContact(jsonContact).catch((error) => console.error(error));
  res.sendStatus(201);
});

app.put("/contacts/:id", (req, res) => {
  console.log("here2");
  const id = req.params.id;
  var jsonContact = {};
  try {
    jsonContact = JSON.parse(req.body.contact);
  } catch (e) {
    jsonContact = req.body.contact;
  }
  contactsDao.updateContact(id, jsonContact).catch((error) => {
    console.error(error);
  });
  res.sendStatus(201);
});

app.get("/contacts/:id", (req, res) => {
  console.log("here3");
  const contactId = req.params.id;
  return contactsDao
    .getContact(contactId)
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      console.error(error);
      res.sendStatus(500);
    });
});

app.delete("/contacts/:id", (req, res) => {
  console.log("here4");
  const id = req.params.id;
  contactsDao.deleteContact(id);
  res.sendStatus(200);
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
