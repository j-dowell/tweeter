"use strict";

var ObjectId = require('mongodb').ObjectID;

// Defines helper functions for saving and getting tweets, using the database `db`
module.exports = function makeDataHelpers(db) {
  return {

    

    // Saves a tweet to `db`
    saveTweet: function(newTweet, callback) {
      db.collection('tweets').insertOne(newTweet);
      callback(null, true);
    },

    // Get all tweets in `db`, sorted by newest first
    getTweets: function(callback) {
      db.collection("tweets").find().toArray(callback);
    },

    likeTweet: function(tweet, callback) {
      console.log('liked!', tweet)
      db.collection("tweets").updateOne({'_id':ObjectId(tweet)}, { $inc: {'likes': 1} } );
      callback(null, true);
    },

    // unLikeTweet: function(tweet) {

    // }
  }
}
