var socket = io();

socket.on('connect', function(){
    console.log('connected to server.');

    socket.emit('createMessage', {
        to: 'bc@gmail.com',
        text: 'something something nothing nothing..'
    })
})

socket.on('disconnect', function(){
    console.log('disconnected from server.')
})

socket.on('newMessage', function(message){
    console.log('new Message', message)
})

