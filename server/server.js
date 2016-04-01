var http = require('http');
var requestHandler = require('./request-handler.js');
var port = 1337;

var ip = '127.0.0.1';

var server = http.createServer(requestHandler.run);
server.listen(port, ip);