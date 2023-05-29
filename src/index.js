const express = require('express');
const socketio = require('socket.io');
const path = require('path');
const app = express();
const http = require('http');
// const options = {
//     cors: true,
//     origins: ["http://localhost:3001/"],
//   };
const server = http.createServer(app);
const io = socketio(server);
const directoryPath = path.join(__dirname, '../public');
const port = process.env.port;
let count = 1;
io.on('connection', (socket) => {
    console.log('websocket connection established');
    // socket.on('valueChange',(value)=>{
    //     io.emit("countUpdated", value+1);
    // })
    socket.broadcast.emit('message', 'user joined');
    socket.on('sendMessage', (cityName) => {
        io.emit("sendCityNameToAllClients", cityName);
    });
    socket.on('disconnect', () => {
        io.emit('message', 'user is disconnected');
    });
    socket.on('USER:SEND_LOCATION', (data, callback) => {

        const payload = JSON.parse(data);
        // socket.broadcast.emit('message', 'https://www.google.com/maps?q=' + payload.coords.latitude + "," + payload.coords.longitude);
        io.emit('setLocation', 'https://www.google.com/maps?q=' + payload.coords.latitude + "," + payload.coords.longitude);
        callback('Location shared');
    });
    socket.emit('message', "Welcome!");
});
app.use(express.static(directoryPath));
// app.get('/', (req, res) => {
//     res.sendFile(directoryPath);
// });
console.log('object');
server.listen(port, () => {
    console.log('server is listening at', port);
}
)
// :      p        )   {    0    p;
