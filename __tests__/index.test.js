const { app, server } = require("../index");
const request = require("supertest");
const { db } = require("../contactsDao");

const defaultContact = {
  name: {
    first: "Darth Vader",
    middle: "Anakin",
    last: "Skywalker",
  },
  address: {
    street: "1234 Middle of the desert",
    city: "unknown",
    state: "Tatooine",
    zip: "00000",
  },
  phone: [
    {
      number: "123-456-7890",
      phoneType: "home",
    },
    {
      number: "553-456-7890",
      phoneType: "mobile",
    },
  ],
  email: "darth_vader@sithlord.com",
};

const contactToInsert = {
  name: {
    first: "Phillip",
    middle: "coder",
    last: "LeMaster",
  },
  address: {
    street: "1234 somewhere st",
    city: "somewhere",
    state: "VA",
    zip: "12345",
  },
  phone: [
    {
      number: "123-099-7890",
      phoneType: "mobile",
    },
  ],
  email: "phillip@example.com",
};

beforeAll(() => {
  process.env.NODE_ENV = "test";
  db.insert(defaultContact);
  db.insert(contactToInsert);
});

afterAll(async (done) => {
  server.close();
  done();
});

describe("server-api", () => {
  it("GET /contacts", async () => {
    const res = await request(app).get("/contacts");
    const entries = res.body;
    let expectedContact = entries.find(
      (o) =>
        o.name === defaultContact.name &&
        o.address === defaultContact.address &&
        o.phone === defaultContact.phone &&
        o.email === defaultContact.email
    );
    let otherExpectedContact = entries.find(
      (o) =>
        o.name === contactToInsert.name &&
        o.address === contactToInsert.address &&
        o.phone === contactToInsert.phone &&
        o.email === contactToInsert.email
    );

    expect(expectedContact).toEqual(defaultContact);
    expect(otherExpectedContact).toEqual(contactToInsert);
  });
  it("POST /contacts", async () => {
    const res = await request(app).get("/contacts");
    const beforeCount = res.body.length;
    await request(app).post("/contacts").send(contactToInsert);
    const response = await request(app).get("/contacts");
    const afterCount = response.body.length;

    expect(afterCount).toEqual(beforeCount + 1);
  });
  it("PUT /contacts/:id", async () => {
    const res = await request(app).get("/contacts");
    const beforeCount = res.body.length;
    const idToPut = res.body[beforeCount - 1]._id;
    var expectedContact = res.body[beforeCount - 1];
    expectedContact.name.first = "hello";

    await request(app)
      .put("/contacts/" + idToPut)
      .send(expectedContact);
    const response = await request(app).get("/contacts/" + idToPut);
    const actualContact = response.body;

    expect(actualContact).toEqual(expectedContact);
  });
  it("GET /contacts/:id", async () => {
    const res = await request(app).get("/contacts");
    const beforeCount = res.body.length;
    const idToGet = res.body[beforeCount - 1]._id;
    const expectedContact = res.body[beforeCount - 1];
    const response = await request(app).get("/contacts/" + idToGet);

    expect(response.body).toEqual(expectedContact);
  });
  it("DELETE /contacts/:id", async () => {
    const res = await request(app).get("/contacts");
    const beforeCount = res.body.length;
    const idToDelete = res.body[beforeCount - 1]._id;
    await request(app).delete("/contacts/" + idToDelete);
    const response = await request(app).get("/contacts");
    const afterCount = response.body.length;

    expect(afterCount).toEqual(beforeCount - 1);
  });
});
