const { authJwt } = require('../middlewares');
const projectController = require('../controllers/project.controller');

module.exports = (app) => {
  app.use((req, res, next) => {
    res.header(
      'Access-Control-Allow-Headers',
      'x-access-token, Origin, Content-Type, Accept',
    );
    next();
  });

  app.get('/api/project', [authJwt.verifyToken], projectController.index);
  app.post('/api/project', [authJwt.verifyToken], projectController.new);

  app.get('/api/project/:project_id', [authJwt.verifyToken], projectController.view);
  app.patch('/api/project/:project_id', [authJwt.verifyToken], projectController.update);
  app.put('/api/project/:project_id', [authJwt.verifyToken], projectController.update);
  app.delete('/api/project/:project_id', [authJwt.verifyToken], projectController.delete);

  app.post('/api/project/setPhotographer', [authJwt.verifyToken], projectController.setPhotographer);
  app.get('/api/project/getProjectByPhotographer/:project_id', [authJwt.verifyToken], projectController.getProjectByPhotographer);

  app.post('/api/project/validateProject/:project_id', [authJwt.verifyToken], projectController.validateProject);
};
