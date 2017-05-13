/**
 * Created by Satendra on 5/13/2017.
 */
var express 	= require('express'),
	session		=	require('express-session'),
	app			= express(),
    server  	= require('http').createServer(app),
    io      	= require('socket.io').listen(server),
    port    	= 8090;
 
var users = [];

// listening to port...
server.listen(port, function(){
	console.log("Listening port: 8089");
	console.log('Go to http://localhost:8090');
});

app.use("/assets/js", express.static(__dirname + '/assets/js'));
app.use("/assets/css", express.static(__dirname + '/assets/css'));
app.use("/assets/images", express.static(__dirname + '/assets/images'));


app.get('/', function (req, res) {
	res.sendfile(__dirname + '/index.html');
});

io.on('connection',function(socket){
    socket.on('disconnect', function() {
        for( var i=0, len=users.length; i<len; ++i ){
            var c = users[i];
            if(c.clientId === socket.id){
                users.splice(i,1);
                console.log("Socket Disconnected");
                console.log(c);
                io.emit('UserOffline', c);
                break;
            }
        }
    });
    socket.on('startchat', function (data, callback) {
        var userInfo = {};
        userInfo.customId   = data['userName'];
        userInfo.clientId	= socket.id;
        userInfo.connectionTime	= new Date().getTime();
        users.push(userInfo);
        console.log("Socket Connected");
        console.log(userInfo);
        io.emit('UpdateUsers', userInfo);
        callback(true);
    });
    socket.on('loadUsers', function(data,callback){
        console.log(users);
        callback(users);
    });
});





