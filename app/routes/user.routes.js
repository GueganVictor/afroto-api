const { authJwt } = require('../middlewares')
const controller = require('../controllers/user.controller')

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      'Access-Control-Allow-Headers',
      'x-access-token, Origin, Content-Type, Accept'
    )
    next()
  })

  app.get('/api/photographer/', [authJwt.verifyToken], controller.getPhotographers)

  app.get('/api/photographer/:photographer_id', [authJwt.verifyToken], controller.getPhotographer)
  app.delete('/api/photographer/:photographer_id', [authJwt.verifyToken], controller.deletePhotographer)
  app.put('/api/photographer/:photographer_id', [authJwt.verifyToken], controller.updatePhotographer)

  app.post('/api/photographer/equipement/:photographer_id', [authJwt.verifyToken], controller.addEquipement)
  app.delete('/api/photographer/equipement/:photographer_id/:type/:equipement', [authJwt.verifyToken], controller.deleteEquipement)

  app.get('/api/api/test/admin', [authJwt.verifyToken, authJwt.isAdmin], controller.adminBoard)
}
