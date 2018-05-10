const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage} = require('./utils/message');
const publicPath = path.join(__dirname, '/../public');
const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

io.on('connection', (socket) => {
    console.log('new user connected');

    socket.emit('newMessage', generateMessage('admin', 'Welcome..'))

    socket.broadcast.emit('newMessage', generateMessage('Admin','New user joined'))

    socket.on('disconnect', () => {
        console.log('user disconnected..')
    })

    // socket.emit('newMessage', {
    //     from: "Abc",
    //     text: "bla bla bla",
    //     createdAt: new Date().getTime()
    // })

    socket.on('createMessage', (message, callback) => {
        console.log('createMessage', message);

        io.emit('newMessage', generateMessage(message.to, message.text));
        callback('got it..');

        // socket.broadcast.emit('newMessage', {
        //     from: message.to,
        //     text: message.text,
        //     createdAt: new Date().getTime()
        // })
    })
})

app.use(express.static(publicPath));

server.listen(port, () => {
    console.log(`server is listening on ${port}...`)
})

