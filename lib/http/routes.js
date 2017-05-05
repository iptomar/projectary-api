var routes = require('../routes/index'),
  auth = require('./auth');

module.exports = function(app) {
  app.post('/user', routes.user.create);
  app.get('/user', auth, routes.user.list);
  app.put('/user', auth, routes.user.update);
  app.get('/user/:id', auth, routes.user.info);
  app.post('/user/:id/approve', auth, routes.user.approve);
  
  app.post('/project', auth, routes.project.create);
  app.get('/project', auth, routes.project.list);
  app.get('/project/:id', auth, routes.project.info);
  app.get('/project/:id/applications', auth, routes.project.applinfo);

  app.post('/group/create', auth, routes.group.create);
  app.post('/group/join', auth, routes.group.join);

  app.get('/application', auth, routes.application.list);
  app.post('/application', auth, routes.application.create);
  app.get('/application/:id', auth, routes.application.info);
  app.post('/application/:id/accept', auth, routes.application.accept);

  app.post('/login', auth, routes.user.login);
};
