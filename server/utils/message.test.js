var expect = require('expect');

var {generateMessage, generateLocationMeassage} = require('./message');

describe('generateMessage', () => {
    it('should generate correct message object', () =>{
        var from = "jen";
        var text = "some message";
        var message = generateMessage(from, text);

        expect(message.createdAt).toBeA('number');
        expect(message).toInclude({from, text});
    })
})

describe('generateLocationMessage', () => {
    it('should generate correct location message object', () => {
        var message = {
            from: 'someone',
            lat: 3274654,
            lon: 5746874
        }
        
        var resultMsg = generateLocationMeassage(message);
        
        expect(resultMsg.createdAt).toBeA('number');
        expect(resultMsg.from).toBe(message.from);
        expect(resultMsg.url).toExist();
    })
})