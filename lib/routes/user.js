var vendors = require('../../vendors'),
  crypto = require('crypto'),
  multer = require('multer'),
  mime = require('mime'),
  fs = require('fs'),
  path = require('path');


/** Photo upload folder destination definiton
 * definiton of photo name randomNumber + Date Now
 */
var storage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, vendors.photoPath);
  },
  filename: function(req, file, callback) {
    crypto.pseudoRandomBytes(16, function(err, raw) {
      callback(null, raw.toString('hex') + Date.now() + '.' + mime.extension(file.mimetype));
    });
  }
});

/**
 * ToDo: Check if the username is already used
 * From route [POST] /USER
 * Create a Student
 * @param  name       The student name
 * @param  external   The external id
 * @param  email      The student email
 * @param  phone      The student phonenumber
 * @param  password   The student password
 * @param  school     The school attribute
 * @param  course     The course attribute
 * @param  interests  The interests attribute
 */
exports.createStudent = function(req, res) {
  var params = req.body;
  params.password = crypto.createHash('md5').update(params.password).digest('hex');

  vendors.mysql.getConnection(function(err, connection) {
    var values = {
      name: params.name,
      external_id: params.external,
      typeid: 1,
      email: params.email,
      phonenumber: params.phone,
      password: params.password,
    };

    //We know the code is not beautifull TODO: use async waterfall
    connection.beginTransaction(function(err) {
      if (err) return res.json({ 'result': 'nok', 'message': 'Ocorreu um erro a executar a query. ' + err });
      // Insert the user
      connection.query('INSERT INTO user SET ?', values, function(error, results, fields) {
        if (error) return connection.rollback(function() { //if error rollback transaction
          connection.release(); //releases mysql connection on error
          res.status(500).json({ 'result': 'nok', 'message': 'Ocorreu um erro a executar a query. ' + error });
        });
        var obj = { userid: results.insertId, attributeid: 2, value: params.school };
        // Insert the school attribute
        connection.query('INSERT INTO `userattribute` SET ?', obj, function(err) {
          if (err) return connection.rollback(function() { //if error rollback transaction
            connection.release(); //releases mysql connection on error
            res.status(500).json({ 'result': 'nok', 'message': 'Ocorreu um erro a executar a query. ' + err });
          });
          obj = { userid: results.insertId, attributeid: 1, value: params.course };
          // Insert the course attribute
          connection.query('INSERT INTO `userattribute` SET ?', obj, function(err) {
            if (err) return connection.rollback(function() { //if error rollback transaction
              connection.release(); //releases mysql connection on error
              res.status(500).json({ 'result': 'nok', 'message': 'Ocorreu um erro a executar a query. ' + err });
            });
            obj = { userid: results.insertId, attributeid: 3, value: params.interests };
            // Insert the interests attribute
            connection.query('INSERT INTO `userattribute` SET ?', obj, function(err) {
              if (err) return connection.rollback(function() { //if error rollback transaction
                connection.release(); //releases mysql connection on error
                res.status(500).json({ 'result': 'nok', 'message': 'Ocorreu um erro a executar a query. ' + error });
              });
              //Commit the transaction if error rollback transaction
              connection.commit(function(err) {
                if (err) return connection.rollback(function() {
                  connection.release(); //releases mysql connection on error
                  res.status(500).json({ 'result': 'nok', 'message': 'Ocorreu um erro a executar a query. ' + err });
                });
                connection.release(); //releases mysql connection
                res.status(200).json({ 'result': 'ok' });
              });
            });
          });
        });
      });
    });
  });
};

/**
 * From route [POST] /TEACHER
 * Create a Teacher
 * @param  name       The teacher name
 * @param  external   The external id
 * @param  email      The student email
 * @param  phone      The student phonenumber
 * @param  password   The student password
 */
exports.createTeacher = function(req, res) {
  var params = req.body;

  if (req.user.isadmin === 0) return res.status(403).json({ 'result': 'nok', 'message': 'Não tem permissões para aceder a este recurso' });
  params.password = crypto.createHash('md5').update(params.password).digest('hex');

  vendors.mysql.getConnection(function(err, connection) {
    var values = {
      name: params.name,
      external_id: params.external,
      typeid: 2,
      email: params.email,
      phonenumber: params.phone,
      password: params.password,
      locked: 0,
      active: 1
    };
    connection.query('INSERT INTO user SET ?', values, function(error) {
      connection.release();
      if (error) return res.status(500).json({ 'result': 'nok', 'message': 'Ocorreu um erro a executar a query. ' + error });
      res.status(200).json({ 'result': 'ok' });
    });
  });
};

/**
 * From route [GET] /USER
 * Get Users list
 */
exports.list = function(req, res) {
  vendors.mysql.getConnection(function(err, connection) {
    connection.query('SELECT * FROM user', function(error, results, fields) {
      connection.release();
      if (error) return res.status(500).json({ 'result': 'nok', 'message': 'Ocorreu um erro a executar a query.' + error });
      if (results < 1) {
        return res.status(404).json({ 'result': 'nok', 'message': 'Não foi possível encontrar utilizadores' });
      } else {
        return res.status(200).json({ 'result': 'ok', 'data': results });
      }
    });
  });
};

/**
 * From route [GET] /USER
 * Get the information of one user
 * @param  id   The user id
 */
exports.info = function(req, res) {
  var id = parseInt(req.params.id);
  vendors.mysql.getConnection(function(err, connection) {
    // Get the user data
    connection.query('SELECT * FROM USER WHERE id = ?', id, function(error, results, fields) {
      if (error) return res.status(500).json({ 'result': 'nok', 'message': error });
      // Get the group of the user
      connection.query('SELECT `group`.id AS groupid, `group`.desc AS groupname FROM `group`, groupuser, user WHERE groupuser.groupid = `group`.id AND groupuser.userid = user.id AND groupuser.userid = ?', id, function(error, results1, fields) {
        connection.release();
        if (error) return res.status(500).json({ 'result': 'nok', 'message': 'Ocorreu um erro a executar a query. ' + error });
        // Check if there is an user
        if (results < 1) {
          res.status(404).json({ 'result': 'nok', 'message': 'Não foi possível encontrar o utilizador' });
        } else {
          // If the user has a group, add it to the results
          if (results1 !== 0) {
            results[0].groupid = results1[0].groupid;
            results[0].groupname = results1[0].groupname;
          }
          // Delete sensitive data
          delete results[0].typeid;
          delete results[0].password;
          res.status(200).json({ 'result': 'ok', 'data': results[0] });
        }
      });
    });
  });
};

/**
 * From route [PUT] /USER
 * Update a User
 * @param  name         The new user name
 * @param  email        The new user email
 * @param phonenumber   The new user phonenumber
 * @param password      The new user password
 */
exports.update = function(req, res) {
  var params = req.body;
  params.password = crypto.createHash('md5').update(params.password).digest('hex');

  vendors.mysql.getConnection(function(err, connection) {
    var values = {
      name: params.name,
      email: params.email,
      phonenumber: params.phonenumber,
      password: params.password
    };

    connection.query('UPDATE user SET ? WHERE id = ?', [values, req.user.id], function(error, results, fields) {
      connection.release();
      if (error) return res.status(500).json({ 'result': 'nok', 'message': 'Ocorreu um erro a executar a query. ' + error });
      res.status(200).json({ 'result': 'ok' });
    });
  });
};

/**
 * From route [POST] /LOGIN
 * Login a User
 * This route will return the data present on auth.js
 */
exports.login = function(req, res) {
  res.status(200).json({ 'result': 'ok', 'data': req.user });
};

/**
 * From route [POST] /USER/:ID/APPROVE
 * Approve a user
 * @param  id   The user that should be active
 */
exports.approve = function(req, res) {
  if (req.user.isadmin != 1) return res.status(403).json({ 'result': 'nok', 'message': 'You don´t have permission to execute this action' });
  vendors.mysql.getConnection(function(err, connection) {
    connection.query('UPDATE user SET active = 1 WHERE id = ?', parseInt(req.params.id), function(error, results, fields) {
      connection.release();
      if (error) return res.status(500).json({ 'result': 'nok', 'message': 'Ocorreu um erro a executar a query. ' + error });
      res.status(200).json({ 'result': 'ok' });
    });
  });
};

/**
 * From route [PUT] /USER/CHPASSWORD
 * Change the user password
 * @param  password   The new password
 */
exports.chPassword = function(req, res) {
  var params = req.body;
  // check for null password
  if (!params.password)
  return res.status(400).json({ 'result': 'nok', 'message': 'Password Inválida' });

  params.password = crypto.createHash('md5').update(params.password).digest('hex');

  if (req.user.isadmin === 1) {
    if(!params.id)
    return res.status(400).json({ 'result': 'nok', 'message': 'Id do Utilizador em falta' });

    vendors.mysql.getConnection(function(err, connection) {
      // Get the current password
      connection.query('SELECT id FROM user WHERE id = ? LIMIT 1',parseInt(params.id), function(error, results, fields) {
        if (error) return res.status(500).json({ 'result': 'nok', 'message': error });
        // If the user doesn't exists
        if (results[0]<1) return res.status(400).json({ 'result': 'nok', 'message': 'Utilizador não existe' });
        connection.query('UPDATE user SET password = ? WHERE id = ?', [params.password, parseInt(params.id)], function(error, results, fields) {
          connection.release();
          if (error) return res.status(500).json({ 'result': 'nok', 'message': 'Ocorreu um erro a executar a query. ' + error });
          res.status(200).json({ 'result': 'ok' });
        });
      });
    });
  } else
    vendors.mysql.getConnection(function(err, connection) {
      // Get the current password
      connection.query('SELECT password FROM user WHERE id = ? LIMIT 1', req.user.id, function(error, results, fields) {
        if (error) return res.status(500).json({ 'result': 'nok', 'message': error });
        // If the old password matches the new password
        if (results[0].password == params.password) return res.status(400).json({ 'result': 'nok', 'message': 'You already used this password' });
        // Update the password
        connection.query('UPDATE user SET password = ? WHERE id = ?', [params.password, req.user.id], function(error, results, fields) {
          connection.release();
          if (error) return res.status(500).json({ 'result': 'nok', 'message': 'Ocorreu um erro a executar a query. ' + error });
          res.status(200).json({ 'result': 'ok' });
        });
      });
    });
};

/**
 * From route [GET] /USER/PENDING
 * Get not confirmed users
 */
exports.pending = function(req, res) {
  if (req.user.isadmin != 1) return res.status(403).json({ 'result': 'nok', 'message': 'You don´t have permission to execute this action' });
  vendors.mysql.getConnection(function(err, connection) {
    connection.query('SELECT * FROM user WHERE active = 0', function(error, results, fields) {
      connection.release();

      if (error) return res.status(500).json({ 'result': 'nok', 'message': 'Ocorreu um erro a executar a query. ' + error });
      res.status(200).json({ 'result': 'ok', 'data': results });
    });
  });
};

/**
 * From route [PUT] /USER/:ID/SWLOCK
 * Switch the lock state of the user
 * @param  id   The user id
 */
exports.swLock = function(req, res) {
  if (req.user.isadmin != 1) return res.status(403).json({ 'result': 'nok', 'message': 'You don´t have permission to execute this action' });
  vendors.mysql.getConnection(function(err, connection) {
    // Get the user locked state
    connection.query('SELECT locked FROM user WHERE id = ?', parseInt(req.params.id), function(error, results, fields) {
      // If is locked set switch to 0, else set switch to 1
      var sw = (results[0].locked) ? 0 : 1;
      // Update the user with the switch state
      connection.query('UPDATE user SET locked = ? WHERE id = ?', [sw, parseInt(req.params.id)], function(error, results, fields) {
        connection.release();
        if (error) return res.status(500).json({ 'result': 'nok', 'message': 'Ocorreu um erro a executar a query. ' + error });
        res.status(200).json({ 'result': 'ok' });
      });
    });
  });
};

/* example output: console.log(req.file)
      { fieldname: 'upl',
        originalname: 'grumpy.png',
        encoding: '7bit',
        mimetype: 'image/png',
        destination: './uploads/',
        filename: '436ec561793aa4dc475a88e84776b1b9',
        path: 'uploads/436ec561793aa4dc475a88e84776b1b9',
        size: 277056 }


Frontend code used for testing:
<!DOCTYPE html>
<html>
        <form id        =  "uploadForm"
             enctype   =  "multipart/form-data"
             action    =  "/photo"
             method    =  "post"
        >
        <input type="file" name="userPhoto" />
        <input type="submit" value="Upload Image" name="submit">
        </form>
</html>
*/


/**
 * From route [POST] /PHOTO
 * Upload a user photo to the server.
 * Photo's saved in folder
 * @param  id   The user id
 */

var upload = multer({ storage: storage }).single('userPhoto');

exports.sendPhoto = function(req, res) {
  upload(req, res, function(err) {
    if (err) return res.status(500).json({ 'result': 'nok', 'message': err });
    else {
      vendors.mysql.getConnection(function(err, connection) {
        connection.query('UPDATE user SET photo = ? WHERE id = ?', [req.file.filename, parseInt(req.user.id)], function(error, results) {
          connection.release();
          if (error) return res.status(500).json({ 'result': 'nok', 'message': 'Ocorreu um erro a executar a query.' + error });
          res.status(200).json({ 'result': 'ok' });
        });
      });
    }
  });
};

exports.getPhoto = function(req, res) {
  var defaultPhoto = vendors.photoPath + "/" + vendors.defaultPhoto;
  try {
    vendors.mysql.getConnection(function(err, connection) {
      connection.query('SELECT photo FROM user WHERE id = ? LIMIT 1', parseInt(req.params.id), function(error, results) {
        connection.release();
        if (error) res.sendFile(defaultPhoto);
        else {
          var photo = defaultPhoto;
          if (results.length >= 1) {
            photo = vendors.photoPath + "/" + results[0].photo;
            if (!fs.existsSync(photo)) photo = defaultPhoto;
          }
          res.sendFile(photo);
        }
      });
    });
  } catch (e) {
    res.status(400).json({ 'result': 'nok', 'message': 'Error getting image' });
  }
};


exports.recoverUser = function(req, res) {
  var username = req.params.user;
  vendors.mysql.getConnection(function(err, connection) {
    connection.query('SELECT * FROM user WHERE email = ? LIMIT 1', username, function(error, results) {
      if (error || results.length != 1) { connection.release(); return res.status(500).json({ 'result': 'nok', 'message': 'Error fetching user (DB)' }); } else {
        var token = crypto.randomBytes(10).toString('hex');
        connection.query('UPDATE user SET token = ? WHERE email = ?', [token, results[0].email], function(error) {
          if (error) { connection.release(); return res.status(500).json({ 'result': 'nok', 'message': 'Error saving USER details (DB)' }); } else {
            connection.release();
            vendors.email(vendors.url + '/user/' + results[0].email + '/recover/' + token, results[0].email, 'Password recovery');
            res.status(200).json({ 'result': 'ok' });
          }
        });
      }
    });
  });
};

exports.recoverUserToken = function(req, res) {
  var username = req.params.user;
  var token = req.params.token;

  vendors.mysql.getConnection(function(err, connection) {
    connection.query('SELECT user.email, user.token FROM user WHERE email = ? LIMIT 1', username, function(error, results) {
      if (error || results.length != 1) { connection.release(); return res.status(500).json({ 'result': 'nok', 'message': 'Error fetching user (DB)' }); } else if (token && token.length > 1 && token === results[0].token) {
        delete results[0].token;
        var password = crypto.randomBytes(5).toString('hex');
        connection.query('UPDATE user SET password = ? WHERE email = ?', [crypto.createHash('md5').update(password).digest('hex'), results[0].email], function(error) {
          if (error) { connection.release(); return res.status(500).json({ 'result': 'nok', 'message': 'Error saving USER details (DB)' }); } else {
            connection.release();
            vendors.email('New password is: ' + password, results[0].email, 'New password');
            res.status(200).json({ 'result': 'ok', 'massage': 'New password sent to the account\'s email address.' });
          }
        });
      }
    });
  });
};
