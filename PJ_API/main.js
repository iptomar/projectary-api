// server.js
// BASE SETUP
// =============================================================================
// define our app using express
var express = require('express');
var bodyParser = require('body-parser');
var helmet = require('helmet');
var auth = require('./app/auth/index');
var pool = require('./app/data/db');      // database
var logger = require('./app/data/log');   // logs

// call express
var app = express();

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(helmet()); //protect express headers

// Make our db accessible to our router
app.use(function(req, res, next) {
  req.maria = pool;
  next();
});
// set our port
var port = process.env.PORT || 8080;

// all of our public routes will be prefixed with /
app.use('/', [require('./app/routes/routesEveryone')]);
//others prefixed with /api

// Auth Middleware - This will check if the token is valid
// Only the requests that start with /api/* will be checked for the token.
// Any URL's that do not follow the below pattern should be avoided unless you
// are sure that authentication is not needed
app.use('/api', [auth.token, auth.perms, require('./app/routes/routesSome')]); //-->Comment this if you want to bypass

//bypass authentication && authorization
//app.use('/api',[require('./app/routes/routesSome')]); //--> uncomment this if you want to bypass


// START THE SERVER
// =============================================================================
app.listen(port);

logger.info('Port: '+ port);
logger.info('Env: ' + app.get('env'));
logger.info('Log LeveL:' + logger.level);
