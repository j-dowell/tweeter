$(document).ready(function() {

  // Slide in/out animation for compose tweet box
  $('.compose-button').on('click', function() {
    $( '.new-tweet' ).slideToggle(400, function() {
      $('.text-input').focus();
    });
  });

  function renderTweets(input) {
    // Reverses data array, to display tweets in correct order
    input.reverse(); 
    // Appends each tweet article to main container
    input.forEach(function(item) {
        let $tweet = createTweetElement(item);
        $('.tweet-container').append($tweet);
    });
  }
  
  // Fetches & renders latest tweet
  function loadNewTweet() {
    $.getJSON('/tweets', function(data) {
      let $input = createTweetElement(data[data.length - 1]);
      $('.tweet-container').prepend($input);
    });
  }
  
  // Renders all tweets in database, called once on page load
  function loadAllTweets() {
    $.getJSON('/tweets', function(data) {
      renderTweets(data);
    });
  }
  loadAllTweets();

  // Returns time difference (in days) between input and current time
  function getDayDifference(input) {
    let today = new Date();
    let todayMilliseconds = today.getTime();
    let difference = todayMilliseconds - input;
    let days = Math.round(difference / 86400000);
    return days;
  }

  // Escapes XSS 
  function escape(str) {
    let div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  // Makes html article from data object input properties
  function createTweetElement(data) {
    let $text = $("<article>").addClass("tweet");

    // Tweet properties
    let userName = data.user.name;
    let userAvatar = data.user.avatars.small;
    let userHandle = data.user.handle;
    let userContent = data.content.text;
    let days = getDayDifference(data.created_at);
    let likes = data.likes;
    let uniqueID = data['_id'];

    // HTML to append
    let insert = 
      `<header>
          <h2 class="full-name">${userName}</h2>
          <img src="${userAvatar}" class="profile-photo"></img>
          <div class="handle">${userHandle}</div>
      </header>
          <div id="text-container"><p class="tweet-text">${escape(userContent)}</p></div>
      <footer>${days} days ago <p class="like-counter" id="${uniqueID}">${likes} likes</p>
      <i data-id="${uniqueID}" class="material-icons fav">favorite</i>
      <i class="material-icons flag">flag</i>
      <i class="material-icons retweet">cached</i>
      </footer>`;

    $text.html(insert);
    return $text;
  }

  // Tweet submit
  $('form').submit(function(event) {
    event.preventDefault();
    
    // Hide error message
    $('.error').slideUp(100);

    // Data to send in ajax request
    let form = $(this).serialize();

    // Getting value of counter (and converting to number)
    let counterHTML = $(this).children('.counter');
    let numCounter = Number(counterHTML.context.innerText);

    if (numCounter !== 140 && numCounter >= 0 && numCounter !== 'null') {  // Valid user input
      $.ajax({
        type: "POST",
        url: "/tweets",
        data: form,
        success: function() {
          loadNewTweet();
          $("form")[0].reset(); // Clears form input box after submission
          $('span.counter').html('140'); // Resets counter
        },
        error: function() {
          console.log('An error occurred.');
        }
      });
    } else if (numCounter === 140) { // Display error message if user input is invalid
      $('#error1').delay(200).slideDown(200); 
    } else if (numCounter < 0) {
      $('#error2').delay(200).slideDown(200);
    }
  });

 // On like button click - grab unique tweet id and increment or decrement
  $('.tweet-container').click(function(event) {
    event.preventDefault();
    let target = $(event.target);
    let id = target.context.dataset.id;

    if (id) { // if element clicked has unique id  
      if ($(target).attr("id") !== 'like') { // And if it has not been liked on this pageload. (will fix after adding user login feature)
        let obj = { ObjectId : id, liked: false }; // Data to send in request
        $.post({
          type: "POST",
          url: `/${id}/likes`,
          data: obj, 
          success: function() {
            loadLikes(obj.ObjectId);
            $(target).attr('id', 'like').css({ 'color': 'red'});
          }
        });
      } else { // it has been liked already, so if decrement like counter by one and remove class & css
        let obj = { ObjectId : id, liked: true};
        $.post({
          type: "POST",
          url: `/${id}/likes`,
          data: obj,
          success: function() {
            loadLikes(obj.ObjectId);
            $(target).attr('id', '').css({'color': 'rgb(22, 72, 82'});
          }
        });
      }
    }
  });

  // Updates like counter for a tweet, given the tweet's unique ID
  function loadLikes(id) {
    $.getJSON('/tweets', function(data) {
      data.forEach(function(item) {
        if (item['_id'] === id) {
          let x = `${item.likes} likes`;
          $(`p#${id}`).html(x);
        }
      });
    });
  }
});
