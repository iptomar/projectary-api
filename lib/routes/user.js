var vendors = require('../../vendors');

exports.create = function(req, res) {
  var params = req.body;
  vendors.mysql.getConnection(function(err, connection) {

    var values = {
      name: req.body.name,
      external_id: req.body.external,
      typeid: parseInt(req.body.type),
      email: req.body.email,
      phonenumber: req.body.phone,
      password: req.body.password
    };
    var query = connection.query('INSERT INTO user SET ?', values, function(error, results, fields) {
      connection.release();

      if (error) return res.status(500).json({
        'result': 'nok',
        'message': error
      });

      res.status(200).json({
        'result': 'ok'
      });

    });
  });
};

exports.list = function(req, res) {
  vendors.mysql.getConnection(function(err, connection) {

    var query = connection.query('SELECT * FROM user', function(error, results, fields) {
      connection.release();

      if (error) return res.status(500).json({
        'result': 'nok',
        'message': error
      });

      res.status(200).json({
        'result': 'ok',
        'data': results
      });

    });
  });
};

exports.info = function(req, res) {
  var id = req.params.id;

  vendors.mysql.getConnection(function(err, connection) {

    var query = connection.query('SELECT * FROM user WHERE ID = ' + id, function(error, results, fields) {
      connection.release();

      if (error) return res.status(500).json({
        'result': 'nok',
        'message': error
      });

      res.status(200).json({
        'result': 'ok',
        'data': results
      });

    });
  });
};
