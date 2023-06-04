const socket = io();
// var socket = io.connect('http://localhost:3000');
// let counter = document.getElementById('counter1');
// let paragraph = document.getElementById('count');
// socket.on('countUpdated',(value)=>{
    //     console.log('after updating',value)
    //     paragraph.innerText = parseInt(value);
    // })
    // counter.addEventListener('click', () => {
        //     socket.emit('valueChange',parseInt(paragraph.innerText))
        // });
// let userList = [];
let lastScrollHeight = 0;
// function getTopDistance() {
//     h = messages.scrollHeight - messages.clientHeight;
// }
let roomName = document.getElementById('room_name');
let roomUsersList = document.getElementById('room-users-list');
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true });
roomName.innerText = room;
let userChatHeading = document.getElementById('user-name');
userChatHeading.innerHTML = `<p>${username}</p>`;
// userList = getUsersInRoom(room);
// roomUsersList.innerHTML = `<p>${userList.map((user) => { return user.username })}</p>`;
// let lastChild=messages.lastChild;
// console.log(lastChild)
let firsTime = false;
socket.on('sendCityNameToAllClients', (message, infoOfUser) => {
    let messageTemplateHtml = document.getElementById('message-template').innerHTML;
    let messages = document.getElementById('messages');
    const html = Mustache.render(messageTemplateHtml, {
        message: message.text,
        createdAt: message.createdAt,
        username: message.username
    });
    messages.insertAdjacentHTML('beforeend', html);
    let lastChild = messages.lastElementChild.innerHTML;
    // console.log(lastChild, messages.scrollHeight, messages.scrollTop, messages.clientHeight);
    // messages.scrollTop = messages.scrollHeight - messages.clientHeight;
    if (messages.scrollHeight - messages.clientHeight > 0) {
        if (infoOfUser.id === socket.id) {
            messages.scrollTop = messages.scrollHeight - messages.clientHeight;
        }
        if (firsTime === false) {
            messages.scrollTop = messages.scrollHeight - messages.clientHeight;
            firsTime = true;
        }
        else {
            if (!(messages.scrollTop < lastScrollHeight)) {
                messages.scrollTop = messages.scrollHeight - messages.clientHeight;
            }

        }
        lastScrollHeight = messages.scrollHeight - messages.clientHeight;
    }

});
// addUser(username, room);
// if (addUser(username, room).error !== 'no error') {
//     console.log('hi aman bro');
//     window.location.href = "http://localhost:3000";
// }
socket.on('joinedChat', (message, userList) => {
    let messageTemplateHtml = document.getElementById('joined-chat-template').innerHTML;
    let messages = document.getElementById('messages');
    const html = Mustache.render(messageTemplateHtml, {
        chat: message,
    });
    messages.insertAdjacentHTML('beforeend', html);
    // console.log('hi shyam how');
    // let usernameTemplateHtml = document.getElementById('username-template').innerHTML;
    // let usernameAccess = document.getElementById('user-name');
    // const html2 = Mustache.render(usernameTemplateHtml, {
    //     username: username
    // });
    // usernameAccess.insertAdjacentHTML('beforeend', html2);
    roomUsersList.innerHTML = `<p>${userList.map((user) => { return user.username; })}</p>`;
});
socket.on('disconnected', (value) => {
    console.log(value);
});
let weatherInput = document.getElementById('weatherInput');
let locationButton = document.getElementById('location');
let button = document.getElementById('button');
button.addEventListener('click', (e) => {
    socket.emit('sendMessage', weatherInput.value, room);
    // weatherInput.value = "";
});
socket.emit('join', username, room);
// socket.on('user-name-access', (username) => {
//     let usernameTemplateHtml = document.getElementById('username-template').innerHTML;
//     let usernameAccess = document.getElementById('user-name');
//     const html2 = Mustache.render(usernameTemplateHtml, {
//         username
//     });
//     usernameAccess.insertAdjacentHTML('beforeend', html2);
// });
socket.on('leftTheChat', (message, usersInRoom) => {
    let messageTemplateHtml = document.getElementById('joined-chat-template').innerHTML;
    let messages = document.getElementById('messages');
    const html = Mustache.render(messageTemplateHtml, {
        chat: message,
    });
    // socket.emit('fetchUsers',room)
    messages.insertAdjacentHTML('beforeend', html);
    roomUsersList.innerHTML = `<p>${usersInRoom.map((user) => { return user.username; })}</p>`;
});
socket.on('setLocation', (url) => {
    let locationMessageTemplateHtml = document.getElementById('location-message-template').innerHTML;
    let messages = document.getElementById('messages');
    const html = Mustache.render(locationMessageTemplateHtml, {
        message: url.text,
        createdAt: url.createdAt
    });
    messages.insertAdjacentHTML('beforeend', html);
});
socket.on('redirect', function (destination) {
    window.location.href = destination;
});
locationButton.addEventListener('click', async () => {
    locationButton.disabled = true;
    if (!navigator.geolocation) {
        return alert('geolocation is not supported for your browser');
    }
    navigator.geolocation.getCurrentPosition((position) => {
        // socket.emit('USER:SEND_LOCATION', JSON.stringify(position));

        // The issue with the position object/result that you get from calling navigator.geolocation.
        // getCurrentPosition is that it's properties are not enumerable, meaning that you can't easily
        //  "stringify"
        // the object and pass it along with your socket.emit call, which is why you're getting an empty
        //  object as a result.
        // Although you can write a function that will extract these properties for you, you could do the 
        // following:
        const payload = {
            coords: {
                accuracy: position.coords.accuracy,
                altitude: position.coords.altitude,
                altitudeAccuracy: position.coords.altitudeAccuracy,
                heading: position.coords.heading,
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                speed: position.coords.speed
            }
        };
        socket.emit('USER:SEND_LOCATION', JSON.stringify(payload), (message) => {
            locationButton.disabled = false;
        });
    });
});