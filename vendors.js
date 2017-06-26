var mysql = require('mysql'),
  emailjs = require('emailjs');

var pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '123qwe',
  database: 'projectary-master'
});

var email = {
  'smtp': 'in-v3.mailjet.com',
  'user': 'f1c4d17ec2d636ed3404af87f5940f8c',
  'password': 'aba4659d857c143d3d1d7125a76deac0',
};

var sendMessage = function(message, destination, subject, from, callback) {
  var connection = emailjs.server.connect({
    user: email.user,
    password: email.password,
    host: email.smtp,
    port: 25
  });

  connection.send({
    text: message,
    'reply-to': from || email.user,
    from: 'throwawaypsi@gmail.com',
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
  'salt': 10,
  'photoPath': __dirname + "/photo",
  'defaultPhoto': 'default_photo.png'
};
