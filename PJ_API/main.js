// server.js
// BASE SETUP
// =============================================================================
// define our app using express
var express = require('express');
var bodyParser = require('body-parser');
var helmet = require('helmet');
var colors = require('colors');
// Database
var pool = require('./app/data/db');

// call express
var app = express();

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(helmet()); //protect express headers

// Make our db accessible to our router
app.use(function(req,res,next){
	req.maria = pool;
    next();
});
// set our port
var port = process.env.PORT || 8080;

// all of our public routes will be prefixed with /
app.use('/',[require('./app/routes/routesEveryone')]);
//others prefixed with /api 

// Auth Middleware - This will check if the token is valid
// Only the requests that start with /api/* will be checked for the token.
// Any URL's that do not follow the below pattern should be avoided unless you
// are sure that authentication is not needed
app.use('/api',[require('./app/auth/valRequest'), require('./app/routes/routesSome')]);//-->Comment this if you want to bypass

//bypass authentication && authorization
//app.use('/api',[require('./app/routes/routesSome')]); --> uncomment this if you want to bypass


// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Port:'.gray + port);
console.log('Env:'.gray + app.get('env'));

























// // catch 404 and forward to error handler
// app.use(function (req, res, next) {
	// var err = new Error('Not Found');
	// err.code = 404;
	// err.method = req.method;
	// err.url = req.url;
	// next(err);
// });

// // error handlers
// // development error handler
// // will print stacktrace
// if (app.get('env') === 'development') {
	// app.use(function (err, req, res, next) {
		// res.status(err.code || 500)
		// .json({
			// status: 'error',
			// message: err
		// });
	// });
// }
// // production error handler
// // no stacktraces leaked to user
// app.use(function (err, req, res, next) {
	// res.status(err.status || 500)
	// .json({
		// status: 'error',
		// message: err.message
	// });
// });
