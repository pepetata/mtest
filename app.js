'use strict';

var port = process.env.PORT || 8080
//var config = {
//   host: "localhost",
//   user: process.env.SQL_USER ? process.env.SQL_USER : "mb",
//   password: process.env.SQL_PASSWORD ? process.env.SQL_PASSWORD : "mb321.123",
//   database: process.env.SQL_DATABASE ? process.env.SQL_DATABASE : "mb",
//   timezone: "-02:00"
////   , debug: true
//};
//console.log('process.env.INSTANCE_CONNECTION_NAME', process.env.INSTANCE_CONNECTION_NAME);
//console.log('process.env.NODE_ENV',process.env.NODE_ENV);
//if (process.env.INSTANCE_CONNECTION_NAME && process.env.NODE_ENV === 'production') {
//   config.socketPath = `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`;
//}
//
//console.log('config=',config);

var express = require('express')
        , app = express()
        , http = require('http')
        , socketIO = require('socket.io')
        , server = http.createServer(app)
        , io = socketIO.listen(server)
        , bodyParser = require('body-parser')
        , stylus = require('stylus')
        , mysql = require('mysql')
        ;

io.mbList = [];
io.custList = [];


// Starting Express server
//TODO - eliminate IP
// server.listen(port, function() {
server.listen(port,  function () {
   console.log('Server is running on localhost:' + port + '...', server.address());
});

//var pool = mysql.createPool(config);

app.set('views', process.cwd() + '/public/views');
app.set('view engine', 'stylus');
app.use(express.static("public"));
app.use(stylus.middleware(process.cwd() + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use('/public', express.static(process.cwd() + '/public'));


//pool.getConnection(function (err, connection) {
//   if (err)
//      throw err;
//   console.log("Connected to database!");
//   routes(app, connection);
//
//});
//
//var sql = "SELECT * FROM  `motoboy`";
//pool.query(sql, [], function (error, resultCont, fields) {
//   if (error) {
//      console.log(error);
//      return;
//   }
//});
//

module.exports = {app: app, server: server, dbConnection: pool, io: io};