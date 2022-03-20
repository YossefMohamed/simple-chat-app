var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    socket = require('socket.io'),
    usernames = [];
server.listen(process.env.PORT || 3000);
const io = socket(server);
app.use('/css', express.static(__dirname + '/css'));
app.use('/js', express.static(__dirname + '/js'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
  //res.sendFile(__dirname + '/style.css');
});

io.sockets.on('connection', function(socket){
  
  socket.on('new user', function(data, callback){
    if(usernames.indexOf(data) != -1){
      callback(false);
    }
    else{
      callback(true);
      socket.username = data;
      usernames.push(socket.username);
      updateUsernames();
    }
    
  });
  
  function updateUsernames(){
    io.sockets.emit('usernames', usernames);
  }
  socket.on("writing" , function(data) {
    io.sockets.emit('user typing', `${data} is typing....`);
  })
  socket.on("stop writing" , function(data) {
    io.sockets.emit('stop typing', `${data} is typing....`);
  })

  socket.on('send message', function(data){
    io.sockets.emit('new message', {msg: data, user: socket.username});
    
  });
  
  socket.on('disconnect', function(data){
    if(!socket.username) return;
    usernames.splice(usernames.indexOf(socket.username, 1));
    updateUsernames();
  });
});