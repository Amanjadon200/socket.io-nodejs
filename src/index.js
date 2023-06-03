const express = require('express');
const socketio = require('socket.io');
const path = require('path');
const app = express();
const http = require('http');
const { addUser, getUser, getUsersInRoom, removeUser } = require('./utils/user');
const { message } = require('./utils/message');
// const options = {
//     cors: true,
//     origins: ["http://localhost:3000/"],
//   };
const server = http.createServer(app);
const io = socketio(server);
const directoryPath = path.join(__dirname, '../public');
const port = process.env.port;

io.on('connection', (socket) => {
    console.log('websocket connection established', socket.id);
    // socket.on('valueChange',(value)=>{
    //     io.emit("countUpdated", value+1);
    // })
    // socket.broadcast.emit('message', 'user joined');
    // console.log(socket)
    socket.on('sendMessage', (cityName, room) => {
        const info = getUser(socket.id);
        io.in(room).emit("sendCityNameToAllClients", message(cityName, info.username));
    });
    socket.on('disconnect', () => {
        const user = getUser(socket.id);
        removeUser(socket.id);
        let usersInRoom = getUsersInRoom(user.room);
        io.in(user.room).emit('leftTheChat', `${user.username} left the chat`, usersInRoom);
    });
    socket.on('USER:SEND_LOCATION', (data, callback) => {

        const userInfo = getUser(socket.id);
        const payload = JSON.parse(data);
        // socket.broadcast.emit('message', 'https://www.google.com/maps?q=' + payload.coords.latitude + "," + payload.coords.longitude);
        io.in(userInfo.room).emit('setLocation', message('https://www.google.com/maps?q=' + payload.coords.latitude + "," + payload.coords.longitude));
        callback('Location shared');
    });
    socket.emit('message', "Welcome!");
    socket.on('join', (username, room) => {
        const addOrNot = addUser(username, room, socket.id);
        if (addOrNot.error !== 'no error') {
            var destination = 'http://localhost:3000';
            socket.emit('redirect', destination);
        }
        else {
            socket.join(room);
            io.in(room).emit('joinedChat', username + " joined the chat", getUsersInRoom(room));
        }
    });
});
app.use(express.static(directoryPath));
// app.get('/', (req, res) => {
//     res.sendFile(directoryPath);
// });
server.listen(port, () => {
    console.log('server is listening at', port);
}
)
// :      p        )   {    0    p;
