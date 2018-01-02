'use strict';



var pingInterval = 5 * 1000;

var app = require(process.cwd() + '/app.js').app;
var io = require(process.cwd() + '/app.js').io;
var debug = require('debug')('www:server');
var server = require(process.cwd() + '/app.js').server;


module.exports = function () {

   var connections = [];
   io.on('connection', function (client) {
      connections.push(client);
      console.log('Connected: %s. Total: %s', client.id, connections.length);

      var count = 0;

      client.once('disconnect', () => {
         connections.splice(connections.indexOf(client), 1);
         client.disconnect();
         console.log('Disconnected: %s. Remained: %s.', client.id, connections.length)
         io.mbList.forEach(function (e, i) {
            if (e.socketid === client.id) {
               console.log("apagou da mbList", client.id, e.mb);
               io.mbList.splice(i, 1);
            }
         })
         clearInterval(ping);
      });

      client.emit('pingx', {date: Date.now()}, function () {
         count = 0;
      });

      client.on('pongx', function (data) {
//         console.log('recebeu um pongx do', data.id, client.id, data.lat, data.lng);
         // check if it comes from a customer
         if (data.id === -1) {
            // don't ping to a customer any more
            clearInterval(ping);
         } else
            console.log('pongx' , data, client.id);
      });

      var ping = setInterval(function () {
         // send a ping only to motoboys
         count++;
//         console.log("enviando ping", date, client.id);
         client.emit('pingx', {date: Date.now()}, function () {
            count = 0;
         });
//         console.log('sent pingx to ', client.id)
         if (count > 4) {
            // delete this mb from mbList
            io.mbList.forEach(function (e, i) {
               if (e.socketid === client.id) {
                  console.log("desconectou", client.id, e.mb);
                  io.mbList.splice(i, 1);
               }
            })
            client.disconnect(true);
            clearInterval(ping);
         }
         //TODO: mude o intervalo abaixo - 10 seg
      }, pingInterval);

   });

   io.on('error', onError);
   io.on('listening', onListening);
   io.on('disconnect', function () {
      console.log('io.on.disconnect');
   }); // wait for reconnect
   io.on('reconnect', function () {
      console.log('io.on.reconnect');
   }); // connection restored  
   io.on('reconnecting', function () {
      console.log('io.on.reconnecting');
   }); //trying to reconnect
   io.on('reconnect_failed', function () {
      console.log("Reconnect failed");
   });

   function onError(error) {
      if (error.syscall !== 'listen') {
         throw error;
      }

      var bind = typeof port === 'string'
              ? 'Pipe ' + port
              : 'Port ' + port;

      // handle specific listen errors with friendly messages
      switch (error.code) {
         case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
         case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
         default:
            throw error;
      }
   }

   function onListening() {
      var addr = server.address();
      var bind = typeof addr === 'string'
              ? 'pipe ' + addr
              : 'port ' + addr.port;
      debug('Listening on ' + bind);
      console.log('Listening on ' + bind);
   }




};
