var mysql = require('mysql'),
  emailjs = require('emailjs');

var pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '123qwe',
  database: 'projectary-master'
});

var email = {
  'smtp': '127.0.0.1',
  'user': 'example@contoso.com',
  'password': 'contosoPass'
};

var sendMessage = function(message, destination, subject, from, callback) {
  var connection = emailjs.server.connect({
    user: email.user,
    password: email.password,
    host: email.smtp
  });

  connection.send({
    text: message,
    'reply-to': from || email.user,
    from: from || email.user,
    to: destination,
    subject: subject || 'Projetary'
  }, function(err, message) {
    if (callback) callback(err, message);
  });
};

module.exports = {
  'url' :'http://127.0.0.1:8080',
  'mysql': pool,
  'email': sendMessage,
  'photoPath': __dirname + "/photo",
  'defaultPhoto': 'default_photo.png'
};
