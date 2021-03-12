const { authJwt } = require('../middlewares');
const notificationController = require('../controllers/notification.controller');

module.exports = (app) => {
  app.use((req, res, next) => {
    res.header(
      'Access-Control-Allow-Headers',
      'x-access-token, Origin, Content-Type, Accept',
    );
    next();
  });

  app.get('/api/notification', [authJwt.verifyToken], notificationController.index);
  app.post('/api/notification', [authJwt.verifyToken], notificationController.new);

  app.get('/api/notification/:notification_id', [authJwt.verifyToken], notificationController.view);
  app.patch('/api/notification/:notification_id', [authJwt.verifyToken], notificationController.update);
  app.put('/api/notification/:notification_id', [authJwt.verifyToken], notificationController.update);
  app.delete('/api/notification/:notification_id', [authJwt.verifyToken], notificationController.delete);

  app.get('/api/notification/getNotificationByPhotographer/:user_id', [authJwt.verifyToken], notificationController.getNotificationsByPhotographer);
};
