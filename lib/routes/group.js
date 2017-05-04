var vendors = require('../../vendors');

exports.create = function(req, res) {
  var params = req.body;
  params.password = crypto.createHash('md5').update(params.password).digest('hex');
  vendors.mysql.getConnection(function(err, connection) {

    var values = {
      desc: params.desc,
      password: params.password
    };

    var query = connection.query('INSERT INTO `group` SET ?', values, function(error, results, fields) {
      connection.release();

      if (error) return res.status(500).json({ 'result': 'nok', 'message': error });

      res.status(200).json({ 'result': 'ok' });

    });
  });
};

exports.join = function(req, res) {
  var params = req.body;
  vendors.mysql.getConnection(function(err, connection) {

    var values = {
      groupid: params.groupid,
      password: params.password
    };

    var query = connection.query('INSERT INTO groupuser SET ?', function(error, results, fields) {
      connection.release();

      if (error) return res.status(500).json({ 'result': 'nok', 'message': error });

      res.status(200).json({ 'result': 'ok', 'data': results });

    });
  });
};
