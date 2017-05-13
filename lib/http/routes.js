var routes = require('../routes/index'),
  auth = require('./auth');

module.exports = function(app) {

  app.get('/user', auth, routes.user.list);
  app.put('/user', auth, routes.user.update);
  app.get('/user/:id', auth, routes.user.info);
  app.post('/user/:id/approve', auth, routes.user.approve);
  app.post('/user', routes.user.createStudent);
  app.post('/teacher', auth, routes.user.createTeacher);

  app.post('/attribute', auth, routes.attribute.create);
  app.get('/attribute',auth, routes.attribute.list);

  app.post('/project', auth, routes.project.create);
  app.get('/project', auth, routes.project.list);
  app.get('/project/:id', auth, routes.project.info);
  app.put('/project/:id', auth, routes.project.update);
  app.get('/project/:id/applications', auth, routes.project.applinfo);

  app.post('/group/create', auth, routes.group.create);
  app.post('/group/join', auth, routes.group.join);
  app.delete('/group/:id', auth, routes.group.remove);
  app.get('/group', auth, routes.group.list);
  app.get('/group/:id', auth, routes.group.info);
  app.put('/group/:id', auth, routes.group.update);

  app.get('/application', auth, routes.application.list);
  app.post('/application', auth, routes.application.create);
  app.get('/application/:id', auth, routes.application.info);
  app.post('/application/:id/accept', auth, routes.application.accept);

  app.get('/school', routes.school.list);
  app.get('/course/:id', routes.school.getCourse);

  app.post('/login', auth, routes.user.login);
};
