// var qs = require('querystring');
module.exports = function (app, vote,passport) {


var path = process.cwd();
function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
		  console.log(req.isAuthenticated());
			return next();
		} else {
			res.redirect('/');
		}
	}


app.get("/", function (request, response) {
  response.sendFile(path + '/client/index.html');
});

app.post('/newpoll', function(request, response) {
  response.writeHead(200, { 'Content-Type': 'application/json' });
  // console.log("inti body")
  // console.log(request.body)
  //https://stackoverflow.com/questions/4295782/how-do-you-extract-post-data-in-node-js
  var post = request.body;
  // Too much POST data, kill the connection!
  // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
  if (post.length > 1e6){
      request.connection.destroy();
  }
  var new_vote = new vote(post);
  new_vote.save(function (err) {
    if (err) throw err;
    // saved!
    console.log(JSON.stringify(post));
    response.end(JSON.stringify(post));
  });
  
  
});

app.get("/getmypolls", function (request, response) {
  response.writeHead(200, { 'Content-Type': 'application/json' });
  if(request.query.user){
  var id = request.query.user;
  console.log(id);
  // MongoClient.connect(url, function(err, db) {
  //   if (err) throw err;
  //   var collection = db.collection('votes');
  //   collection.find({user:user},{"_id":false}).sort({"date": -1}).toArray(function(err, data) {
  //     if (err) throw err;
  //     if(data){
  //       console.log(data)
  //       response.end(JSON.stringify(data));
  //     }
  //     else{
  //       response.end("not found");
  //     }
  //     //console.log(JSON.stringify(data));
  //   // response.end("hi");
  //     db.close();
  //   });
  // });
  vote.find({user: id}).sort({"date": -1}).exec(function(err, data) {
      if (err) throw err;
      if(data){
        console.log(data);
        response.end(JSON.stringify(data));
      }
      else{
        response.end("not found");
      }
      //console.log(JSON.stringify(data));
    // response.end("hi");
     
    });
  }
});
app.get("/getallpolls", function (request, response) {
  response.writeHead(200, { 'Content-Type': 'application/json' });
  vote.find({},{"__v":false}).sort({"date": -1}).exec(function(err, data) {
      if (err) throw err;
      if(data){
        console.log(data);
        response.end(JSON.stringify(data));
      }
      else{
        response.end("not found");
      }
      //console.log(JSON.stringify(data));
    // response.end("hi");
     
    });
  
});
app.put('/updatepoll', function(request, response) {
  // response.writeHead(200, { 'Content-Type': 'application/json' });
  var post = request.body;
  var voter;
  // console.log(request.body)
  // Too much POST data, kill the connection!
  // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
  if (post.length > 1e6){
      request.connection.destroy();
  }
  if(post.voter == 'ip'){
    voter = request.ip
  }else{
    voter = post.voter
  }
  vote.find({'_id':post.voteId,voters:voter}).exec(function (err,result) {
    if (err) throw err;
    // console.log(result)
    if(result.length > 0){
      return response.json({err: 'already voted'})
    }else{
      vote.update({'_id':post.voteId,'pollItems.value':post.voteValue},{
        $inc:{'pollItems.$.votes': 1},
        $push: { 'voters': voter } 
      },function (err,data) {
      if (err) throw err;
      // saved!
      // console.log(JSON.stringify(data));
      response.end(JSON.stringify(data));
    });
    }
  })
 

});
app.post("/testfind", function (request, response) {
  response.writeHead(200, { 'Content-Type': 'application/json' });
   var post = request.body;
  vote.find({pollItems:{$elemMatch:{value:post.voteValue}}}).exec(function(err, data) {
      if (err) throw err;
      if(data){
        console.log(data);
        response.end(JSON.stringify(data));
      }
      else{
        response.end("not found");
      }
      //console.log(JSON.stringify(data));
    // response.end("hi");
     
    });
  
});

app.get('*', function(req, res) {
    res.redirect('/');
});


//////////////////////// test /////////////////////////
//app.use(express.static(path.resolve(__dirname, 'test')));
//app.get('/',
// 		isLoggedIn, function (req, res) {
// 			res.sendFile(path + '/test/indexTest.html');
// 		});

// 	app.get('/login',
// 	function (req, res) {
// 			res.sendFile(path + '/test/login.html');
// 		});
// 	app.get('/profile',
// 		isLoggedIn, function (req, res) {
// 			res.sendFile(path + '/test/profile.html');
// 		});
// app.get('/api/:id',
// 		isLoggedIn, function (req, res) {
// 			res.json(req.user.github);
// 		});
/////////////////////////////////////////////////////////////
};