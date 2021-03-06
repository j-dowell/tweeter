"use strict";
require('dotenv').config();

// Basic express setup:

const PORT          = 8080;
const express       = require("express");
const bodyParser    = require("body-parser");
const app           = express();
const MongoClient = require("mongodb").MongoClient;
const MONGODB_URI = process.env.MONGODB_URI;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Initiating Mongo DB connection
MongoClient.connect(MONGODB_URI, (err, db) => {
  if (err) {
    console.error(`Failed to connect: ${MONGODB_URI}`);
    db.close();
    throw err;
  }
  
  const DataHelpers = require("./lib/data-helpers.js")(db);
  const tweetsRoutes = require("./routes/tweets")(DataHelpers);
  const likeRoutes = require("./routes/likes")(DataHelpers);

  // Mount the routes: 
  app.use("/tweets", tweetsRoutes);
  app.use("/:id/likes", likeRoutes);
  
  app.listen(process.env.PORT || 5000, () => {
    console.log("Example app listening on port " + process.env.PORT || 5000);
  });

});