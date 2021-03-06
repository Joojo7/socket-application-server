if (process.env.ENV != "production" && process.env.ENV != "dev_online") {
  require("dotenv").config();
}
const httpServer = require('http').createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', `${process.env.FRONTEND_URL}`);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
  });


  const io = require('socket.io')(httpServer, {
    cors: {
      origin: `${process.env.FRONTEND_URL}`,
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  const users = {}
  
  // get user's name after they connect and append it to any message they send out
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

  