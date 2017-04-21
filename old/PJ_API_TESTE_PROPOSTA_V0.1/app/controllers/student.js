var bcrypt = require('bcrypt');
var salt = require('../data/salt');
var uuid = require('uuid/v4');
var async = require('async');
var student = {

    /* POST: http://127.0.0.1/api/student
     * //Fazer waterfall senão = chouriçada
     */
    createStudent: function(req, res) {
        var db = req.maria;
        var username = req.body.username || '';
        var password = req.body.password || '';
        var email = req.body.email || '';
        var usernumber = req.body.usernumber || '';
        //Not in procedures
        var photo = req.body.photo || '';
        var fullname = req.body.fullname || '';
        var courses = req.body.courses || '';
        var contacts = req.body.contacts || '';
        var interests = req.body.interests || '';
        var profilevis = req.body.visibility || ''; //Profile visibility
        if (!username || !password || !email || !usernumber || !fullname || !courses || !contacts || !interests || !profilevis) {
            res.json({
                status: "NOK",
                error: "Please provide all fields"
            });
        } else {
            if (!validateEmail(email)) {
                return res.json({
                    status: "NOK",
                    error: "Invalid Email Provided"
                });
            } else {
                db.getConnection(function(err, c) {
                    c.beginTransaction(function(err) {
                        if (err) {
                            return res.json({
                                status: "NOK",
                                error: "Error executing query"
                            });
                        }
                        var id = uuid();
                        contacts.map(function(element) {
                            element.user = id;
                        });
                        courses.map(function(element) {
                            element.student = id;
                        });
                        //Fazer waterfall senão = chouriçada
                        bcrypt.hash(password, salt, function(err, hash) {
                            db.getConnection(function(err, c) {
                                c.query("Insert INTO user(id,username,password, email, visibility, fullname) VALUES (?,?,?,?,?,?)", [id, username, hash, email, profilevis, fullname], function(err, rows) {
                                    if (err) {
                                        console.log(err);
                                        return c.rollback(function() {
                                            return res.json({
                                                status: "NOK",
                                                error: "Error executing query"
                                            });
                                        });
                                    }

                                    c.query("Insert INTO student(id,studentid, interests) VALUES (?,?,?)", [id, usernumber, interests], function(err, rows) {
                                        if (err) {
                                            console.log(err);
                                            return c.rollback(function() {
                                                return res.json({
                                                    status: "NOK",
                                                    error: "Error executing query"
                                                });
                                            });
                                        }
                                        //    INSERT INTO user (id,username,password,email,createdin,locked,active,photo, profilevis)VALUES(UUID,username,password,email,NOW(),0,0, photo, profilevis);

                                        async.mapSeries(contacts, function(queryData, callback) {
                                            c.query("INSERT INTO usercontact SET ?", queryData, function(error, rest) {
                                                if (error) {
                                                    console.log(error);
                                                    return c.rollback(function() {
                                                        return res.json({
                                                            status: "NOK",
                                                            error: "Error executing query"
                                                        });
                                                    });
                                                }
                                            });
                                        });
                                        async.mapSeries(courses, function(queryData, callback) {
                                            c.query("INSERT INTO studentcourse SET ?", queryData, function(error, rest) {
                                                if (error) {
                                                    console.log(error);
                                                    return c.rollback(function() {
                                                        return res.json({
                                                            status: "NOK",
                                                            error: "Error executing query"
                                                        });
                                                    });
                                                }
                                            });
                                        });
                                        c.commit(function(err) {
                                            if (err) {
                                                return c.rollback(function() {
                                                    res.json({
                                                        status: "NOK",
                                                        error: "Error executing query"
                                                    });
                                                });
                                            } else {
                                                c.release();
                                                res.json({
                                                    status: "OK"
                                                });
                                            }

                                        });
                                    });
                                });
                            });
                        });
                    });
                });

            }
        }
    },


    //
    //INSERT INTO student VALUES(UUID,extid);

    /* GET: http://127.0.0.1/api/student
     *
     */
    getStudentsLst: function(req, res) {
        var db = req.maria;
        db.getConnection(function(err, c) {
            c.query('SELECT student.id, student.studentid, student.interests, user.username, user.email, user.fullname FROM `student` INNER JOIN `user` ON `student`.`id` = `user`.`id`', function(err, rows) {
                if (err) {
                    console.log(err);
                    return res.json({
                        status: "NOK",
                        error: "Error checking student existence"
                    });
                } else {
                    var ids = rows.map(function(a) {
                        return a.id;
                    });
                    res.json(ids);
                }
                // async.mapSeries(ids, function(queryData, callback) {
                //     c.query("INSERT INTO usercontact SET ?", queryData, function(error, rest) {
                //         if (error) {
                //             console.log(error);
                //             return c.rollback(function() {
                //                 return res.json({
                //                     status: "NOK",
                //                     error: "Error executing query"
                //                 });
                //             });
                //         }
                //     });
                // });


                //     c.query('SELECT contact, type FROM usercontact WHERE user = ?;', studentid, function(err, rows2) {
                //         if (err) {
                //             console.log(err);
                //             return res.json({
                //                 status: "NOK",
                //                 error: "Error checking student existence"
                //             });
                //         }
                //         c.query('SELECT course, enryear type FROM studentcourse WHERE student = ?;', studentid, function(err, rows3) {
                //             c.release();
                //             if (err) {
                //                 console.log(err);
                //                 return res.json({
                //                     status: "NOK",
                //                     error: "Error checking student existence"
                //                 });
                //             } else {
                //                 rows[0].contacts = rows2;
                //                 rows[0].courses = rows3;
                //                 return res.json(rows[0]);
                //             }
                //         });
                //     });
            });
        });
    },

    /* PUT: http://127.0.0.1/api/student
     * Falta atualizar fullname
     * Callback hell usar async
     */
    updateStudent: function(req, res) {
        var db = req.maria;
        var user = req.body.user || '';
        if (!user) {
            user = req.user;
        }
        var username = req.body.username || '';
        var password = req.body.password || '';
        var email = req.body.email || '';
        var usernumber = req.body.usernumber || '';
        //Not in procedures
        var photo = req.body.photo || '';
        var fullname = req.body.fullname || '';
        var courses = req.body.courses || '';
        var contacts = req.body.contacts || '';
        var interests = req.body.interests || '';
        var visibility = req.body.visibility || ''; //Profile visibility

        var begin_u = 'UPDATE user SET ';
        var end = ' WHERE id = ?';
        var conditions_u = [];
        var values_u = [];
        var begin_a = 'UPDATE student SET ';
        var conditions_a = [];
        var values_a = [];

        query_creator(conditions_u, values_u, "username", username);
        if (password) {
            bcrypt.hash(password, salt, function(err, hash) {
                if (hash) query_creator(conditions_u, values_u, "password", hash);
                else return res.json({
                    status: "NOK",
                    error: "Error hashing password"
                });
            });
        }
        if (email) {
            if (validateEmail(email)) query_creator(conditions_u, values_u, "email", email);
            else return res.json({
                status: "NOK",
                error: "Invalid email provided"
            });
        }

        query_creator(conditions_u, values_u, "fullname", fullname);
        query_creator(conditions_u, values_u, "visibility", visibility);
        values_u.push(user);

        query_creator(conditions_a, values_a, "studentid", usernumber);
        query_creator(conditions_a, values_a, "interests", interests);
        values_a.push(user);

        var query_u = begin_u + field_joiner(conditions_u) + end;
        var query_a = begin_a + field_joiner(conditions_a) + end;
        if(contacts){
          contacts.map(function(element) {
              element.user = user;
          });
        }
        db.getConnection(function(err, c) {
            c.beginTransaction(function(err) {
                if (err) {
                    return res.json({
                        status: "NOK",
                        error: "Error executing query"
                    });
                }
                c.query(query_u, values_u, function(err, rows) {
                    if (err) {
                        console.log(err);
                        return c.rollback(function() {
                            return res.json({
                                status: "NOK",
                                error: "Error executing query"
                            });
                        });
                    }
                    c.query(query_a, values_a, function(error, results) {
                        if (error) {
                            console.log(error);
                            return c.rollback(function() {
                                return res.json({
                                    status: "NOK",
                                    error: "Error executing query"
                                });
                            });
                        }
                        if (contacts) {
                            async.mapSeries(contacts, function(queryData, callback) {
                                c.query("INSERT INTO usercontact SET ? on duplicate key update `type` = VALUES(`type`),`contact` = VALUES(`contact`)", queryData, function(error, res) {
                                    if (error) {
                                        console.log(error);
                                        return c.rollback(function() {
                                            return res.json({
                                                status: "NOK",
                                                error: "Error executing query"
                                            });
                                        });
                                    }
                                });
                            });
                        }
                        c.commit(function(err) {
                            if (err) {
                                return c.rollback(function() {
                                    return res.json({
                                        status: "NOK",
                                        error: "Error executing query"
                                    });
                                });
                            }
                            c.release();
                            res.json({
                                status: "OK"
                            });
                        });
                    });
                });
            });
        });
    },

    /* GET: http://127.0.0.1/api/student/:id
     *
     */
    //Fazer waterfall senão = chouriçada
    getStudent: function(req, res) {
        var db = req.maria;
        var studentid = req.params.id || '';
        if (studentid) {
            db.getConnection(function(err, c) {
                c.query('SELECT student.id, student.studentid, student.interests, user.username, user.email, user.fullname FROM `student` INNER JOIN `user` ON `student`.`id` = `user`.`id` WHERE student.id = ? LIMIT 1;', studentid, function(err, rows) {
                    if (err) {
                        console.log(err);
                        return res.json({
                            status: "NOK",
                            error: "Error checking student existence"
                        });
                    }
                    c.query('SELECT contact, type FROM usercontact WHERE user = ?;', studentid, function(err, rows2) {
                        if (err) {
                            console.log(err);
                            return res.json({
                                status: "NOK",
                                error: "Error checking student existence"
                            });
                        }
                        c.query('SELECT course, enryear type FROM studentcourse WHERE user = ?;', studentid, function(err, rows3) {
                            c.release();
                            if (err) {
                                console.log(err);
                                return res.json({
                                    status: "NOK",
                                    error: "Error checking student existence"
                                });
                            } else {
                                rows[0].contacts = rows2;
                                rows[0].courses = rows3;
                                return res.json(rows[0]);
                            }
                        });
                    });
                });
            });
        }
    },
    /* POST: http://127.0.0.1/api/student/:id/approve
     *
     */
    approveStudent: function(req, res) {
        var db = req.maria;
        var studentid = req.params.id || '';
        if (studentid) {
            studentExits(studentid, db, function(result) {
                if (result === true) {
                    db.getConnection(function(err, c) {
                        c.query('UPDATE user SET active = 1 where id = ?', studentid, function(err, rows) {
                            c.release();
                            if (err) {
                                return res.json({
                                    status: "NOK",
                                    error: "Error approving student"
                                });
                            } else return res.json({
                                status: "OK"
                            });
                        });
                    });
                } else {
                    return res.json({
                        status: "NOK",
                        error: "Student doesn't exists in db"
                    });
                }
            });
        }
    },
};

function studentExits(id, db, callback) {
    db.getConnection(function(err, c) {
        c.query('SELECT id from student where id = ?', id, function(err, rows) {
            c.release();
            if (err) {
                return res.json({
                    status: "NOK",
                    error: "Error checking student existence"
                });
            } else if (rows.length > 0) {
                return callback(true);
            }
            return callback(false);
        });
    });
}

function field_joiner(field_array) {
    return field_array.length ? field_array.join(", ") : "1";
}

function query_creator(field_array, value_array, table_field, value) {
    if (value) {
        field_array.push(table_field + " = ?");
        value_array.push(value);
    }
}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

module.exports = student;
