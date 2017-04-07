var uuid = require('uuid/v4');
var async = require('async');
var application = {

    /* POST: http://127.0.0.1/api/application
     *
     */
    applyProject: function(req, res) {
        var db = req.maria;
        var place = req.body.place;
        var course = req.body.course;
        var lecyear = req.body.lecyear;
        var group = req.body.group;
        var application = req.body.application;
        var state = 0;
        if (!place, !course, !lecyear, !group, !application) {
            res.json({
                status: "NOK",
                error: "Please provide all fields"
            });
        } else {
            db.getConnection(function(err, c) {
                c.beginTransaction(function(err) {
                    if (err) {
                        return res.json({
                            status: "NOK",
                            error: "Error executing query"
                        });
                    } else {
                        var id = uuid();
                        var studeng = uuid();
                        var appproj = uuid();
                        group.map(function(element) {
                            element.id = studeng;
                        });
                        application.map(function(element) {
                            element.id = appproj;
                        });
                        async.mapSeries(group, function(queryData, callback) {
                            c.query('Insert INTO studentsgroup SET ?', queryData, function(err, rows) {
                                if (err) {
                                    console.log(err);
                                    return c.rollback(function() {
                                        return res.json({
                                            status: "NOK",
                                            error: "Error executing query"
                                        });
                                    });
                                }
                            });
                        });
                        async.mapSeries(application, function(queryData, callback) {
                            c.query('Insert INTO applicationproject SET ?', queryData, function(err, rows) {
                                if (err) {
                                    console.log(err);
                                    return c.rollback(function() {
                                        return res.json({
                                            status: "NOK",
                                            error: "Error executing query"
                                        });
                                    });
                                }
                            });
                        });
                        c.query('Insert INTO application(id,studentgroup,applicationproject, course,place,lecyear,state) VALUES (?,?,?,?,?,?,?) ', [id, studeng, appproj, course, place, lecyear, state], function(err, rows) {
                            if (err) {
                                console.log(err);
                                return c.rollback(function() {
                                    return res.json({
                                        status: "NOK",
                                        error: "Error executing query"
                                    });
                                });
                            }
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
                    }
                });
            });
        }
    },

    /* GET: http://127.0.0.1/api/application
     *
     */
    getAllAplLst: function(req, res) {
        res.json({msg: "Not implemented yet"});
    },

    /* GET: http://127.0.0.1/api/application/:id
     *
     */
    getSpecificAplLst: function(req, res) {
        var db = req.maria;
        var id = req.params.id;
        db.getConnection(function(err, c) {
            c.query('SELECT course, place, lecyear, state, applicationproject, studentgroup FROM application WHERE id = ? LIMIT 1', id, function(err, rows) {
                if (err) {
                    return res.json({
                        status: "NOK",
                        error: "Error executing query"
                    });
                }
                c.query('SELECT project, preference FROM applicationproject WHERE id = ?', rows[0].applicationproject, function(err, rows1) {
                    if (err) {
                        return res.json({
                            status: "NOK",
                            error: "Error executing query"
                        });
                    }
                    c.query('SELECT student,ects,average FROM studentsgroup WHERE id = ?', [rows[0].studentgroup], function(err, rows2) {
                        c.release();
                        if (err) {
                            return res.json({
                                status: "NOK",
                                error: "Error executing query"
                            });
                        } else {
                            rows[0].application = rows1;
                            rows[0].project = rows2;
                            res.json(rows[0]);
                        }
                    });
                });
            });
        });
    },

    /* POST: http://127.0.0.1/api/application/:id/accept
     *Valta verificar se a candidatura existe
     */
    acceptApl: function(req, res) {
        var db = req.maria;
        var id = req.params.id;
        db.getConnection(function(err, c) {
            c.beginTransaction(function(err) {
                if (err) {
                    return res.json({
                        status: "NOK",
                        error: "Error executing query"
                    });
                } else {
                    c.query('UPDATE application SET state = ? WHERE id = ?', [1, id], function(err) {
                        if (err) {
                            console.log(err);
                            return c.rollback(function() {
                                return res.json({
                                    status: "NOK",
                                    error: "Error executing query"
                                });
                            });
                        }
                        c.query('SELECT applicationproject FROM application WHERE id = ? LIMIT 1', id, function(err, rows) {
                            if (err) {
                                console.log(err);
                                return c.rollback(function() {
                                    return res.json({
                                        status: "NOK",
                                        error: "Error executing query"
                                    });
                                });
                            }
                            c.query('SELECT project FROM applicationproject WHERE id = ? LIMIT 1', [rows[0].applicationproject], function(err, rows2) {
                                if (err) {
                                    console.log(err);
                                    return c.rollback(function() {
                                        return res.json({
                                            status: "NOK",
                                            error: "Error executing query"
                                        });
                                    });
                                }
                                c.query('UPDATE project SET state = ? WHERE id = ?', [5, rows2[0].project], function(err) {
                                    if (err) {
                                        console.log(err);
                                        return c.rollback(function() {
                                            return res.json({
                                                status: "NOK",
                                                error: "Error executing query"
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
            });
        });

    },
};

module.exports = application;
