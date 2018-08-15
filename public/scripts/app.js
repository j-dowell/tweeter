/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

$(document).ready(function() {

  $('.compose-button').on('click', function() {
    $( '.new-tweet' ).slideToggle(400, function() {
      $('.text-input').focus();
    });
  })

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

    var insert = 
      `<header>
          <h2 class="full-name">${userName}</h2>
          <img src="${userAvatar}" class="profile-photo"></img>
          <div class="handle">${userHandle}</div>
      </header>
          <div id="text-container"><p class="tweet-text">${escape(data.content.text)}</p></div>
      <footer>${days} days ago</footer>
      <i class="material-icons">favorite</i>
      <i class="material-icons">flag</i>
      <i class="material-icons">cached</i>`

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
    $('.error').slideUp(100);
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
          loadNewTweet();
          $("form")[0].reset(); // Clears form input box after submission
          $('span.counter').html('140'); // Resets counter
        },
        error: function (data) {
          console.log('An error occurred.');
        }
      })
    } else {
      $('.error').delay(100).slideDown(200);
    }
  })

  function loadNewTweet() {
    $.getJSON('/tweets', function(data) {
      let $input = createTweetElement(data[data.length - 1]);
      $('.tweet-container').prepend($input);
    })
  }

  function loadAllTweets() {
    $.getJSON('/tweets', function(data) {
      renderTweets(data);
    })
  }

  loadAllTweets()

})
