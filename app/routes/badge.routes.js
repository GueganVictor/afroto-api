const { authJwt } = require('../middlewares');
const badgeController = require('../controllers/badge.controller');

module.exports = (app) => {
  app.use((req, res, next) => {
    res.header(
      'Access-Control-Allow-Headers',
      'x-access-token, Origin, Content-Type, Accept',
    );
    next();
  });

  app.get('/api/badge', [authJwt.verifyToken], badgeController.index);
  app.post('/api/badge', [authJwt.verifyToken], badgeController.new);

  app.get('/api/badge/:badge_id', [authJwt.verifyToken], badgeController.view);
  app.patch('/api/badge/:badge_id', [authJwt.verifyToken], badgeController.update);
  app.put('/api/badge/:badge_id', [authJwt.verifyToken], badgeController.update);
  app.delete('/api/badge/:badge_id', [authJwt.verifyToken], badgeController.delete);
};
