var bcrypt = require('bcrypt');
var async = require('async');
var salt = require('../data/salt');
var uuid = require('uuid/v4');
var teacher = {
    /* POST: http://127.0.0.1/api/teacher
     * Create a teacher
     * @username
     * @password
     * @email
     */
    createTeacher: function(req, res) {
        var db = req.maria;
        var username = req.body.username || '';
        var password = req.body.password || '';
        var email = req.body.email || '';
        //Not in the procedures.
        var link = req.body.link || '';
        var du = req.body.du || ''; //unidade departamental
        var photo = req.body.photo || '';
        var fullname = req.body.fullname || '';
        var contacts = req.body.contacts || '';
        var areas = req.body.areas || ''; //áreas funcionais
        var visibility = req.body.visibility; //Profile visibility
        if (!username || !password || !email || !du || !fullname || !contacts || !areas || !visibility)
            res.json({
                status: "NOK",
                error: "Please provide all fields"
            });
        else {
            if (!validateEmail(email)) {
                return res.json({
                    status: "NOK",
                    error: "Invalid Email Provided"
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
                    var id = uuid();
                    contacts.map(function(element) {
                        element.user = id;
                    });
                    //Fazer waterfall senão = chouriçada
                    bcrypt.hash(password, salt, function(err, hash) {
                        db.getConnection(function(err, c) {
                            c.query("Insert INTO user(id,username,password, email, visibility, fullname) VALUES (?,?,?,?,?,?)", [id, username, hash, email, visibility, fullname], function(err, rows) {
                                if (err) {
                                    console.log(err);
                                    return c.rollback(function() {
                                        return res.json({
                                            status: "NOK",
                                            error: "Error executing query"
                                        });
                                    });
                                }
                                c.query("Insert INTO teacher(id,depunit, link,areasfun) VALUES (?,?,?,?)", [id, du, link, areas], function(err, rows) {
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
        } // First let's check if the user already exists


    },
    /* PUT: http://127.0.0.1/api/teacher
     *
     */
    updateTeacher: function(req, res) {
        var db = req.maria;
        var user = req.body.user || '';
        if (!user) {
            user = req.user;
        }
        var username = req.body.username || '';
        var password = req.body.password || '';
        var email = req.body.email || '';
        //Not in the procedures.
        var link = req.body.link || '';
        var depunit = req.body.depunit || ''; //unidade departamental
        var photo = req.body.photo || '';
        var fullname = req.body.fullname || '';
        var contacts = req.body.contacts || '';
        var areas = req.body.areas || ''; //áreas funcionais
        var visibility = req.body.visibility || ''; //Profile visibility
        var begin_u = 'UPDATE user SET ';
        var end = ' WHERE id = ?';
        var conditions_u = [];
        var values_u = [];
        var begin_t = 'UPDATE teacher SET ';
        var conditions_t = [];
        var values_t = [];

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

        query_creator(conditions_t, values_t, "depunit", depunit);
        query_creator(conditions_t, values_t, "link", link);
        query_creator(conditions_t, values_t, "areasfun", areas);
        values_t.push(user);

        var query_u = begin_u + field_joiner(conditions_u) + end;
        var query_t = begin_t + field_joiner(conditions_t) + end;
        if (contacts) {
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
                        return c.rollback(function() {
                            return res.json({
                                status: "NOK",
                                error: "Error executing query"
                            });
                        });
                    }
                    c.query(query_t, values_t, function(error, results) {
                        if (error) {
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
    }
};

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

module.exports = teacher;
