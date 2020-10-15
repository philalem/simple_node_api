var Datastore = require("nedb");
exports.db = new Datastore({ filename: "database", autoload: true });

exports.getAllContacts = async (callback) => {
  exports.db.find({}, (err, docs) => {
    if (err) {
      console.log("error:" + err);
      return callback(err);
    }
    return callback(docs);
  });
};

exports.addContact = async (contact) => {
  exports.db.insert(contact);
};

exports.updateContact = async (id, newContact) => {
  exports.db.update({ _id: id }, newContact);
};

exports.getContact = async (id, callback) => {
  return exports.db.findOne({ _id: id }, (err, docs) => {
    if (err) {
      console.log("error:" + err);
      return callback(err);
    }
    return callback(docs);
  });
};

exports.deleteContact = async (id) => {
  return exports.db.remove({ _id: id });
};
