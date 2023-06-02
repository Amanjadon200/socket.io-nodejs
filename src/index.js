const express = require('express');
const socketio = require('socket.io');
const path = require('path');
const app = express();
const http = require('http');
const { addUser } = require('./utils/user');
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
    console.log('websocket connection established');
    // socket.on('valueChange',(value)=>{
    //     io.emit("countUpdated", value+1);
    // })
    // socket.broadcast.emit('message', 'user joined');
    socket.on('sendMessage', (cityName, room) => {
        io.in(room).emit("sendCityNameToAllClients", message(cityName));
    });
    socket.on('disconnect', () => {
        io.emit('message', 'user is disconnected');
    });
    socket.on('USER:SEND_LOCATION', (data, callback) => {

        const payload = JSON.parse(data);
        // socket.broadcast.emit('message', 'https://www.google.com/maps?q=' + payload.coords.latitude + "," + payload.coords.longitude);
        io.emit('setLocation', message('https://www.google.com/maps?q=' + payload.coords.latitude + "," + payload.coords.longitude));
        callback('Location shared');
    });
    socket.emit('message', "Welcome!");
    socket.on('join', (username, room) => {
        const addOrNot = addUser(username, room, 1);
        console.log(addOrNot);
        if (addOrNot.error !== 'no error') {
            console.log('hi aman bro');
            var destination = 'http://localhost:3000';
            socket.emit('redirect', destination);
        }

        socket.join(room);
        socket.emit('user-name-access', username);
        socket.broadcast.to(room).emit('joinedChat', username + " joined the chat");
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
