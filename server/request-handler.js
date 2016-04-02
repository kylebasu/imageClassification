
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database("imagedb.db");
var importInfo = [
{ a:'COCO_train2014_000000087234.jpg', b:"food" },

{ a:'COCO_train2014_000000185234.jpg', b:"person" },

{ a:'COCO_train2014_000000211234.jpg', b:"person" },

{ a:'COCO_train2014_000000025234.jpg', b:null },

{ a:'COCO_train2014_000000559234.jpg', b:null },

{ a:'COCO_train2014_000000190234.jpg', b:"interior" },

{ a:'COCO_train2014_000000133234.jpg', b:null },

{ a:'COCO_train2014_000000339234.jpg', b:"exterior" },

{ a:'COCO_train2014_000000138234.jpg', b:"animal" },

{ a:'COCO_train2014_000000161234.jpg', b:"person" },

{ a:'COCO_train2014_000000205234.jpg', b:"animal" },

{ a:'COCO_train2014_000000479234.jpg', b:null },

{ a:'COCO_train2014_000000552234.jpg', b:null },

{ a:'COCO_train2014_000000270234.jpg', b:null },

{ a:'COCO_train2014_000000423234.jpg', b:null },

{ a:'COCO_train2014_000000485234.jpg', b:null },

{ a:'COCO_train2014_000000535234.jpg', b:null },

{ a:'COCO_train2014_000000286234.jpg', b:null },

{ a:'COCO_train2014_000000251234.jpg', b:null },

{ a:'COCO_train2014_000000240234.jpg', b:null }
];

var populated = false;
var count; 

var requestHandler = function(request, response) {
  db.run("CREATE TABLE if not exists image_info ( image varchar(100), class varchar(100))");


  var headers = defaultCorsHeaders;

  var statusCode = 404;

  var getData = function(err, row){
      db.each("SELECT rowid, image, class AS classification FROM image_info", function(err, row){
        returnData.push({pk: row.rowid, image: row.image, classification: row.classification});
      },
      //respond with data
      function(item){
        returnData = JSON.stringify(returnData);
         
        response.writeHead(statusCode, headers);

        response.end(returnData);
      });
  };

  headers['content-type'] = 'application/json';

  if(request.url.match(/images/)){
  	console.log(request.method)
    if(request.method === 'GET'){
    	console.log('Receiving GET request');
      statusCode = 200;
      var returnData = [];
      db.each("SELECT count(rowid) AS count FROM image_info", function(err, row){
        if(row === undefined || row.count === 0){
          var stmt = db.prepare('INSERT INTO image_info VALUES (?, ?)');
          for (var i = 0; i < importInfo.length; i++){
            stmt.run('images/' + importInfo[i].a, importInfo[i].b);
          }
          stmt.finalize(getData);
        }else{
          getData();
        }
      });
    }
    if(request.method === 'POST'){
      var returnData =[];
      statusCode = 201;
      var jsonString = '';
      request.on('data', function(data){
        jsonString += data;
      });
      request.on('end', function(){
        console.log(jsonString, typeof jsonString)
        jsonString = JSON.parse(jsonString);
        db.serialize(function(){
          db.run("UPDATE image_info SET class = ? WHERE rowid = ?", jsonString.classification, jsonString.pk)
            response.writeHead(statusCode, headers);
            response.end();
        });
      });
    }
    if(request.method === 'OPTIONS'){
    	console.log(defaultCorsHeaders)
    	response.writeHead(200, defaultCorsHeaders);
    	response.end();
    }
  }

};

var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 86400,
  'Content-Type': 'application/json'
};

exports.run = requestHandler;
exports.defaultCorsHeaders = defaultCorsHeaders;