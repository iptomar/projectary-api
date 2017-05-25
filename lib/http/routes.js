var routes = require('../routes/index'),
  auth = require('./auth');

module.exports = function(app) {

  app.route('/user')
    .get(auth, routes.user.list)
    .put(auth, routes.user.update)
    .post(routes.user.createStudent);

  app.route('/attribute')
    .post(auth, routes.attribute.create)
    .get(auth, routes.attribute.list);

  app.route('/project')
    .post(auth, routes.project.create)
    .get(auth, routes.project.list);

  app.route('/project/:id')
    .get(auth, routes.project.info)
    .put(auth, routes.project.update);

  app.route('/group/:id')
    .get(auth, routes.group.info)
    .put(auth, routes.group.update)
    .delete(auth, routes.group.remove);

  app.route('/application')
    .get( auth, routes.project.toApprove)
    .post(routes.application.create);

  app.get('/user/pending', auth, routes.user.pending);
  app.get('/user/:id', auth, routes.user.info);
  app.post('/user/:id/approve', auth, routes.user.approve);
  app.post('/teacher', auth, routes.user.createTeacher);
  app.put('/user/chpassword', auth, routes.user.chPassword);
  app.put('/user/:id/swlock', auth, routes.user.swLock);

  app.get('/project/:id/applications', auth, routes.project.applInfo);

  app.get('/group', auth, routes.group.list);
  app.post('/group/create', auth, routes.group.create);
  app.post('/group/join', auth, routes.group.join);

  app.get('/application/:id', auth, routes.application.info);
  app.get('/application/nassigned/:state', auth, routes.application.nAssigned);
  app.post('/application/accept', auth, routes.application.accept);

  app.get('/school', routes.school.list);
  app.get('/course/:id', routes.school.getCourse);

  app.post('/login', auth, routes.user.login);

  app.all('*', function(req, res) {
    res.status(404).json({ 'result': 'nok', 'message': 'Route could not be found' });
  });
};
