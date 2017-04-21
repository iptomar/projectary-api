var uuid = require('uuid/v4');
var async = require('async');
var project = {

    /* GET: http://127.0.0.1/api/project/:id
     *
     */
    getProject: function(req, res) {
        var db = req.maria;
        var id = req.params.id;
        if (id) {
            db.getConnection(function(err, c) {
                c.query('SELECT id, start, end, lecyear, course, title, summary, nofstudents, objectives, prereqs FROM project WHERE id = ? LIMIT 1', id, function(err, rows) {
                    if (err) {
                        return res.json({
                            status: "NOK",
                            error: "Error getting project info"
                        });
                    }
                    c.query('SELECT user FROM projectmentors WHERE project = ?', id, function(err, rows2) {
                        if (err) {
                            return res.json({
                                status: "NOK",
                                error: "Error getting project info"
                            });
                        }
                        c.query('SELECT user FROM projectproponents WHERE project = ?', id, function(err, rows3) {
                            c.release();
                            if (err) {
                                return res.json({
                                    status: "NOK",
                                    error: "Error getting project info"
                                });
                            } else {
                                rows[0].mentors = rows2;
                                rows[0].proponents = rows3;
                                return res.json(rows[0]);
                            }
                        });
                    });
                });
            });
        }
    },

    /* PUT: http://127.0.0.1/api/project/:id
     *
     */
    updateProject: function(req, res) {
        var db = req.maria;
        var id = req.body.id || '';
        var title = req.body.title || '';
        var summary = req.body.summary || '';
        var nofstudents = req.body.nofstudents || '';
        var objectives = req.body.objectives || '';
        var prereqs = req.body.prereqs || '';
        var course = req.body.course || '';
        var start = req.body.start || '';
        var end = req.body.end || '';
        var lecyear = req.body.lecyear || '';
        var mentors = req.body.mentors || '';
        var state = req.body.state || '';
        var proponents = req.body.proponents || '';
        var begin_p = 'UPDATE project SET ';
        var end_k = ' WHERE id = ?';
        var conditions_p = [];
        var values_p = [];

        query_creator(conditions_p, values_p, "start", start);
        query_creator(conditions_p, values_p, "end", end);
        query_creator(conditions_p, values_p, "lecyear", lecyear);
        query_creator(conditions_p, values_p, "course", course);
        query_creator(conditions_p, values_p, "title", title);
        query_creator(conditions_p, values_p, "summary", summary);
        query_creator(conditions_p, values_p, "nofstudents", nofstudents);
        query_creator(conditions_p, values_p, "objectives", objectives);
        query_creator(conditions_p, values_p, "prereqs", prereqs);
        query_creator(conditions_p, values_p, "state", state);
        values_p.push(id);

        var query_p = begin_p + field_joiner(conditions_p) + end_k;
        if (mentors) {
            mentors = mentors.map(function(element) {
                return {
                    user: element,
                    project: id
                };
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
                c.query(query_p, values_p, function(err, rows) {
                    if (err) {
                        console.log(err);
                        return c.rollback(function() {
                            return res.json({
                                status: "NOK",
                                error: "Error executing query"
                            });
                        });
                    }
                    if (mentors) {
                        //corrigir query mal desenhada
                        async.mapSeries(mentors, function(queryData, callback) {
                            c.query("UPDATE projectmentors SET user = ?, project = ? WHERE project = ?", [queryData.user, queryData.project, id], function(error, rest) {
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
                    if (proponents) {
                        proponents = proponents.map(function(element) {
                            return {
                                user: element,
                                project: id
                            };
                        });
                        //corrigir query mal desenhada
                        async.mapSeries(proponents, function(data, callback) {
                            c.query('UPDATE projectproponents SET user = ?, project = ? WHERE project = ?', [data.user, data.project, id], function(err, rows) {
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
    },

    /* POST: http://127.0.0.1/api/project
     *
     */
    createProject: function(req, res) {
        var db = req.maria;
        var title = req.body.title || '';
        var summary = req.body.summary || '';
        var nofstudents = req.body.nofstudents || '';
        var objectives = req.body.objectives || '';
        var prereqs = req.body.prereqs || '';
        var state = 1;
        var course = req.body.course || '';
        var start = req.body.start || '';
        var end = req.body.end || '';
        var lecyear = req.body.lecyear || '';
        var mentors = req.body.mentors || '';
        var proponents = req.body.proponents || '';
        if (!title || !summary || !nofstudents || !objectives || !prereqs || !state || !course || !start || !end || !lecyear || !mentors) {
            res.json({
                status: "NOK",
                error: "Please provide all fields"
            });
        } else {
            var id = uuid();
            var id2 = uuid();
            mentors = mentors.map(function(element) {
                return {
                    user: element,
                    id: id2,
                    project: id
                };
            });
            db.getConnection(function(err, c) {
                c.beginTransaction(function(err) {
                    if (err) {
                        return res.json({
                            status: "NOK",
                            error: "Error executing query"
                        });
                    }
                    c.query('Insert INTO project(id,start,end, lecyear, course,title,summary, nofstudents, objectives, prereqs, state) VALUES (?,?,?,?,?,?,?,?,?,?,?) ', [id, start, end, lecyear, course, title, summary, nofstudents, objectives, prereqs, state], function(err, rows) {
                        if (err) {
                            console.log(err);
                            return c.rollback(function() {
                                return res.json({
                                    status: "NOK",
                                    error: "Error executing query"
                                });
                            });
                        }
                        async.mapSeries(mentors, function(data, callback) {
                            c.query('INSERT INTO projectmentors SET ?', data, function(err, rows) {
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
                        if (proponents) {
                            proponents = proponents.map(function(element) {
                                return {
                                    user: element,
                                    id: id2,
                                    project: id
                                };
                            });
                            async.mapSeries(proponents, function(data, callback) {
                                c.query('INSERT INTO projectproponents SET ?', data, function(err, rows) {
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
                });
            });
        }
    },

    /* GET: http://127.0.0.1/api/project
     *
     */
    getProjectsLst: function(req, res) {
      res.json({"msg":"not implemented yet"});
    },

    /* GET: http://127.0.0.1/api/project/:id/applications
     *
     */
    getProjectApl: function(req, res) {
      res.json({"msg":"not implemented yet"});
    },
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
module.exports = project;
