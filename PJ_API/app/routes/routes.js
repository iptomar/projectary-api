// ROUTES FOR OUR API
// =============================================================================
var express = require('express');
var router = express.Router();

var auth = require('./auth');
var users = require('../data/users');
/*
 * Routes that can be accessed by any one
 */

router.get('/', function(req, res) {
    res.json({message: 'API running'});
});
	
router.post('/auth', auth.login);
router.post('/register', users.create)

/*
 * Routes that can be accessed only by autheticated users
 */


 /*
 * Routes that can be accessed only by authenticated & authorized users
 */

 
router.route('/api/admin/users/:id')
.get(users.getOne)
.put(users.update)
.delete(users.delete)

router.route('/api/admin/users')
.get(users.getAll)

module.exports = router;
