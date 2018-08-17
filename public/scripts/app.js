$(document).ready(function() {
  // Slide in/out animation for compose tweet box
  $('.compose-button').on('click', function() {
    $( '.new-tweet' ).slideToggle(400, function() {
      $('.text-input').focus();
    });
  })

  // Returns time difference (in days) between input and current time
  function getDayDifference(input) {
    var today = new Date();
    var todayMilliseconds = today.getTime();
    var difference = todayMilliseconds - input;
    var days = Math.round(difference / 86400000)
    return days;
  }

  // Escapes XSS 
  function escape(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  // Makes html article from data object input properties
  function createTweetElement(data) {
    var $text = $("<article>").addClass("tweet");
    var userName = data.user.name;
    var userAvatar = data.user.avatars.small;
    var userHandle = data.user.handle;
    var userContent = data.content.text;
    var days = getDayDifference(data.created_at);
    var likes = data.likes;
    var uniqueID = data['_id'];

    var insert = 
      `<header>
          <h2 class="full-name">${userName}</h2>
          <img src="${userAvatar}" class="profile-photo"></img>
          <div class="handle">${userHandle}</div>
      </header>
          <div id="text-container"><p class="tweet-text">${escape(userContent)}</p></div>
      <footer>${days} days ago <p class="like-counter" id="${uniqueID}">${likes} likes</p>
      </footer>
      <i data-id="${uniqueID}" class="material-icons">favorite</i>
      <i class="material-icons">flag</i>
      <i class="material-icons">cached</i>
      `

    $text.html(insert);
    return $text
  }

  // On favourite click - grab unique tweet id 
  $('.tweet-container').click(function(event) {
    event.preventDefault();
    var target = $(event.target);
    var id = target.context.dataset.id;


    if (id) {
      if ($(target).attr("id") !== 'like') {
        console.log('is not liked')
        let obj = { ObjectId : id, liked: false };
        $.post({
          type: "POST",
          url: `/${id}/likes`,
          data: obj, 
          success: function() {
            loadLikes(obj.ObjectId);
            console.log($(event.target))
            $(target).attr('id', 'like').css({ 'color': 'red'} )
          }
      })
    } else {
      let obj = { ObjectId : id, liked: true}
      console.log('is liked')
      $.post({
        type: "POST",
        url: `/${id}/likes`,
        data: obj,
        success: function() {
          loadLikes(obj.ObjectId);
          $(target).attr('id', '').css({ 'color': 'rgb(22, 72, 82'} )
        }
    })
    }
  }
})

  function loadLikes(id) {
    $.getJSON('/tweets', function(data) {
      data.forEach(function(item) {
        if (item['_id'] === id) {
          let x = `${item.likes} likes`;
          $(`p#${id}`).html(x);
        }
      })
    })
  }

  function renderTweets(input) {
    // Reverses data array, to display tweets in correct order
    input.reverse(); 
    // Appends each tweet article to main container
    input.forEach(function(item) {
        var $tweet = createTweetElement(item);
        $('.tweet-container').append($tweet);
    })
  }
  
  // Fetches latest tweet
  function loadNewTweet() {
    $.getJSON('/tweets', function(data) {
      let $input = createTweetElement(data[data.length - 1]);
      $('.tweet-container').prepend($input);
    })
  }
  
  // Renders all tweets in database, called once on page load
  function loadAllTweets() {
    $.getJSON('/tweets', function(data) {
      renderTweets(data);
    })
  }
  loadAllTweets()

  

  // Event listener for form submit
  $('form').submit(function(event) {
    event.preventDefault();
    
    // Hide error message
    $('.error').slideUp(100)

    let form = $(this).serialize();

    // Getting value of counter (and converting to number)
    let counterHTML = $(this).children('.counter') 
    let numCounter = Number(counterHTML.context.innerText);

    if (numCounter !== 140 && numCounter >= 0 && numCounter !== 'null') { 
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
      })
    } else if (numCounter === 140) { // Display error message if user input is invalid
      $('#error1').delay(200).slideDown(200); 
    } else if (numCounter < 0) {
      $('#error2').delay(200).slideDown(200);
    }
  })
})