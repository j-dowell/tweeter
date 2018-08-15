/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

const data = [
    // {
    //   "user": {
    //     "name": "Newton",
    //     "avatars": {
    //       "small":   "https://vanillicon.com/788e533873e80d2002fa14e1412b4188_50.png",
    //       "regular": "https://vanillicon.com/788e533873e80d2002fa14e1412b4188.png",
    //       "large":   "https://vanillicon.com/788e533873e80d2002fa14e1412b4188_200.png"
    //     },
    //     "handle": "@SirIsaac"
    //   },
    //   "content": {
    //     "text": "If I have seen further it is by standing on the shoulders of giants"
    //   },
    //   "created_at": 1461116232227
    // },
    // {
    //   "user": {
    //     "name": "Descartes",
    //     "avatars": {
    //       "small":   "https://vanillicon.com/7b89b0d8280b93e2ba68841436c0bebc_50.png",
    //       "regular": "https://vanillicon.com/7b89b0d8280b93e2ba68841436c0bebc.png",
    //       "large":   "https://vanillicon.com/7b89b0d8280b93e2ba68841436c0bebc_200.png"
    //     },
    //     "handle": "@rd" },
    //   "content": {
    //     "text": "Je pense , donc je suis"
    //   },
    //   "created_at": 1461113959088
    // },
    // {
    //   "user": {
    //     "name": "Johann von Goethe",
    //     "avatars": {
    //       "small":   "https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1_50.png",
    //       "regular": "https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1.png",
    //       "large":   "https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1_200.png"
    //     },
    //     "handle": "@johann49"
    //   },
    //   "content": {
    //     "text": "Es ist nichts schrecklicher als eine tätige Unwissenheit."
    //   },
    //   "created_at": 1461113796368
    // }
  ];


$(document).ready(function() {

  function getDayDifference(input) {
    var today = new Date();
    var todayMilliseconds = today.getTime();
    var difference = todayMilliseconds - input;
    var days = Math.round(difference / 86400000)
    return days;
  }

  function createTweetElement(data) {
    var $text = $("<article>").addClass("tweet");
    var userName = data.user.name;
    var userAvatar = data.user.avatars.small;
    var userHandle = data.user.handle;
    var userContent = data.content.text;
    var days = getDayDifference(data.created_at);

    function escape(str) {
      var div = document.createElement('div');
      div.appendChild(document.createTextNode(str));
      return div.innerHTML;
    }

    var insert = `
        <header>
            <h2 class="full-name">${userName}</h2>
            <img src="${userAvatar}" class="profile-photo"></img>
            <div class="handle">${userHandle}</div>
        </header>
            <p class="tweet-text">${escape(data.content.text)}</p>
        <footer>${days} days ago</footer>
        <i class="material-icons">favorite</i>
        <i class="material-icons">flag</i>
        <i class="material-icons">cached</i>
        `
    $text.html(insert);
    return $text
  }

  function renderTweets(input) {
    input.reverse();
      input.forEach(function(item) {
          var $tweet = createTweetElement(item);
          $('.tweet-container').append($tweet);
      })
  }

  $('form').submit(function(event) {
    event.preventDefault();

    let form = $( this ).serialize();
    let counterHTML = $(this).children('.counter')
    let numCounter = Number(counterHTML.context.innerText);
  
    if (numCounter !== 140 && numCounter >= 0 && numCounter !== 'null') {

    $.ajax({
      type: "POST",
      url: "/tweets",
      data: form,
      success: function (data) {
        console.log('Submission was successful.');
        loadTweet();
        $("form")[0].reset(); // Clears form input box after submission
      },
      error: function (data) {
        console.log('An error occurred.');
      }
    })
  } else {
    alert('Invalid input')
  }
  })

  function loadTweet() {
    $.getJSON('/tweets', function(data) {
      let $input = createTweetElement(data[data.length - 1]);
      $('.tweet-container').prepend($input);
    })
  }

  function loadTweets() {
    $.getJSON('/tweets', function(data) {
      renderTweets(data);
    })
  }

  loadTweets()

})
