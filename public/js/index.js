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


$('#messageForm').on('submit', function(e) {
    e.preventDefault();

    socket.emit('createMessage', {
        to: 'user',
        text: $('[name=message]').val()
    }, function (data) {
        console.log(data);
    });
})

