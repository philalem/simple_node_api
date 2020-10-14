var Datastore = require("nedb"),
  db = new Datastore({ filename: "database", autoload: true });

exports.getAllContacts = async (callback) => {
  db.find({}, (err, docs) => {
    if (err) {
      console.log("error:" + err);
      return callback(err);
    }
    return callback(docs);
  });
};

exports.addContact = async (contact) => {
  db.update(contact, { $set: contact }, { upsert: true });
};

exports.updateContact = async (id, newContact) => {
  db.update({ _id: id }, newContact);
};

exports.getContact = async (id) => {
  return db.findOne({ _id: id });
};

exports.deleteContact = async (id) => {
  return db.remove({ _id: id });
};
