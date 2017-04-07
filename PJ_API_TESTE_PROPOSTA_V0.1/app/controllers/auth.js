var jwt = require('jwt-simple');
var bcrypt = require('bcrypt');
var db = require('../data/db');
var async = require('async');

var auth = {
    /*
     * User Login
     */
    loginUser: function(req, res) {
        // Receive the data that is on body
        var username = req.body.username || '';
        var password = req.body.password || '';
        if (!username || !password) {
            return res.status(401).json({
                status: "NOK",
                error: "Username or Password not provided"
            });
        }

        // Fire a query to your DB and check if the credentials are valid
        auth.validate(username, password, req.maria, function(err, results) {
            if (err) {
                return res.status(500).json({
                    status: "NOK",
                    error: "Error executing query"
                });
            }
            if (!results && !err)
                return res.status(401).json({
                    status: "NOK",
                    error: "Invalid credentials"
                });
            res.json(genToken(results));
        });
    },

    /*
     * Validates User credentials
     */
    //TODO: put active = 1 in db query
    validate: function(username, password, maria, mcallback) {
        async.waterfall([
            function(callback) {
                maria.getConnection(function(err, connection) {
                    connection.query('SELECT id, username, password FROM user WHERE username = ? AND locked = 0 AND active = 0 LIMIT 1', username, function(err, rows, fields) {
                        connection.release();
                        if (!err) {
                            if (rows.length === 0) {
                                rows = undefined;
                                callback(err, rows);
                            } else {
                                bcrypt.compare(password, rows[0].password, function(err, result) {
                                    if (result) {
                                        callback(err, rows[0]);
                                    }
                                });
                            }
                        } else callback(err);
                    });
                });
            }
        ], function(err, result) {
            return mcallback(err, result);
        });
    },

    checkRole: function(userId, maria, callback2) {
        async.waterfall([
            function(callback) {
                maria.getConnection(function(err, connection) {
                    connection.query('SELECT id from student where id = ? LIMIT 1', username, function(err, student) {
                        connection.release();
                        if (student.length === 0) {
                            connection.query('Select id from teacher where id = ? LIMIT 1', username, function(err, teacher) {
                                if (teacher.length === 1) {
                                  callback({role: "teacher"});
                                }
                            });
                        } else callback({role: "student"});
                    });
                });
            }
        ], function(result) {
            return callback2(result);
        });
    },


    /*
     * Validates Token credentials
     */
    //TODO: put active = 1 in db query
    validateToken: function(username, hash, maria, mcallback) {
        async.waterfall([
            function(callback) {
                maria.getConnection(function(err, connection) {
                    connection.query('SELECT id, username, password FROM user WHERE username = ? AND password = ? AND locked = 0 AND active = 0 LIMIT 1', [username, hash], function(err, rows, fields) {
                        connection.release();
                        if (!err) {
                            if (rows.length === 0) {
                                rows = undefined;
                            }
                            callback(err, rows[0]);
                        } else callback(err);
                    });
                });
            }
        ], function(err, result) {
            return mcallback(err, result);
        });
    },



    /*
     * Refresh Token
     */
    refreshToken: function(req, res) {
        var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'] || req.headers.authorization;
        if (token) {
            try {
                var decoded = jwt.decode(token, require('../auth/secret')());
                if (!decoded.user.username || !decoded.user.password || !decoded.exp) {
                    res.status(401).json({
                        status: "NOK",
                        error: 'Invalid Token'
                    });
                } else {
                    if (decoded.exp <= Date.now()) {
                        res.status(401).json({
                            status: "NOK",
                            error: 'Token Expired'
                        });
                    } else {
                        auth.validateToken(decoded.user.username, decoded.user.password, req.maria, function(err, results) {
                            if (err) res.status(401).json({
                                status: "NOK",
                                error: "Error executing query"
                            });
                            if (!results) res.status(401).json({
                                status: "NOK",
                                error: "Invalid User"
                            });
                            res.json(genToken(results));
                        });
                    }
                }
            } catch (err) {
                res.status(401).json({
                    status: "NOK",
                    error: 'Invalid Token'
                });
            }
        }
    },

};

// Private methods

// Generate token
function genToken(user) {
    var expires = expiresIn(1); // 1 day
    var token = jwt.encode({
        exp: expires,
        user: user
    }, require('../auth/secret')());

    return {
        token: token,
        expires: expires,
    };
}

//Define Expirity
function expiresIn(numDays) {
    var dateObj = new Date();
    return dateObj.setDate(dateObj.getDate() + numDays);
}

module.exports = auth;
