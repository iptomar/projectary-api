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
    .get(routes.project.list);

  app.route('/project/:id')
    .get(auth, routes.project.info)
    .put(auth, routes.project.update);

  app.route('/group/:id')
    .get(auth, routes.group.info)
    .put(auth, routes.group.update)
    .delete(auth, routes.group.remove);

  app.route('/application')
    .get(auth, routes.project.toApprove)
    .post(auth, routes.application.create);

  app.get('/user/pending', auth, routes.user.pending);
  app.get('/user/:id', auth, routes.user.info);

  app.post('/photo', auth, routes.user.sendPhoto);
  app.get('/photo/:id', routes.user.getPhoto);

  app.get('/user/:user/recover/:token', routes.user.recoverUserToken);
  app.post('/user/:user/recover', routes.user.recoverUser);

  app.post('/user/:id/approve', auth, routes.user.approve);
  app.post('/teacher', auth, routes.user.createTeacher);
  app.put('/user/chpassword', auth, routes.user.chPassword);
  app.put('/user/:id/swlock', auth, routes.user.swLock);

  app.get('/project/:id/applications', auth, routes.project.applInfo);
  app.get('/project/finished/:groupid', auth, routes.project.isFinished);
  app.post('/project/finished/:studentid', auth, routes.project.attrGrade);

  app.post('/project/force/finish/:id',auth, routes.project.forceFinish);

  app.get('/group', auth, routes.group.list);
  app.post('/group/create', auth, routes.group.create);
  app.post('/group/join', auth, routes.group.join);

  app.get('/application/:id', auth, routes.application.info);
  app.get('/application/user/:id', auth, routes.application.userInfo);
  app.get('/application/nassigned/:state', auth, routes.application.nAssigned);
  app.post('/application/accept', auth, routes.application.accept);

  app.get('/school', routes.school.list);
  app.get('/course/:id', routes.school.getCourse);

  app.post('/login', auth, routes.user.login);

  app.all('*', function(req, res) {
    res.status(404).json({ 'result': 'nok', 'message': 'Route could not be found' });
  });
};
