var socket = io();

socket.on('connect', function(){
    console.log('connected to server.');
})

socket.on('disconnect', function(){
    console.log('disconnected from server.')
})

function scrollToBottom () {
    var messages = $('#messages');
    var newMessage = messages.children('li:last-child');

    var clientHeight = messages.prop('clientHeight');
    var scrollHeight = messages.prop('scrollHeight');
    var scrollTop = messages.prop('scrollTop');
    var newMessageHeight = newMessage.innerHeight()
    var lastMessageHeight = newMessage.prev().innerHeight();

    if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight){
        messages.scrollTop(scrollHeight);
    }
}

socket.on('newMessage', function(message){
    var formatedTime = moment(message.createdAt).format('h:mm a');
    var template = $('#message-template').html();
    var html = Mustache.render(template, {
        from: message.from,
        text: message.text,
        createdAt: formatedTime
    })
    $('#messages').append(html);
    scrollToBottom();
})

socket.on('newLocationMessage', function(message) {
    var formatedTime = moment(message.createdAt).format('h:mm a');
    // var li = `<li>${message.from} ${formatedTime}: <a target='_blank' href='${message.url}'>location</a></li>`;
    var template = $('#location-message-template').html();
    var html = Mustache.render(template, {
        from: message.from,
        url: message.url,
        createdAt: formatedTime
    })
    $('#messages').append(html);
    scrollToBottom();
})


$('#messageForm').on('submit', function(e) {
    e.preventDefault();
    var messageTextBox = $('[name=message]');

    socket.emit('createMessage', {
        to: 'user',
        text: messageTextBox.val()
    }, function () {
        messageTextBox.val('');
    });
})
var locationButton = $('#location');
locationButton.on('click', function() {
    if(!navigator.geolocation) {
        return alert("this browser don't support location.");
    }

    locationButton.attr('disabled', 'disabled').text('Sending location..')

    navigator.geolocation.getCurrentPosition(function (postion) {
        // console.log(postion.coords.longitude, postion.coords.latitude);
        locationButton.removeAttr('disabled').text('Send location')
        socket.emit('newLocation', {
            from: 'admin',
            lat: postion.coords.latitude,
            lon: postion.coords.longitude
        })
    }, function(){
        locationButton.removeAttr('disabled').text('Send location')
        alert('something went wrong.. please try again..');
    })
})

