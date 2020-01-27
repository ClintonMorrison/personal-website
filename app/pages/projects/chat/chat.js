$(document).ready(function () {
  var _scrollToBottom = function(selector) {
    var element = $(selector)[0];
    var height = element.scrollHeight;
    $(element).scrollTop(height);
  };

  window.scrollToBottom = _scrollToBottom;

  window.chat = {
    getResponse: function(message, callback) {
      $.ajax({
        type: 'GET',
        url: '/projects/chatbot/respond',
        data: {'message': message},
        success: function (data) {
          console.log(data);
          if (callback) {
            setTimeout(function() {callback(data.message);}, 400);
          }
        }
      });
    },
    submitMessage: function() {
      var text = $('.submit-area input[type="text"]').val();

      if (!text) {
        return;
      }

      window.chat.addMessage('user', text);
      $('.submit-area input[type="text"]').val('');

      $('.submit-area .status').text('Computer is typing...');      

      window.chat.getResponse(text, function (response) {
        $('.submit-area .status').text('');
        window.chat.addMessage('computer', response);
      });      

    },

    addMessage: function(source, message) {
      var messageDiv = $(
        '<div>',
        {'class': 'message ' + source}
      ).text(message);

      $('.messages').append(messageDiv);
      $('.messages').append($('<div>', {'style': 'clear:both'}));
      _scrollToBottom('.messages');
    }
  };

  $(document).keypress(function(e) {
      if(e.which == 13) {
        chat.submitMessage();
      }
  });

});
