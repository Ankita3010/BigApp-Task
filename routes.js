var Controller = require('./controller.js');
const authenticate = require('./authenticate');

module.exports = function (app) {
  app.post('/login', Controller.login);
  app.post('/register', Controller.register);

  app.get('/users', authenticate.admin, Controller.getUsers);
  app.delete('/users/:id', authenticate.admin, Controller.deleteUser);
  app.post('/balanced', authenticate.user, Controller.checkBalanced);
}
