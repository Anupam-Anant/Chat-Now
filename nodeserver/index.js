
//const io = require('socket.io')(8000);

const io = require("socket.io")(8000, {
    cors: {
        origin: "http://127.0.0.1:5500",
        methods: ["GET", "POST", "emit"],
        allowedHeaders: ["my-custom-header"],
        credentials: true
    }
});

const users = {};

io.on('connection', socket =>{
    // if any new user joins , let others connected to the server knows!
    socket.on('new-user-joined', name =>{
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });

    // If someone sends message, broadcast it to other people
    socket.on('send', message =>{
        socket.broadcast.emit('receive', {message: message, name : users[socket.id]});
    });

    // If someone leaves the chat , let others know
    socket.on('disconnect', message =>{
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });


});

