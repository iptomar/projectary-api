// AUTHORIZED ROUTES FOR OUR API
// =============================================================================
var express = require('express');
var router  = express.Router();

var ctrls = require('../controllers/index');

/*
 * Student Routes
 * 1: POST: http://127.0.0.1/api/student
 * 2: GET: http://127.0.0.1/api/student
 * 3: PUT: http://127.0.0.1/api/student
 * 4: GET: http://127.0.0.1/api/student/:id
 * 5: POST: http://127.0.0.1/api/student/:id/approve
 */

router.route('/student/')
  .post(ctrls.student.createStudent)  //1: Create a student
  //workaround for testing authorization and autentication
  .get(ctrls.student.getStudentsLst)  //2: Get students list
  .put(ctrls.student.updateStudent);  //3: Update a student

router.get('/student/:id', ctrls.student.getStudent);              //4: Get a student
router.post('/student/:id/approve', ctrls.student.approveStudent); //5: Approve a student

/*
 * Project Routes
 * 1: GET: http://127.0.0.1/api/project/:id
 * 2: PUT: http://127.0.0.1/api/project/:id
 * 3: POST: http://127.0.0.1/api/project
 * 4: GET: http://127.0.0.1/api/project
 * 5: GET: http://127.0.0.1/api/project/:id/applications
 */

router.route('/project/:id')
  .get(ctrls.project.getProject)    //1: Get a project
  .put(ctrls.project.updateProject); //2: Update a project

router.route('/project/')
  .post(ctrls.project.createProject) //3: Create a project
  .get(ctrls.project.getProjectsLst); //4: Get project list

router.get('/project/:id/applications', ctrls.project.getProjectApl); //5: Get applications list


/*
 * Application Routes
 * 1: POST: http://127.0.0.1/api/application
 * 2: GET: http://127.0.0.1/api/application
 * 3: GET: http://127.0.0.1/api/application/:id
 * 4: POST: http://127.0.0.1/api/application/:id/accept
 */

router.route('/application/')
  .post(ctrls.application.applyProject) //1: Apply for a Project
  .get(ctrls.application.getAllAplLst);  //2: Get application list

router.get('/application/:id', ctrls.application.getSpecificAplLst); //3: Get a specific application list
router.post('/application/:id/accept', ctrls.application.acceptApl); //4: Aprove a application

/*
 * Teacher routes
 * 1: POST: http://127.0.0.1/api/teacher
 * 2: PUT: http://127.0.0.1/api/teacher
 */
router.route('/teacher/')
  .post(ctrls.teacher.createTeacher) //1: Create a teacher
  .put(ctrls.teacher.updateTeacher);  //2: Update a teacher

module.exports = router;
