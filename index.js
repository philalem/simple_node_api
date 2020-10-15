var express = require("express");
var app = express();
const bodyParser = require("body-parser");
const contactsDao = require("./contactsDao");
var Validator = require("jsonschema").Validator;
var v = new Validator();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

var ContactSchema = {
  id: "/Contact",
  type: "object",
  required: ["name", "address", "phone", "email"],
  properties: {
    name: {
      type: "object",
      required: ["first", "middle", "last"],
      properties: {
        first: { type: "string" },
        middle: { type: "string" },
        last: { type: "string" },
      },
    },
    address: {
      type: "object",
      required: ["street", "city", "state", "zip"],
      properties: {
        street: { type: "string" },
        city: { type: "string" },
        state: { type: "string" },
        zip: { type: "string" },
      },
    },
    phone: {
      type: "array",
      required: ["number", "type"],
      items: {
        number: { type: "string" },
        phoneType: {
          type: "string",
          enum: ["home", "work", "mobile"],
        },
      },
    },
    email: { type: "string" },
  },
};

app.get("/contacts", (req, res) => {
  const writeDataToBrowser = (data) => {
    res.send(data);
  };
  contactsDao.getAllContacts(writeDataToBrowser).catch((error) => {
    console.error(error);
    res.sendStatus(500);
  });
});

app.post("/contacts", (req, res) => {
  var jsonContact = {};
  try {
    jsonContact = JSON.parse(req.body);
  } catch (e) {
    jsonContact = req.body;
  }
  if (v.validate(jsonContact, ContactSchema).valid) {
    contactsDao.addContact(jsonContact).catch((error) => console.error(error));
    res.sendStatus(201);
  } else {
    res.sendStatus(400);
  }
});

app.put("/contacts/:id", (req, res) => {
  const id = req.params.id;
  var jsonContact = {};
  try {
    jsonContact = JSON.parse(req.body);
  } catch (e) {
    jsonContact = req.body;
  }
  if (v.validate(jsonContact, ContactSchema).valid) {
    contactsDao.updateContact(id, jsonContact).catch((error) => {
      console.error(error);
    });
    res.sendStatus(201);
  } else {
    res.sendStatus(400);
  }
});

app.get("/contacts/:id", (req, res) => {
  const contactId = req.params.id;
  const writeDataToBrowser = (data) => {
    res.send(data);
  };
  return contactsDao
    .getContact(contactId, writeDataToBrowser)
    .catch((error) => {
      console.error(error);
      res.sendStatus(500);
    });
});

app.delete("/contacts/:id", (req, res) => {
  const id = req.params.id;
  contactsDao.deleteContact(id);
  res.sendStatus(200);
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

const server = app.listen(3000, () => {
  console.log("Server running on port 3000");
});

module.exports = { app, server };
