//http://mherman.org/blog/2015/01/31/local-authentication-with-passport-and-express-4/#.Wd8ffTLYVdh
//http://mherman.org/blog/2015/07/02/handling-user-authentication-with-the-mean-stack/#.Wd9nZzLYVdg
//http://devdactic.com/restful-api-user-authentication-2/
//https://scotch.io/tutorials/easy-node-authentication-setup-and-local
//https://github.com/nax3t/angular-express-passport-tutorial/blob/master/facebook.md
//https://github.com/brandonmcquarie/easy-node-authentication-angular
module.exports = function (app, passport, Account) {

app.post('/register', function(req, res, next) {
    if (!req.body.email || !req.body.password) {
        return res.status(400).json({ err: 'Email and Password required' });
    }
    passport.authenticate('local-signup', function(err, Account, info) {
        if (err) { 
            return res.status(500).json({err: err});
        }
        if (Account.error) {
            return res.status(401).json({ err: Account.error });
        }
        req.logIn(Account, function(err) {
            if (err) {
                return res.status(500).json({err:err});
            }
            return res.status(200).json({status: 'Registration successful!'}); 
        });
    })(req, res);
});

app.post('/login', function(req, res, next) {
  passport.authenticate('local-login', function(err, myUser, info) {
    if (err) {
      return next(err);
    }
    
    if (!myUser) {
      // console.log(info)
      return res.status(401).json({
        err: info
      });
    }
    req.logIn(myUser, function(err) {
      if (err) {
        return res.status(500).json({
          err: 'Could not log in Account'
        });
      }
      console.log(myUser);
      res.status(200).json({
        status: 'Login successful!',
        user: myUser
      });
    });
  })(req, res, next);
});

app.get('/logout', function(req, res) {
  req.logout();
  res.status(200).json({
    status: 'Bye!'
  });
});

app.get('/status', function(req, res) {
  res.header('Access-Control-Allow-Credentials', true);
  if (!req.isAuthenticated()) {
    return res.status(200).json({
      status: false
    });
    // return res.json(req.user);
  }
  res.status(200).json({
    status: true,
    user: req.user
  });
  // console.log("ok");
  // res.redirect('/');
});

app.get('/ping', function(req, res){
    res.status(200).send("pong!");
});


/////////////////// Social login///////////////////////////////////
app.get('/auth/github',
		passport.authenticate('github'));
    
// 	app.get('/auth/github/callback',
// 		passport.authenticate('github', {
// 			successRedirect: '/',
// 			failureRedirect: '/login'
// 		}));

app.get('/auth/github/callback',function(req, res,next) {
            // res.header('Access-Control-Allow-Credentials', true);
            passport.authenticate('github', function(err, user, info) {
                    if (err){
                      console.log(err);
                // return res.status(500).json({ err: err.message });
                return  res.redirect('/');
            }
            // console.log(user)
            // res.status(200).json({
            //   status: 'Login successful!',
            //   name: user.github.name,
            //   id:   user.github.id,
            //   email: user.github.email
            // });
            req.logIn(user, function(err) {
              if (err) {
                return  res.redirect('/loginfailed');
              }
              console.log(user);
              res.redirect('/');
            });
            
    })(req, res, next);
});


app.get('/auth/google',
		passport.authenticate('google'));
    
app.get('/auth/google/callback',function(req, res,next) {
            // res.header('Access-Control-Allow-Credentials', true);
            passport.authenticate('google', function(err, user, info) {
              if (err){
                console.log(err);
                return  res.redirect('/');
              }
            req.logIn(user, function(err) {
              if (err) {
                return  res.redirect('/loginfailed');
              }
              console.log(user);
              res.redirect('/');
            });
            
    })(req, res, next);
});

app.get("/loginfailed", function (request, response) {
  response.sendFile(process.cwd() + '/client/templates/loginFailed.html');
});



// app.post('/register', function(req, res, next) {
//   passport.authenticate('local-signup', function(err, Account, info) {
//     // if (err) {
//     //   return next(err);
//     // }
//     if (err) {
//       console.log(info)
//         return res.status(500).json({
//           err: info
//         });
//       }
    
//     if (Account) {
//       return res.status(200).json({status: 'Registration successful!'}); 
      
//     }
//     // req.logIn(Account, function(err) {
//     //   if (err) {
//     //     return res.status(500).json({
//     //       err: 'Could not log in Account'
//     //     });
//     //   }
//     //   // console.log(Account.username)
//     //   res.status(200).json({
//     //     status: 'Login successful!',
//     //     username: Account.username
//     //   });
//     // });
//   })(req, res, next);
// });


// app.post('/register', function(req, res) {
//   console.log('inti registered!');
//   var email = req.body.username
//   var password = req.body.password
//     Account.findOne({ 'local.email' :  email }, function(err, user) {
//             // if there are any errors, return the error
//             if (err){
//                 return res.status(500).json({ err: err.message });
//             }

//             // check to see if theres already a user with that email
//             if (user) {
//                 return res.status(500).json({ err: "user already exists" });
//             } else {

//                 // if there is no user with that email
//                 // create the user
//                 var newUser            = new Account();

//                 // set the user's local credentials
//                 newUser.local.email    = email;
//                 newUser.local.password = newUser.generateHash(password);

//                 // save the user
//                 newUser.save(function(err) {
//                     if (err){
//                         throw err;
                      
//                     }
//                   return res.status(200).json({status: 'Registration successful!'}); 
//                 });
//             }

//         });
// });


};
