"use strict";


const express       = require('express');
const tweetsRoutes  = express.Router();

module.exports = function(DataHelpers) {
    tweetsRoutes.post('/', function(req, res) {
        let id = req.body.ObjectId;
        let liked2 = req.body.liked;
        console.log(liked2)

        DataHelpers.likeTweet(id, liked2, (err) => {
            if (err) {
              res.status(500).json({ error: err.message });
              console.log('not okay')
            } else {
              res.status(201).send();
              console.log('okay')
            }
          });
      });

  return tweetsRoutes;

}
