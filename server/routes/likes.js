"use strict";


const express       = require('express');
const tweetsRoutes  = express.Router();

module.exports = function(DataHelpers) {

    tweetsRoutes.post('/', function(req, res) {
        let id = req.body.ObjectId;
        let liked = req.body.liked;

        DataHelpers.likeTweet(id, liked, (err) => {
            if (err) {
              res.status(500).json({ error: err.message });
            } else {
              res.status(201).send();
            }
          });
      });

  return tweetsRoutes;

}
