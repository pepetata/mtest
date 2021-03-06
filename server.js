#!/usr/bin/env node


var port = process.env.PORT || 8080
var config = {
   host: process.env.MYSQL_SERVICE_HOST ? process.env.MYSQL_SERVICE_HOST : "localhost",
   port: process.env.MYSQL_SERVICE_PORT ? process.env.MYSQL_SERVICE_PORT : "3306",
   user: process.env.MYSQL_USER ? process.env.MYSQL_USER : "mb",
   password: process.env.MYSQL_PASSWORD ? process.env.MYSQL_PASSWORD : "mb321.123",
   database: process.env.MYSQL_DATABASE ? process.env.MYSQL_DATABASE : "mb",
   timezone: "-02:00"
//   , debug: true
};

var x = process.env.MYSQL_USER;
console.log(config,x,process.env);

var express = require('express')
        , app = express()
        , http = require('http')
        , socketIO = require('socket.io')
        , server = http.createServer(app)
        , io = socketIO.listen(server)
        , mysql = require('mysql')
        ;

io.mbList = [];
io.custList = [];


// Starting Express server
//TODO - eliminate IP
// server.listen(port, function() {
server.listen(port, function () {
   console.log(new Date().toISOString(),'1.2 - Server is running on localhost:' + port + '...', server.address());
});

var connection = mysql.createConnection(config);
connection.connect( function(err){
if (err){ 
    throw err;
}
else {
    console.log('Connected');
}
 });
 
//var pool = mysql.createPool(config);

app.set('views', process.cwd() + '/public/views');
app.set('view engine', 'stylus');
//app.use(express.static("/"));
//app.use(stylus.middleware(process.cwd() + '/'));
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({extended: true}));
//app.use('/public', express.static(process.cwd() + '/public'));
app.use('/static', express.static('/'))

app.get('/', function (req, res) {
   res.sendFile(process.cwd() + "/index.html");
});
app.get('/index.html', function (req, res) {
   res.sendFile(process.cwd() + "/index.html");
});
app.get('/favicon.ico', function (req, res) {
   res.sendFile(process.cwd() + "/favicon.ico");
});

//pool.getConnection(function (err, connection) {
//   if (err)
//      throw err;
//   console.log("Connected to database!");
////   routes(app, connection);
//
//});

var sql = "SELECT * FROM  `motoboy`";
connection.query(sql, [], function (error, resultCont, fields) {
   if (error) {
      console.log(error);
      return;
   }
});


//var io = require(process.cwd() + '/app.js').io;
//var routesSocket = require(process.cwd() + '/routesSocket.js')




var connections = [];
io.set('transports', [ 'polling', 'websocket' ]);
io.on('connection', function (client) {
   connections.push(client);
   console.log('Connected: %s. Total: %s', client.id, connections.length);

   var count = 0;

   console.log("enviando pingx");
   client.emit('pingx', {date: Date.now()}, function () {
      count = 0;
   });

   client.on('pongx', function (data) {
      console.log('recebeu um pongx do', data.id, client.id, data.lat, data.lng);
      var sql = "INSERT INTO ping (pingcol, data) VALUES (?, now())";
      connection.query(sql, [client.id], function (error, results) {
         if (error)
            throw error;
      });

   });

   setInterval(function () {
      console.log("enviando pingx interval");
      client.emit('pingx', {date: Date.now()}, function () {
         count = 0;
      });
   }, 10000);

});


module.exports = {io: io};