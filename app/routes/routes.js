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

  const API_BASE = '/api/v1';

  // Add basic middlewares
  app.all(`${API_BASE}/*`, [auth.verifyToken]);

  // Auth Routes
  app.post(`${API_BASE}/auth/signup`, [signup.checkDuplicateUsernameOrEmail, signup.checkRolesExisted], authController.signup);
  app.post(`${API_BASE}/auth/signin`, authController.signin);

  // User routes
  app.get(`${API_BASE}/user/`, [auth.isAdmin], userController.getPhotographers);
  app.get(`${API_BASE}/user/:user_id`, [auth.isSameUserAsRequested], userController.getPhotographer);
  app.delete(`${API_BASE}/user/:user_id`, [auth.isSameUserAsRequested], userController.deletePhotographer);
  app.put(`${API_BASE}/user/:user_id`, [auth.isAdmin], userController.updatePhotographer);
  app.patch(`${API_BASE}/user/:user_id`, [auth.isAdmin], userController.updatePhotographer);

  app.post(`${API_BASE}/user/:user_id/equipment/:type/:equipment`, [], userController.addEquipment);
  app.delete(`${API_BASE}/user/:user_id/equipment/:type/:equipment`, [], userController.deleteEquipment);

  // Request routes
  app.get(`${API_BASE}/request`, [auth.isAdmin], requestController.index);
  app.post(`${API_BASE}/request`, [], requestController.new);
  app.get(`${API_BASE}/request/:request_id`, [], requestController.view);
  app.patch(`${API_BASE}/request/:request_id`, [], requestController.update);
  app.put(`${API_BASE}/request/:request_id`, [], requestController.update);
  app.delete(`${API_BASE}/request/:request_id`, [], requestController.delete);

  app.post(`${API_BASE}/request/:request_id/state/:state`, [auth.isAdmin], requestController.setState);

  // Project routes
  app.get(`${API_BASE}/project`, [auth.isAdmin], projectController.index);
  app.post(`${API_BASE}/project`, [auth.isAdmin], projectController.new);
  app.get(`${API_BASE}/project/:project_id`, [], projectController.view);
  app.patch(`${API_BASE}/project/:project_id`, [], projectController.update);
  app.put(`${API_BASE}/project/:project_id`, [], projectController.update);
  app.delete(`${API_BASE}/project/:project_id`, [], projectController.delete);

  app.post(`${API_BASE}/project/:project_id/user/:user_id`, [], projectController.setPhotographer);
  app.get(`${API_BASE}/project/user/:user_id`, [auth.isSameUserAsRequested], projectController.getProjectByPhotographer);
  app.post(`${API_BASE}/project/:project_id/validation`, [], projectController.validateProject);

  // Notification routes
  app.get(`${API_BASE}/notification`, [auth.isAdmin], notificationController.index);
  app.post(`${API_BASE}/notification`, [], notificationController.new);
  app.get(`${API_BASE}/notification/:notification_id`, [], notificationController.view);
  app.patch(`${API_BASE}/notification/:notification_id`, [], notificationController.update);
  app.put(`${API_BASE}/notification/:notification_id`, [], notificationController.update);
  app.delete(`${API_BASE}/notification/:notification_id`, [], notificationController.delete);

  app.get(`${API_BASE}/notification/user/:user_id`, [], notificationController.getNotificationsByUser);

  // Badges routes
  app.get(`${API_BASE}/badge`, [], badgeController.index);
  app.post(`${API_BASE}/badge`, [], badgeController.new);
  app.get(`${API_BASE}/badge/:badge_id`, [], badgeController.view);
  app.patch(`${API_BASE}/badge/:badge_id`, [], badgeController.update);
  app.put(`${API_BASE}/badge/:badge_id`, [], badgeController.update);
  app.delete(`${API_BASE}/badge/:badge_id`, [], badgeController.delete);
};
