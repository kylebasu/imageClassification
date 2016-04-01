var requestHandler = function(request, response) {

  var headers = defaultCorsHeaders;
  var statusCode = 404

  headers['Content-Type'] = 'application/json';
  if(request.url.match(/classes/)){
    if(request.method === 'GET' || request.method === 'OPTIONS'){
       statusCode = 200;
      //response.end(JSON.stringify(obj))
    }
    if(request.method === 'POST'){
      statusCode = 201;
      var jsonString = '';
      request.on('data', function(data){
        jsonString += data;
      })
      request.on('end', function(){
        result.push(JSON.parse(jsonString))
      })
    }
  }

  // if(request.url !== '/classes/room1' && request.url !== '/classes/messages'){
  //   statusCode = 404;
  // }
  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.

   response.writeHead(statusCode, headers);

  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.
  //
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.

   response.end();
};

var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 6 // Seconds.
};

exports.run = requestHandler;
exports.defaultCorsHeaders = defaultCorsHeaders;