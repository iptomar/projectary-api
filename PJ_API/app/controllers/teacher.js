var teacher = {

  /* POST: http://127.0.0.1/api/teacher
   * Create a teacher
   * @username
   * @password
   * @email
   */
  createTeacher: function(req, res) {
    var username = req.body.username || '';
    var password = req.body.password || '';
    var email = req.body.email || '';

    if (!username || !password || !email)
      res.status(401).json("Invalid credentials");
    // First let's check if the user already exists


  },

  /* PUT: http://127.0.0.1/api/teacher
   *
   */
  updateTeacher: function (req, res) {

	},
};

module.exports = teacher;
