var socket = io();
var inTypingUser = [];

socket.on('connect', function(){
    var params = $.deparam(window.location.search);
    socket.emit('join', params, function(err){
        if (err) {
            alert(err);
            window.location.href = '/';
        } else {
            console.log('no err')
        }
    })
})

socket.on('updateList', function (list) {
    var ol = $('<ol></ol>');
    
    list.forEach(function(user){
        ol.append(`<li>${user}</li>`);
    });
    $('#users').html(ol);
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

socket.on('typing',function(name){
    if(inTypingUser.indexOf(name) == -1) {
        inTypingUser.push(name);
    }

    renderTypingMessage();
})

socket.on('cancelTyping',function(name){
    var index = inTypingUser.indexOf(name)
    if(index != -1)
        inTypingUser.splice(index,1);
    
    if(inTypingUser.length == 0) {
        $("#typing").css('display','none');
    } else {
        renderTypingMessage();
    }
})

function renderTypingMessage (){
    var length = inTypingUser.length;
    var userNames = "";
    var isOrAre='is';

    if(length > 1)
        isOrAre='are';

    inTypingUser.forEach((name, i)=> {
        var delimiter = ', ';

        if(i+1 == length){ //last
            delimiter = ' ';
        } else if(i == length-2) {//last-1
            delimiter = ' and ';
        }
        
        userNames = userNames+name+delimiter;
    })
    var message = `${userNames}${isOrAre} typing..`;
    $("#typing").html(message).css('display','inline');
}


$('#messageForm').on('submit', function(e) {
    e.preventDefault();
    var messageTextBox = $('[name=message]');

    socket.emit('createMessage', messageTextBox.val()
    , function () {
        messageTextBox.val('');
    });
})

$('[name=message]').focus(function(e) {
    socket.emit('typing')
    // console.log('in')
})

$('[name=message]').focusout(function(e) {
    socket.emit('cancelTyping')
    // console.log('out')
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
            lat: postion.coords.latitude,
            lon: postion.coords.longitude
        })
    }, function(){
        locationButton.removeAttr('disabled').text('Send location')
        alert('something went wrong.. please try again..');
    })
})

