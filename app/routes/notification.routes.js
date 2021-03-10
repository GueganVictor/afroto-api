const { authJwt } = require('../middlewares')

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      'Access-Control-Allow-Headers',
      'x-access-token, Origin, Content-Type, Accept'
    )
    next()
  })

  var notificationController = require('../controllers/notification.controller')

  app.get('/api/notification', [authJwt.verifyToken], notificationController.index)
  app.post('/api/notification', [authJwt.verifyToken], notificationController.new)

  app.get('/api/notification/:notification_id', [authJwt.verifyToken], notificationController.view)
  app.patch('/api/notification/:notification_id', [authJwt.verifyToken], notificationController.update)
  app.put('/api/notification/:notification_id', [authJwt.verifyToken], notificationController.update)
  app.delete('/api/notification/:notification_id', [authJwt.verifyToken], notificationController.delete)

  app.get('/api/notification/getNotificationByPhotographer/:user_id', [authJwt.verifyToken], notificationController.getNotificationsByPhotographer)
}
