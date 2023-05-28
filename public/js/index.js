var socket = io.connect();
let counter = document.getElementById('counter1');
let paragraph = document.getElementById('count');
socket.on('countUpdated',(value)=>{
    console.log('after updating',value)
    paragraph.innerText = parseInt(value);
})
counter.addEventListener('click', () => {
    socket.emit('valueChange',parseInt(paragraph.innerText))
});
