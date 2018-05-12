var generateMessage = (from, text) => {
    return {
        from,
        text,
        createdAt: new Date().getTime()
    };
};

var generateLocationMeassage = (message) => {
    return {
        from: message.from,
        url: `https://google.com/maps?q=${message.lat},${message.lon}`,
        createdAt: new Date().getTime()
    }
}

module.exports = {generateMessage, generateLocationMeassage};