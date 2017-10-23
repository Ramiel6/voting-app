var LocalStrategy   = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var GitHubStrategy = require('passport-github2').Strategy;
var configAuth = require('../configs/authConfig.js');
module.exports = function (app, passport, Account) {
// passport.serializeUser(function(user, done) {
//     done(null, user);
//   });

// passport.deserializeUser(function(user, done) {
//     done(null, user);
//   });

passport.serializeUser(function (user, done) {
		done(null, user.id);
	});

passport.deserializeUser(function (id, done) {
	Account.findById(id, function (err, user) {
// 		 console.log('deserializing user:',user);
		done(err, user);
	});
});

passport.use('local-signup', new LocalStrategy({
    // by default, local strategy uses username and password, we will override with email
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
},
function(req, email, password, done) {
    if (email){
        email = email.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching
    }
    // asynchronous
    process.nextTick(function() {
        // if the user is not already logged in:
        if (!req.user) {
            Account.findOne({ 'local.email' :  email }, function(err, user) {
                // if there are any errors, return the error
                if (err)
                    return done(err);

                console.log(user);
                // check to see if theres already a user with that email
                if (user) {
                    return done(null, { error: 'That email is already taken.' });
                } else {

                    // create the user
                    var newUser            = new Account();

                    newUser.local.email    = email;
                    newUser.local.password = newUser.generateHash(password);

                    newUser.save(function(err) {
                        if (err)
                            throw err;

                        return done(null, newUser);
                    });
                }

            });
        // if the user is logged in but has no local account...
        } else if ( !req.user.local.email ) {
            // ...presumably they're trying to connect a local account
            var user            = req.user;
                user.local.email    = email;
            user.local.password = user.generateHash(password);
            user.save(function(err) {
                if (err)
                    throw err;
                return done(null, user);
            });
        } else {
            // user is logged in and already has a local account. Ignore signup. (You should log out before trying to create a new account, user!)
            return done(null, req.user);
        }

    });

}));

 passport.use('local-login', new LocalStrategy(
	  function(email, password, done) {
	     Account.findOne({
	      'local.email' :  email
	    }, function(err, user) {
	      // if there are any errors, return the error before anything else
           if (err)
               return done(err);

           // if no user is found, return the message
           if (!user)
               return done(null, false, {err:"Email not found!"});

           // if the user is found but the password is wrong
           if (!user.validPassword(password))
               return done(null, false, {err:"Oops! Wrong password."}); 

           // all is well, return successful user
           return done(null, user);
	    });
	  }
	));
	
passport.use(new GoogleStrategy({

        clientID        : configAuth.googleAuth.clientID,
        clientSecret    : configAuth.googleAuth.clientSecret,
        callbackURL     : configAuth.googleAuth.callbackURL,
        scope           : ['profile', 'email'],
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)

    },
    function(req, token, refreshToken, profile, done) {

        // asynchronous
        process.nextTick(function() {

            // check if the user is already logged in
            if (!req.user) {

                Account.findOne({ 'google.id' : profile.id }, function(err, user) {
                    if (err)
                        return done(err);

                    if (user) {

                        // if there is a user id already but no token (user was linked at one point and then removed)
                        if (!user.google.token) {
                            user.google.token = token;
                            user.google.name  = profile.displayName;
                            user.google.email = (profile.emails[0].value || '').toLowerCase(); // pull the first email

                            user.save(function(err) {
                                if (err)
                                    throw err;
                                return done(null, user);
                            });
                        }

                        return done(null, user);
                    } else {
                        var newUser          = new Account();

                        newUser.google.id    = profile.id;
                        newUser.google.token = token;
                        newUser.google.name  = profile.displayName;
                        newUser.google.email = (profile.emails[0].value || '').toLowerCase(); // pull the first email

                        newUser.save(function(err) {
                            if (err)
                                throw err;
                            return done(null, newUser);
                        });
                    }
                });

            } else {
                // user already exists and is logged in, we have to link accounts
                var user               = req.user; // pull the user out of the session

                user.google.id    = profile.id;
                user.google.token = token;
                user.google.name  = profile.displayName;
                user.google.email = (profile.emails[0].value || '').toLowerCase(); // pull the first email

                user.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, user);
                });

            }

        });

    }));

passport.use(new GitHubStrategy({

        clientID: configAuth.githubAuth.clientID,
		clientSecret: configAuth.githubAuth.clientSecret,
		callbackURL: configAuth.githubAuth.callbackURL,
		scope: ['user:email'],
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)

    },
    function(req, token, refreshToken, profile, done) {

        // asynchronous
        process.nextTick(function() {

            // check if the user is already logged in
            if (!req.user) {

                Account.findOne({ 'github.id': profile.id }, function(err, user) {
                    if (err)
                        return done(err);

                    if (user) {

                        // if there is a user id already but no token (user was linked at one point and then removed)
                        if (!user.github.token) {
                            user.github.token = token;
                            user.github.name  = profile.displayName;
                            user.github.email = (profile.emails[0].value || '').toLowerCase(); // pull the first email

                            user.save(function(err) {
                                if (err)
                                    throw err;
                                return done(null, user);
                            });
                        }

                        return done(null, user);
                    } else {
                        var newUser          = new Account();

                        newUser.github.id    = profile.id;
                        newUser.github.token = token;
                        newUser.github.name  = profile.displayName;
                        newUser.github.email = (profile.emails[0].value || '').toLowerCase(); // pull the first email

                        newUser.save(function(err) {
                            if (err)
                                throw err;
                            return done(null, newUser);
                        });
                    }
                });

            } else {
                // user already exists and is logged in, we have to link accounts
                var user               = req.user; // pull the user out of the session

                user.github.id    = profile.id;
                user.github.token = token;
                user.github.name  = profile.displayName;
                user.github.email = (profile.emails[0].value || '').toLowerCase(); // pull the first email

                user.save(function(err) {
                    if (err)
                        throw err;
                    
                    return done(null, user);
                });

            }

        });

    }));
// 	passport.use(new GitHubStrategy({
// 		clientID: configAuth.githubAuth.clientID,
// 		clientSecret: configAuth.githubAuth.clientSecret,
// 		callbackURL: configAuth.githubAuth.callbackURL
// 	},
// 	function (token, refreshToken, profile, done) {
// 		process.nextTick(function () {
// 			Account.findOne({ 'github.id': profile.id }, function (err, user) {
// 				if (err) {
// 					return done(err);
// 				}

// 				if (user) {
// 					return done(null, user);
// 				} else {
// 					var newUser = new Account();

// 					newUser.github.id = profile.id;
// 					newUser.github.username = profile.username;
// 					newUser.github.displayName = profile.displayName;
// 					newUser.github.publicRepos = profile._json.public_repos;
	

// 					newUser.save(function (err) {
// 						if (err) {
// 							throw err;
// 						}

// 						return done(null, newUser);
// 					});
// 				}
// 			});
// 		});
// 	}));

};

