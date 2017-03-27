var student = {
  /* POST: http://127.0.0.1/api/student
  *
  */
  createStudent: function(req, res) {
    req.maria.query('', function(err,rows){

    });
  },

  /* GET: http://127.0.0.1/api/student
  *
  */
  getStudentsLst: function (req, res) {
    req.maria.query('SELECT * FROM student', function(err,rows){
      if(err)
        return res.status(500).json(err);
      res.json(rows)
    });
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
