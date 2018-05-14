class Users {
    constructor () {
        this.users = [];
    }

    addUser (id, name, room) {
        var user = {id, name, room};
        this.users.push(user);
        return user;
    }

    isUserExist(name, room) {
        name = name.toLowerCase();
        var user = this.users.filter((user) => user.name.toLowerCase() === name && user.room === room)
        if(user.length > 0)
            return true;
        return false;
    }

    removeUser(id) {
        var user = this.getUser(id);
        this.users = this.users.filter((user) => user.id != id);
        return user;
    }

    getUser (id) {
        return this.users.filter((user) => user.id === id)[0];
    }

    getUserList(room){
        var users = this.users.filter((user) => user.room === room);
        var nameArray = users.map((user) => user.name);
        return nameArray;
    }
}

module.exports = {Users};