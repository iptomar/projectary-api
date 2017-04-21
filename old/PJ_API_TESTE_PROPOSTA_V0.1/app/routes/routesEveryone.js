// ROUTES THAT ANYONE CAN ACCESS FOR OUR API
// =============================================================================
var express = require('express');
var router  = express.Router();
var auth = require('../controllers/auth');

/*
 * Routes that can be accessed by any one
 */

router.get('/', function(req, res) {
    res.json({message: 'API running'});
});

router.post('/login', auth.loginUser);
router.get('/token', auth.refreshToken);

module.exports = router;
