var winston = require('winston'),
    colors = require('colors/safe');
/* Debug LeveL
 * error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5
 */

process.env.NODE_ENV = 'debug';

var env = process.env.NODE_ENV || 'development';
var horas = () => (new Date()).toLocaleTimeString();

var logger = new (winston.Logger)({
    transports: [
      new (winston.transports.Console)({
        timestamp: horas,
        colorize: true,
        level: env === 'development' ? 'info' : 'silly'
      })
      // for now we dont need file logs
      //new (winston.transports.File)({ filename: 'somefile.log' })
    ]
  });

module.exports = logger;
