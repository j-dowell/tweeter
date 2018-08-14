/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

const data = [
    {
      "user": {
        "name": "Newton",
        "avatars": {
          "small":   "https://vanillicon.com/788e533873e80d2002fa14e1412b4188_50.png",
          "regular": "https://vanillicon.com/788e533873e80d2002fa14e1412b4188.png",
          "large":   "https://vanillicon.com/788e533873e80d2002fa14e1412b4188_200.png"
        },
        "handle": "@SirIsaac"
      },
      "content": {
        "text": "If I have seen further it is by standing on the shoulders of giants"
      },
      "created_at": 1461116232227
    },
    {
      "user": {
        "name": "Descartes",
        "avatars": {
          "small":   "https://vanillicon.com/7b89b0d8280b93e2ba68841436c0bebc_50.png",
          "regular": "https://vanillicon.com/7b89b0d8280b93e2ba68841436c0bebc.png",
          "large":   "https://vanillicon.com/7b89b0d8280b93e2ba68841436c0bebc_200.png"
        },
        "handle": "@rd" },
      "content": {
        "text": "Je pense , donc je suis"
      },
      "created_at": 1461113959088
    },
    {
      "user": {
        "name": "Johann von Goethe",
        "avatars": {
          "small":   "https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1_50.png",
          "regular": "https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1.png",
          "large":   "https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1_200.png"
        },
        "handle": "@johann49"
      },
      "content": {
        "text": "Es ist nichts schrecklicher als eine tätige Unwissenheit."
      },
      "created_at": 1461113796368
    }
  ];
  


$(document).ready(function() {

    function createTweetElement(data) {
        var today = new Date();
        var todayMilliseconds = today.getTime();
        var difference = todayMilliseconds - data.created_at;
        var days = Math.round(difference / 86400000)
        var $text = $("<article>").addClass("tweet");
        var insert = `
            <header>
                <h2 class="full-name">${data.user.name}</h2>
                <img src="${data.user.avatars.small}" class="profile-photo"></img>
                <span class="handle">${data.user.handle}</span>
            </header>
                <p class="tweet-text">${data.content.text}</p>
            <footer>${days} days ago</footer>
            <i class="material-icons">favorite</i>
            <i class="material-icons">flag</i>
            <i class="material-icons">cached</i>
            `
        $text.html(insert);
        return $text
    }
    // var $tweet = createTweetElement(tweetData);
    // console.log($tweet);
    // $('.tweet-container').append($tweet);

    function renderTweets(input) {
        input.forEach(function(item) {
            var $tweet = createTweetElement(item);
            $('.tweet-container').append($tweet);
        })
    }
    renderTweets(data);
  })
