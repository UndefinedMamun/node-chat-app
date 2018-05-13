const expect = require('expect');

const {Users} = require('./Users');


describe('Users', () => {
    var users;

    beforeEach(() => {
        users = new Users();
        users.users = [{
            id: '1',
            name: 'Mike',
            room: 'Test Room 1'
        }, {
            id: '2',
            name: 'Sakkhor',
            room: 'Test Room 2'
        }, {
            id: '3',
            name: 'Sobuj',
            room: 'Test Room 1'
        }]
    });



    it('should add a new user', () => {
        let users = new Users();
        var user = {
            id: '123',
            name: 'Jhon',
            room: 'testRoom'
        };
        var newUser = users.addUser(user.id, user.name, user.room);
        expect(newUser).toEqual(user);
    });

    it('should remove a user', () => {
        users.removeUser(users.users[0].id);
        expect(users.users.length).toBe(2);
    });

    it('should not remove a user', () => {
        users.removeUser('5374');
        expect(users.users.length).toBe(3);
    });

    it('should find the user', () => {
        var user = users.getUser(users.users[2].id);
        expect(user).toEqual(users.users[2]);
    });

    it('should not find the user', () => {
        var user = users.getUser('2344');
        expect(user).toBe(undefined);
    })

    it('should return names for Test Room 1', () => {
        var list = users.getUserList('Test Room 1');
        expect(list).toEqual(['Mike', 'Sobuj']);
    })

    it('should return names for Test Room 2', () => {
        var list = users.getUserList('Test Room 2');
        expect(list).toEqual(['Sakkhor']);
    })
})