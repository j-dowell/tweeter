$(document).ready(function() {
    $('textarea').on('keyup', function() {
        var counter = $(this).closest('form').children('.counter')
        counter.html(140 - this.value.length)
        if (this.value.length > 140) {
            counter.css('color', 'red');
        } else {
            counter.css('color', 'black');
        }
    })
  });