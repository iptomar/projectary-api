var routes = require('../routes/index'),
  auth = require('./auth');

module.exports = function(app) {
  app.post('/user', routes.user.create);
  app.get('/user', auth, routes.user.list);
  app.get('/user/:id', auth, routes.user.info);

  app.post('/project', auth, routes.project.create);
  app.get('/project', auth, routes.project.list);
  app.get('/project/:id', auth, routes.project.info);
};
