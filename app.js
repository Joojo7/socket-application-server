const httpServer = require('http').createServer((req, res) => {

    res.setHeader('Access-Control-Allow-Origin', 'https://chat-app-frontend777.herokuapp.com');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
  });


  const io = require('socket.io')(httpServer, {
    cors: {
      origin: "https://chat-app-frontend777.herokuapp.com",
      methods: ["GET", "POST"],
      allowedHeaders: ["my-custom-header"],
      credentials: true
    }
  });

  const users = {}
  
  io.on('connection', socket => {
      socket.on('send-chat-message', msg => {
        socket.broadcast.emit('chat-message', {message: msg, name: users[socket.id]})
    })

    socket.on('username', username => {
        users[socket.id] = username
        socket.broadcast.emit('user-in', username)
    })

    socket.on('disconnect', () => {
      socket.broadcast.emit('user-disconnected', users[socket.id])
      delete users[socket.id]
  })

     
  });
  
  const PORT = process.env.PORT || 3000;
  httpServer.listen(PORT, () => console.log(`Running server on ${process.env.ENV} 🚀. \nListening on ${ PORT } 👂`));

  