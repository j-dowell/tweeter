"use strict";


const express       = require('express');
const tweetsRoutes  = express.Router();

module.exports = function(DataHelpers) {
    tweetsRoutes.post('/', function(req, res) {
        console.log(req.body);
        let id = req.body.ObjectId;

        DataHelpers.likeTweet(id, (err) => {
            if (err) {
              res.status(500).json({ error: err.message });
            } else {
              res.status(201).send();
            }
          });
      });
      
  return tweetsRoutes;

}
