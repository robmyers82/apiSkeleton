// app/routes.js

// load the user and token models
var Token = require('./models/token');
var User = require('./models/user');

// expose the routes to our app with module.exports
module.exports = function(app, passport) {
	
	// API routes ==================================================================

  app.get('/api/test', function(req, res) {
    return res.json({message: 'Connected Successfully!'});
  });

  app.post('/api/signup', function(req, res) {
    passport.authenticate('local-signup', function(err, user, info) {

        //an error was encountered (ie. no database available)
        if (err) {  
          return next(err); 
        }

        //a user wasn't returned; this means that the user isn't available, or the login information is incorrect
        if (!user) {  
          return res.json({
            'status' : 'error',
            'message' : info.message
          }); 
        }
        else {  

          //success!  create a token and return the successful status and the if of the logged in user

          // create a token (random 32 character string)
          var token = Math.round((Math.pow(36, 32 + 1) - Math.random() * Math.pow(36, 32))).toString(36).slice(1);

          // add the token to the database
          Token.create({
            user_id: user.id,
            token: token,
          }, function(err, tokenRes) {
            if (err)
                res.send(err);

            return res.json({
              'status' : 'success',
              'userid' : user.id,
              'token' : token,
            });
          });
        }
      })(req, res);
  });

  app.post('/api/login', function(req, res) {
  	passport.authenticate('local-login', function(err, user, info) {

        //an error was encountered (ie. no database available)
        if (err) {  
          return next(err); 
        }

        //a user wasn't returned; this means that the user isn't available, or the login information is incorrect
        if (!user) {  
          return res.json({
            'status' : 'error',
            'message' : info.message
          }); 
        }
        else {  

          //success!  create a token and return the successful status and the if of the logged in user

          // create a token (random 32 character string)
          var token = Math.round((Math.pow(36, 32 + 1) - Math.random() * Math.pow(36, 32))).toString(36).slice(1);

          // add the token to the database
          Token.create({
            user_id: user.id,
            token: token,
          }, function(err, tokenRes) {
            if (err)
                res.send(err);

            return res.json({
              'status' : 'success',
              'userid' : user.id,
              'token' : token,
            });
          });
        }
      })(req, res);
  });

  // checks and authenticates a userid/token combination
  app.post('/api/checklogin', function(req, res) {

      if (!req.param('user_id') || !req.param('token')) {
          
          // user_id/token combination not complete, return invalid
          return res.json({ status: 'error'});
      }

      // attempt to retrieve the token info
      Token.find({
        user_id: req.param('user_id'),
        token: req.param('token'),
      }, function(err, tokenRes) {
        if (err)
            return res.json(err);

        // not found
        if (!tokenRes || tokenRes.length <= 0) {
            return res.json({ status: 'error'});
        }

        // all checks pass, we're good!
        return res.json({ status: 'success'});
      });
  });
};

// route middleware for API
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.body.user_id && req.body.token) {
        Token.find({
          user_id: req.body.user_id,
          token: req.body.token,
        }, function(err, tokenRes) {
          if (err)
              res.send({ status: 'error', message: "why aren't you logged in?"});

          // not found
          if (!tokenRes) {
              res.send({ status: 'error', message: "why aren't you logged in?"});
          }

          // all checks pass, we're good!
          return next();
        });
    }
    else {
      res.send({ status: 'error', message: "why aren't you logged in?"});
    }
}