var student = {
	
/* POST: http://127.0.0.1/api/student
*
*/
createStudent: function(req, res) {

},

/* GET: http://127.0.0.1/api/student
*
*/
getStudentsLst: function (req, res) {
var db = req.maria;
	res.json({msg:"Teste"});
},

/* PUT: http://127.0.0.1/api/student
*
*/
updateStudent: function (req, res) {

},

/* GET: http://127.0.0.1/api/student/:id
*
*/
getStudent: function (req, res) {

},

/* POST: http://127.0.0.1/api/student/:id/approve
*
*/
approveStudent: function (req, res) {

},

};
module.exports = student;
