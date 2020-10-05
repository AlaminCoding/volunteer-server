const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const ObjectId = require("mongodb").ObjectId;
const MongoClient = require("mongodb").MongoClient;
require("dotenv").config();
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jqzhy.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client.connect((err) => {
  const serviceCollection = client.db("volunteer-db").collection("services");
  const userCollection = client.db("volunteer-db").collection("users");
  console.log("database connected");

  app.get("/allServices", (req, res) => {
    serviceCollection.find({}).toArray((err, data) => {
      res.send(data);
    });
  });

  app.post("/addUserService", (req, res) => {
    const data = req.body;
    userCollection
      .insertOne(data)
      .then((result) => console.log("Successfully user service added"));
  });

  app.get("/singleUser/:email", (req, res) => {
    userCollection
      .find({ email: req.params.email })
      .toArray((err, document) => {
        res.send(document);
      });
  });

  app.get("/allUser", (req, res) => {
    userCollection.find({}).toArray((err, document) => {
      res.send(document);
    });
  });

  app.delete("/delete/:id", (req, res) => {
    userCollection
      .deleteOne({ _id: ObjectId(req.params.id) })
      .then((result) => {
        console.log("Delete Successfully");
      });
  });

  app.get("/image/:service", (req, res) => {
    serviceCollection
      .find({ title: req.params.service })
      .toArray((err, document) => {
        res.send(document[0]);
      });
  });
  app.get("/", (req, res) => res.send("HEELO"));
});

app.listen("4200", console.log("Listening to 4200"));
