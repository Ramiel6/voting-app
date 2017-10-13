var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://'+ process.env.IP +'/votingapp';
// svar qs = require('querystring');

module.exports = function (app, passport) {

app.get("/", function (request, response) {
  response.sendFile(__dirname + '/client/index.html');
});

app.post('/newpoll', function(request, response) {
  response.writeHead(200, { 'Content-Type': 'application/json' });
  
  https://stackoverflow.com/questions/4295782/how-do-you-extract-post-data-in-node-js
  var body = '';
  
    request.on('data', function (data) {
        body += data;
    
        // Too much POST data, kill the connection!
        // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
        if (body.length > 1e6)
            request.connection.destroy();
    });
    request.on('end', function () {
        var post = JSON.parse(body);
        // use post['blah'], etc.
        response.end(JSON.stringify(post))
       console.log(JSON.stringify(post))
      MongoClient.connect(url, function(err, db) {
          if (err) throw err;
          var collection = db.collection('votes');
          // var newPoll= request.body
          collection.insert(post, function(err, data) {
              //handle error
            if (err) throw err;
              // other operations
             
              db.close();
      });
      // collection.deleteMany({})
  });
  });
  
  
});

app.get("/getmypolls", function (request, response) {
  response.writeHead(200, { 'Content-Type': 'application/json' });
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var collection = db.collection('votes');
    collection.find({user:"user1"},{"_id":false}).sort({"date": -1}).toArray(function(err, data) {
      if (err) throw err;
      if(data){
        console.log(data)
        response.end(JSON.stringify(data));
      }
      else{
        response.end("not found");
      }
      //console.log(JSON.stringify(data));
    // response.end("hi");
      db.close();
    });
  });
});
app.get("/getallpolls", function (request, response) {
  response.writeHead(200, { 'Content-Type': 'application/json' });
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var collection = db.collection('votes');
    collection.find({},{"_id":false}).sort({"date": -1}).toArray(function(err, data) {
      if (err) throw err;
      if(data){
        console.log(data)
        response.end(JSON.stringify(data));
      }
      else{
        response.end("not found");
      }
      //console.log(JSON.stringify(data));
    // response.end("hi");
      db.close();
    });
  });
  
});
};