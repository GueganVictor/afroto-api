const { authJwt } = require('../middlewares');
const requestController = require('../controllers/request.controller');

module.exports = (app) => {
  app.use((req, res, next) => {
    res.header(
      'Access-Control-Allow-Headers',
      'x-access-token, Origin, Content-Type, Accept',
    );
    next();
  });

  app.get('/api/request', [authJwt.verifyToken], requestController.index);
  app.post('/api/request', [authJwt.verifyToken], requestController.new);

  app.post('/api/request/setRequestState', [authJwt.verifyToken], requestController.setState);

  app.get('/api/request/:request_id', [authJwt.verifyToken], requestController.view);
  app.patch('/api/request/:request_id', [authJwt.verifyToken], requestController.update);
  app.put('/api/request/:request_id', [authJwt.verifyToken], requestController.update);
  app.delete('/api/request/:request_id', [authJwt.verifyToken], requestController.delete);
};
