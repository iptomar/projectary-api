// ROUTES FOR OUR API
// =============================================================================
var express = require('express');
var router  = express.Router();

var api = require('../controllers/index');

/*
 * Routes that can be accessed by any one
 */

router.get('/', function(req, res) {
    res.json({message: 'API running'});
});

router.post('/login', api.auth.loginUser);
router.post('/refresh_token', api.auth.refreshToken);


/*
 * Student Routes
 * 1: POST: http://127.0.0.1/api/student
 * 2: GET: http://127.0.0.1/api/student
 * 3: PUT: http://127.0.0.1/api/student
 * 4: GET: http://127.0.0.1/api/student/:id
 * 5: POST: http://127.0.0.1/api/student/:id/approve
 */

router.route('/api/student/')
  .post(api.student.createStudent)  //1: Create a student
  .get(require('../auth/valRequest'), api.student.getStudentsLst)  //2: Get students list
  .put(api.student.updateStudent)   //3: Update a student

router.get('/api/student/:id', api.student.getStudent);              //4: Get a student
router.post('/api/student/:id/approve', api.student.approveStudent); //5: Approve a student

/*
 * Project Routes
 * 1: GET: http://127.0.0.1/api/project/:id
 * 2: PUT: http://127.0.0.1/api/project/:id
 * 3: POST: http://127.0.0.1/api/project
 * 4: GET: http://127.0.0.1/api/project
 * 5: GET: http://127.0.0.1/api/project/:id/applications
 */

router.route('/api/project/:id')
  .get(api.project.getProject)    //1: Get a project
  .put(api.project.updateProject) //2: Update a project

router.route('/api/project/')
  .post(api.project.createProject) //3: Create a project
  .get(api.project.getProjectsLst) //4: Get project list

router.get('/api/project/:id/applications', api.project.getProjectApl) //5: Get applications list


/*
 * Application Routes
 * 1: POST: http://127.0.0.1/api/application
 * 2: GET: http://127.0.0.1/api/application
 * 3: GET: http://127.0.0.1/api/application/:id
 * 4: POST: http://127.0.0.1/api/application/:id/accept
 */

router.route('/api/application/')
  .post(api.application.applyProject) //1: Apply for a Project
  .get(api.application.getAllAplLst)  //2: Get application list

router.get('/api/application/:id', api.application.getSpecificAplLst) //3: Get a specific application list
router.post('/api/application/:id/accept', api.application.acceptApl) //4: Aprove a application

/*
 * Teacher routes
 * 1: POST: http://127.0.0.1/api/teacher
 * 2: PUT: http://127.0.0.1/api/teacher
 */
router.route('/api/teacher/')
  .post(api.teacher.createTeacher) //1: Create a teacher
  .put(api.teacher.updateTeacher)  //2: Update a teacher

module.exports = router;
