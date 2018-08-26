var socket = io();
/* This initiate a request from client to server,
  and this method is accessible here beacause of the above file inclusion */

function scrollToBottom () {
  // Selectors
  var messages = jQuery('#messages');
  var newMessage = messages.children('li:last-child');

  // Heights
  var clientHeight = messages.prop('clientHeight');
  var scrollTop = messages.prop('scrollTop');
  var scrollHeight = messages.prop('scrollHeight');
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight();

  if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
    messages.scrollTop(scrollHeight);
  }
}

socket.on('connect', function () {
  var params = jQuery.deparam(window.location.search);

  socket.emit('join', params, function (err) {
    if (err) {
      alert(err);
      window.location.href = '/';
    } else {
      console.log('No error');
    }
  });
});

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

socket.on('updateUserList', function (users) {
  var ol = jQuery('<ol></ol>');

  users.forEach(function (user) {
    ol.append(jQuery('<li></li>').text(user));
  });

  jQuery('#users').html(ol);
});

socket.on('newMessage', function (message) {
  var formattedTime = moment(message.createdAt).format('h:mm a');
  var template = jQuery('#message-template').html();
  var html = Mustache.render(template, {
    text: message.text,
    from: message.from,
    createdAt: formattedTime
  });

  jQuery('#messages').append(html);
  scrollToBottom();
});

socket.on('newLocationMessage', function(message) {
  var formattedTime = moment(message.createdAt).format('h:mm a');
  var template = jQuery('#location-message-template').html();
  var html = Mustache.render(template, {
    from: message.from,
    createdAt: formattedTime,
    url: message.url
  });

  jQuery('#messages').append(html);
  scrollToBottom();
});

jQuery('#message-form').on('submit', function (e) {
  e.preventDefault();
  var messageTextBox = jQuery('[name=message]');

  socket.emit('createMessage', {
    text: _showEmoji(messageTextBox.val())
    //text: messageTextBox.val()
  }, function() {
    messageTextBox.val('')
  });
});

var locationButton = jQuery('#send-location');
locationButton.on('click', function () {
  if (!navigator.geolocation) {
    return alert('Geolocation not supported by ur browser');
  }

  locationButton.attr('disabled', 'disabled').text('Sending location...');

  navigator.geolocation.getCurrentPosition(function (position) {
    locationButton.removeAttr('disabled').text('Send location');

    socket.emit('createLocationMesage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  }, function() {
    alert('Unable to fetch loaction');
    locationButton.removeAttr('disabled').text('Sending location');
  })
});

var _showEmoji = function(msg) {
  return msg;
};

/***** Start: Emoji Section ****/
// var _initialEmoji = function() {
//     var emojiContainer = document.getElementById('emojiWrapper'),
//         docFragment = document.createDocumentFragment();
//     for (var i = 69; i > 0; i--) {
//         var emojiItem = document.createElement('img');
//         emojiItem.src = '../content/emoji/' + i + '.gif';
//         emojiItem.title = i;
//         docFragment.appendChild(emojiItem);
//     };
//     emojiContainer.appendChild(docFragment);
// };
// var _showEmoji = function(msg) {
//     var match, result = msg,
//         reg = /\[emoji:\d+\]/g,
//         emojiIndex,
//         totalEmojiNum = document.getElementById('emojiWrapper').children.length;
//
//     while (match = reg.exec(msg)) {
//         emojiIndex = match[0].slice(7, -1);
//         if (emojiIndex > totalEmojiNum) {
//             result = result.replace(match[0], '[X]');
//         } else {
//             result = result.replace(match[0], '<img class="emoji" src="../content/emoji/' + emojiIndex + '.gif" />');//todo:fix this in chrome it will cause a new request for the image
//         };
//     };
//     return result;
// };
//
// document.getElementById('emoji').addEventListener('click', function(e) {
//     var emojiwrapper = document.getElementById('emojiWrapper');
//     emojiwrapper.style.display = 'block';
//     e.stopPropagation();
// }, false);
//
// document.body.addEventListener('click', function(e) {
//     var emojiwrapper = document.getElementById('emojiWrapper');
//     if (e.target != emojiwrapper) {
//         emojiwrapper.style.display = 'none';
//     };
// });
//
// document.getElementById('emojiWrapper').addEventListener('click', function(e) {
//     var target = e.target;
//     if (target.nodeName.toLowerCase() == 'img') {
//         var messageInput = document.getElementById('messageInput');
//         messageInput.focus();
//         messageInput.value = messageInput.value + '[emoji:' + target.title + ']';
//     };
// }, false);
//
// jQuery(document).ready(function() {
//   _initialEmoji();
// });
/***** End: Emoji Section *****/
