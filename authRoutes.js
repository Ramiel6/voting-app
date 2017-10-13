//http://mherman.org/blog/2015/01/31/local-authentication-with-passport-and-express-4/#.Wd8ffTLYVdh
//http://mherman.org/blog/2015/07/02/handling-user-authentication-with-the-mean-stack/#.Wd9nZzLYVdg
module.exports = function (app, passport, Account) {
// app.get('/register', function(req, res) {
//     res.render('register', { });
// });

app.post('/register', function(req, res) {
    Account.register(new Account({ username : req.body.username }), req.body.password, function(err, account) {
        if (err) {
            // return res.render('register', { account : account });
            return res.status(500).json({ err: err });

        }

        passport.authenticate('local')(req, res, function () {
            // res.redirect('/');
            return res.status(200).json({status: 'Registration successful!'});

        });
    });
});

app.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, Account, info) {
    if (err) {
      return next(err);
    }
    if (!Account) {
      return res.status(401).json({
        err: info
      });
    }
    req.logIn(Account, function(err) {
      if (err) {
        return res.status(500).json({
          err: 'Could not log in Account'
        });
      }
      res.status(200).json({
        status: 'Login successful!'
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


app.get('/ping', function(req, res){
    res.status(200).send("pong!");
});
app.get('/status', function(req, res) {
  if (!req.isAuthenticated()) {
    return res.status(200).json({
      status: false
    });
  }
  res.status(200).json({
    status: true
  });
});
};

