// server.js
// This is the main file used to configure the entire Node application


// set up ========================
var express  = require('express');
var app      = express();                               // create our app w/ express
var mongoose = require('mongoose');                     // mongoose for mongodb
var passport = require('passport');
var flash	 = require('connect-flash');
var morgan = require('morgan');                         // log requests to the console (express4)
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');                // pull information from HTML POST (express4)
var methodOverride = require('method-override');        // simulate DELETE and PUT (express4)
var port     = process.env.PORT || 8080;                // set the port
var session	 = require('express-session');

var allowCrossDomain = function(req, res, next) {
   res.header('Access-Control-Allow-Origin', '*');
   res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
   res.header('Access-Control-Allow-Headers', 'Content-Type');

   next();
}

// configuration =================

var database = require('./config/database');            // database connect info
mongoose.connect(database.url);     // connect to mongoDB

require('./config/passport')(passport);

app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
app.use(morgan('dev'));                                         // log every request to the console
app.use(cookieParser()); 										// read cookies (needed for auth) 
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());
app.use(allowCrossDomain);

// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport


// // load the routes
// require('./app/routes')(app);

// listen (start app with node server.js) ======================================
app.listen(port);
console.log("App listening on port " + port);