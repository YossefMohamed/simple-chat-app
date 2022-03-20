$(function(){
  var socket = io.connect();
  var messageForm = $('#messageForm');
  var message = $('#message');
  
  var chat = $('#chatWindow');
  
  var usernameForm = $('#usernameForm');
  var users = $('#users');
  var username = $('#username');
  var error = $('#error');
  var curruser ;
  usernameForm.submit(function(e){
    e.preventDefault();
    curruser = username.val()
    socket.emit('new user', curruser, function(data){
      if(data){
        $('#namesWrapper').hide();
        $('#mainWrapper').show();
      }
      else{
        error.html('Username Already Taken!');
      }
    });
    username.val('');
  });
  
  socket.on('usernames', function(data){
    var html = '';
    for(i = 0; i < data.length; i++){
      html += data[i] + '<br />';
    }
    users.html(html);
  });
  message.on("keydown" , ()=>{
    socket.emit("writing" , curruser )
  })
  messageForm.submit(function(e){
    e.preventDefault();
    socket.emit('send message', message.val());
    socket.emit("stop writing" , curruser )
    message.val('');
  });
  socket.on("stop typing" , function(data){
    $('.typing').html("");
  }) 
  socket.on("user typing" , function(data){
    $('.typing').html(data);
  })
  socket.on('new message', function(data){
    $(".messageContainer").append('<strong>'+data.user+'</strong>: '+data.msg+'<br />');
  });
});