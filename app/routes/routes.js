const { signup, auth } = require('../middlewares');
const {
  authController, userController, requestController, notificationController,
  badgeController, projectController,
} = require('../controllers');

module.exports = (app) => {
  app.use((req, res, next) => {
    res.header(
      'Access-Control-Allow-Headers',
      'x-access-token, Origin, Content-Type, Accept',
    );
    next();
  });

  // Add basic middlewares
  app.all('/api/*', [auth.verifyToken]);

  // Auth Routes
  app.post('/api/auth/signup', [signup.checkDuplicateUsernameOrEmail, signup.checkRolesExisted], authController.signup);
  app.post('/api/auth/signin', authController.signin);

  // User routes
  app.get('/api/user/', [auth.isAdmin], userController.getPhotographers);
  app.get('/api/user/:user_id', [auth.isSameUserAsRequested], userController.getPhotographer);
  app.delete('/api/user/:user_id', [auth.isSameUserAsRequested], userController.deletePhotographer);
  app.put('/api/user/:user_id', [auth.isAdmin], userController.updatePhotographer);
  app.patch('/api/user/:user_id', [auth.isAdmin], userController.updatePhotographer);
  app.post('/api/user/equipement/:user_id', [auth.isAdmin], userController.addEquipement);

  app.delete('/api/user/:user_id/equipement/:type/:equipement', [], userController.deleteEquipement);

  // Request routes
  app.get('/api/request', [], requestController.index);
  app.post('/api/request', [], requestController.new);
  app.get('/api/request/:request_id', [], requestController.view);
  app.patch('/api/request/:request_id', [], requestController.update);
  app.put('/api/request/:request_id', [], requestController.update);
  app.delete('/api/request/:request_id', [], requestController.delete);

  app.post('/api/request/:request_id/state/:state', [], requestController.setState);

  // Project routes
  app.get('/api/project', [], projectController.index);
  app.post('/api/project', [], projectController.new);
  app.get('/api/project/:project_id', [], projectController.view);
  app.patch('/api/project/:project_id', [], projectController.update);
  app.put('/api/project/:project_id', [], projectController.update);
  app.delete('/api/project/:project_id', [], projectController.delete);

  app.post('/api/project/:project_id/user/:user_id', [], projectController.setPhotographer);
  app.get('/api/project/:project_id/user/:user_id', [auth.isSameUserAsRequested], projectController.getProjectByPhotographer);
  app.post('/api/project/:project_id/validation', [], projectController.validateProject);

  // Notification routes
  app.get('/api/notification', [], notificationController.index);
  app.post('/api/notification', [], notificationController.new);
  app.get('/api/notification/:notification_id', [], notificationController.view);
  app.patch('/api/notification/:notification_id', [], notificationController.update);
  app.put('/api/notification/:notification_id', [], notificationController.update);
  app.delete('/api/notification/:notification_id', [], notificationController.delete);

  app.get('/api/notification/:notification/user/:user_id', [], notificationController.getNotificationsByUser);

  // Badges routes
  app.get('/api/badge', [], badgeController.index);
  app.post('/api/badge', [], badgeController.new);
  app.get('/api/badge/:badge_id', [], badgeController.view);
  app.patch('/api/badge/:badge_id', [], badgeController.update);
  app.put('/api/badge/:badge_id', [], badgeController.update);
  app.delete('/api/badge/:badge_id', [], badgeController.delete);
};
