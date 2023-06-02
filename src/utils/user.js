const user = [];
const addUser = (username, room, id ) => {
    const usern = username.toLowerCase();
    if (usern==='' || room==='') {
        return {
            error: "please provide username and room"
        };
    }
    for (let index = 0; index < user.length; index++) {
        const element = user[index];
        if (element.username === usern && parseInt(element.room) === parseInt(room)) {
            return {
                error: 'please provide some other username'
            };
        }
    }
    user.push({ username, room, id });
    return { error: 'no error' };
};
const removeUser = ({ id }) => {
    const u = [];
    user.forEach(user => {
        if (!(user.id === id)) {
            u.push(user);
        }
    });
    user = u;
};
const getUser = (id) => {
    user.forEach(user => {
        if (user.id === id) {
            return user;
        }
    });
};
const getUserInRoom = (room) => {
    const userInRoom = [];
    user.forEach(user => {
        if (user.room === room) {
            userInRoom.push(user);
        }
    });
};
module.exports= { addUser, removeUser, getUser, getUserInRoom };