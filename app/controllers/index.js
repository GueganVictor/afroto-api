const userController = require('./user.controller');
const requestController = require('./request.controller');
const authController = require('./auth.controller');
const projectController = require('./project.controller');
const notificationController = require('./notification.controller');
const badgeController = require('./badge.controller');

module.exports = {
  userController,
  requestController,
  authController,
  projectController,
  notificationController,
  badgeController,
};
