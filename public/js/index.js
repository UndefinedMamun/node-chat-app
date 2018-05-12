var socket = io();

socket.on('connect', function(){
    console.log('connected to server.');
})

socket.on('disconnect', function(){
    console.log('disconnected from server.')
})

socket.on('newMessage', function(message){
    var li = `<li>${message.from}: ${message.text}</li>`;
    $('#messages').append(li);
    console.log('new Message', message)
})

socket.on('newLocationMessage', function(message) {
    var li = `<li>${message.from}: <a target='_blank' href='${message.url}'>location</a></li>`;
    $('#messages').append(li);
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

