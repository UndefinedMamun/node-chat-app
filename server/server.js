const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMeassage} = require('./utils/message');
const {Users} = require('./utils/Users');
const {isRealString} = require('./utils/validation');
const publicPath = path.join(__dirname, '/../public');
const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

io.on('connection', (socket) => {
    console.log('new user connected');

    

    socket.on('join', (params, callback) =>{
        if(!isRealString(params.name) || !isRealString(params.room)){
            return callback('Name and Room name are required.')
        }

        socket.join(params.room)
        socket.emit('newMessage', generateMessage('Admin', `Welcome ${params.name}`))

        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room);
        io.to(params.room).emit('updateList', users.getUserList(params.room))

        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin',`${params.name} joined`))


        callback();
    })

    socket.on('disconnect', () => {
        var user = users.removeUser(socket.id);
        
        if(user){
            io.to(user.room).emit('updateList', users.getUserList(user.room))
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left..`));
        }
        
    })


    socket.on('createMessage', (message, callback) => {
        console.log('createMessage', message);

        io.emit('newMessage', generateMessage(message.to, message.text));
        callback();

        // socket.broadcast.emit('newMessage', {
        //     from: message.to,
        //     text: message.text,
        //     createdAt: new Date().getTime()
        // })
    })

    socket.on('newLocation', (message) => {
        console.log(message);

        io.emit('newLocationMessage', generateLocationMeassage(message));
    })
})

app.use(express.static(publicPath));

server.listen(port, () => {
    console.log(`server is listening on ${port}...`)
})

