var express = require("express");
var app = express();
const bodyParser = require("body-parser");
const contactsDao = require("./contactsDao");

app.use(express.json());

app.get("/contacts", (req, res) => {
  console.log("here actually");
  contactsDao
    .getAllContacts()
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      console.error(error);
    });
});

app.post("/contacts", (req, res) => {
  console.log("here1");
  const jsonContact = {};
  try {
    jsonContact = JSON.parse(req.body.contact);
  } catch (e) {
    jsonContact = req.body.contact;
  }
  contactsDao
    .addContact(jsonContact)
    .catch((error) => console.error(error))
    .finally(() => res.redirect("/"));
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
  contactsDao
    .updateContact(id, jsonContact)
    .catch((error) => console.error(error))
    .finally(() => res.redirect("/"));
  res.send(200);
});

app.get("/contacts/:id", (req, res) => {
  console.log("here3");
  const contactId = req.params.id;
  return contactsDao
    .getContact(contactId)
    .then((result) => {
      res.send(result);
    })
    .catch((error) => console.error(error));
});

app.delete("/contacts/:id", (req, res) => {
  console.log("here4");
  const id = req.params.id;
  contactsDao.deleteContact(id);
  res.send(200);
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
