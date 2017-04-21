var project = {

  /* GET: http://127.0.0.1/api/project/:id
  *
  */
  getProject: function(req, res) {

  },

  /* PUT: http://127.0.0.1/api/project/:id
  *
  */
  updateProject: function (req, res) {

	},

  /* POST: http://127.0.0.1/api/project
   * @application ->
   * @entity ->
   */
  createProject: function (req, res) {

	},

  /* GET: http://127.0.0.1/api/project/:approved
   * @approved -> flag to return approved projects
   *         0 -> returns approved projects
             1 -> returns  disapproved projects
             other -> returns all the projects
   */
  getProjectsLst: function (req, res) {
    var db = req.maria;
    db.getConnection(function(err, c) {
      // return approved projects
      if (req.params.id == 1){
        c.query('API_ListProjects(1)', function(err,rows){
          c.release();
          if(err){
            res.json({status:"NOK", error:"Error executing query"});
          } else {
            res.json({status:"OK", result:rows});
          }
        });
      // return disapproved projects
    } else if (req.params.id == 0) {
        c.query('API_ListProjects(0)', function(err,rows){
          c.release();
          if(err){
            res.json({status:"NOK", error:"Error executing query"});
          } else {
            res.json({status:"OK", result:rows});
          }
        });
      // return all the projects
      // ToDo: there is no db
      } else {

      }
    });
	},

  /* GET: http://127.0.0.1/api/project/:id/applications
   *
   */
  getProjectApl: function (req, res) {

  },
};

module.exports = project;
