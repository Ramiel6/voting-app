var http = require('http');
var path = require('path');
// var async = require('async');
// var socketio = require('socket.io');
var express = require('express');
// var requests = require('request');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var session = require('express-session');
// var LocalStrategy = require('passport-local').Strategy;
var cookieParser = require('cookie-parser');
var routes = require('./routes/routes.js');
var authRoutes = require('./routes/authRoutes.js');
var Account = require('./configs/account.js');
var vote = require('./configs/pollModel.js');

// passportConfig;

//
// ## SismpleServer `SimpleServer(obj)`
//
// Creates a new instance of SimpleServer with the following options:
//  * `port` - The HTTP port to listen on. If `process.env.PORT` is set, _it overrides this value_.
//
var app = express();
var server = http.createServer(app);
// var io = socketio.listen(server);
app.use(cookieParser('HardSecret')); // cookie parser must use the same secret as express-session.
const cookieExpirationDate = new Date();
const cookieExpirationDays = 365;
cookieExpirationDate.setDate(cookieExpirationDate.getDate() + cookieExpirationDays);

app.use(session({
	secret: 'HardSecret', // must match with the secret for cookie-parser
	resave: true,
	saveUninitialized: true,
	cookie: {
	    // httpOnly: true,
	    expires: cookieExpirationDate // use expires instead of maxAge
	}
 } ));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(express.static(path.resolve(__dirname, '../client')));
app.use('/css',express.static(path.join(__dirname, '../client/css')));
app.use(passport.initialize());
app.use(passport.session());
require('./configs/PassportConfig.js')(app, passport, Account);
// app.enable('trust proxy');
// app.use(session({
//     secret: 'HardSecret',
//     resave: true,
//     saveUninitialized: true,
//     cookie: {
// 	    httpOnly: true,
// 	    expires: cookieExpirationDate // use expires instead of maxAge
// 	}
// }));
// app.get('/', function(req, res) {
//     res.sendfile('./test/login.html');
// });




// passport config
// var mongoose = require('mongoose');
// var Schema = mongoose.Schema;
// var passportLocalMongoose = require('passport-local-mongoose');

// var Account = new Schema({
//     username: String,
//     password: String
// });

// Account.plugin(passportLocalMongoose);
// var Accounts =  mongoose.model('Account', Account);


var url = 'mongodb://'+ process.env.IP +'/votingapp';
mongoose.Promise = global.Promise;
mongoose.connect(url,{ useMongoClient: true });

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//     var err = new Error('Not Found');
//     err.status = 404;
//     next(err);
// });

// // // error handlers

// // development error handler
// // will print stacktrace
// if (app.get('env') === 'development') {
//     app.use(function(err, req, res, next) {
//         res.status(err.status || 500);
//         res.render('error', {
//             message: err.message,
//             error: err
//         });
//     });
// }

// // production error handler
// // no stacktraces leaked to user
// app.use(function(err, req, res, next) {
//     res.status(err.status || 500);
//     res.render('error', {
//         message: err.message,
//         error: {}
//     });
// });

//routes
authRoutes(app, passport, Account);
routes(app,vote,passport);
// app.get('*', function(request, response) {
//     // response.redirect('/');
//     // response.setHeader('Content-Type', 'text/css');
//      response.sendFile(path.join(__dirname + '/client','index.html'));
    
// });



server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Server is listening at", addr.address + ":" + addr.port);
});
