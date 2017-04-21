require('colors');

var express = require('express'),
  bodyParser = require('body-parser'),
  morgan = require('morgan'),
  routes = require('./lib/http/routes.js'),
  ProgressBar = require('progress'),
  os = require("os");

var app = express();

app.use(morgan(':req[x-forwarded-for] - :remote-addr - [:date] ":method :url HTTP/:http-version" :status :res[content-length]'));
app.use(express.static(__dirname + '/../projectary-frontend/'));
app.use(bodyParser({
  limit: '50mb'
}));
routes(app);



module.exports = {
  'app': app,
  'start': function(tenv) {
    var port = process.env.PORT || 8080;
    var env = tenv || process.env.NODE_ENV;

    switch (env) {
      case 'development':
        port = 1337;
        break;
      default:
    }

    console.log('(SYSTEM) PTisp API'.green);

    var bar = new ProgressBar('(SYSTEM) Loading... [:bar] :percent :etas', {
      total: 40
    });
    var timer = setInterval(function() {
      bar.tick(8);
      if (bar.complete) {
        clearInterval(timer);
        app.listen(port, function() {
          console.log('(PLAIN) Server listening on port %d.'.green, port);
        });
      }
    }, 1000);
  }
};
