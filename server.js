#!/usr/bin/env node

var io = require(process.cwd() + '/app.js').io;
var routesSocket = require(process.cwd() + '/routesSocket.js')


routesSocket();

module.exports = {io: io};