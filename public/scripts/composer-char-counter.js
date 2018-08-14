$(document).ready(function() {
    $('textarea').on('keyup', function() {
        var counter = $(this).siblings('.counter')
        counter.html(140 - this.value.length)
        if (this.value.length > 140) {
            counter.css('color', 'red');
        } else {
            counter.css('color', 'black');
        }
    })
  });


  // To do - change css - make a class in css sheet for when its done. Toggle class 