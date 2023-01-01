const express = require("express");
const MongoClient = require('mongodb').MongoClient;
const mongodb = require('mongodb');
const bodyParser = require("body-parser");


// Load the DB_KEY from the .env file
require('dotenv').config();
const DB_KEY = process.env.DB_KEY;

// Connect to the MongoDB database
const uri = `mongodb+srv://murraycopps:murraycopps@runningdb.kcfyvxs.mongodb.net/test?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
    if (err) {
        console.error(err);
    } else {
        console.log('Connected to the database!');
    }
});

const app = express();
app.use(bodyParser.json());

// Create a route that queries the database
app.get("/notes", (req, res) => {
    const db = client.db("notes");
    const collection = db.collection("notes");

    collection.find({}).toArray((err, result) => {
        if (err) {
            console.error(err);
            res.send({ success: false, msg: "Error occurred while querying the database" });
        } else {
            res.send({ success: true,  data: result });
        }
    });
});

app.get("/notes/:id", (req, res) => {
    const db = client.db("notes");
    const collection = db.collection("notes");

    // Convert the ID parameter to an ObjectId
    const id = new mongodb.ObjectId(req.params.id);

    // Find the note with the matching _id
    collection.findOne({ _id: id }, (err, result) => {
        if (err) {
            console.error(err);
            res.send({ success: false, msg: "Error occurred while querying the database" });
        } else {
            res.send({ success: true, data: result });
        }
    });
});

app.post("/notes", (req, res) => {
    const db = client.db("notes");
    const collection = db.collection("notes");
    const note = { name: req.body.name, text: req.body.text };

    if (note.name && note.text) {
        collection.insertOne(note, (err, result) => {
            if (err) {
                console.error(err);
                res.send({ success: false, msg: "Error occurred while inserting the note" });
            } else {
                res.send({ success: true, msg: "Note inserted successfully" });
            }
        });
    } else {
        res.status(400).send({ success: false, msg: "Invalid note" });
    }
});




// Start the server
app.listen(3000, () => {
    console.log("Server listening on port 3000");
});
