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
let count=1;
io.on('connection', (socket) => {
    console.log('websocket connection established');
    socket.on('valueChange',(value)=>{
        io.emit("countUpdated", value+1);
    })
});
app.use(express.static(directoryPath))
// app.get('/', (req, res) => {
//     res.sendFile(directoryPath);
// });
console.log('object')
server.listen(port, () => {
    console.log('server is listening at', port);
}
)
// :      p        )   {    0    p;
