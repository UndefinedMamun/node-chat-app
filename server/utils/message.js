const moment = require('moment');

var generateMessage = (from, text) => {
    return {
        from,
        text,
        createdAt: moment().valueOf()
    };
};

var generateLocationMeassage = (message) => {
    return {
        from: message.from,
        url: `https://google.com/maps?q=${message.lat},${message.lon}`,
        createdAt: moment().valueOf()
    }
}

module.exports = {generateMessage, generateLocationMeassage};