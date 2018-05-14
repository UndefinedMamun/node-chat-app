const moment = require('moment');

var now = moment();

// console.log(now.format('h:mm a'));


var inTypingUser = ['mamun', 'asif'];


let length = inTypingUser.length;
var userNames = "";
let isOrAre='is';

if(length > 1)
    isOrAre='are';

inTypingUser.forEach((name, i)=> {
    let delimiter = ', ';

    if(i+1 == length){ //last
        delimiter = ' ';
    } else if(i == length-2) {//last-1
        delimiter = ' and ';
    }
    
    userNames = userNames+name+delimiter;
})
var message = `${userNames}${isOrAre} typing..`;
console.log(message);