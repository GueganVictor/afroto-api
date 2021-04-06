import * as authController from '../controllers/auth';
import * as badgeController from '../controllers/badge';
import * as userController from '../controllers/user';
import * as requestController from '../controllers/request';
import * as projectController from '../controllers/project';
import * as notificationController from '../controllers/notification';

import * as signup from '../middlewares/signup';
import * as auth from '../middlewares/auth';
import { Application } from 'express';

// prettier-ignore
const routes = (app: Application) => {
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Headers', 'x-access-token, Origin, Content-Type, Accept');
        next();
    });

    const API_BASE = '/api/v1';

    // Add basic middlewares
    app.all(`${API_BASE}/*`, [auth.verifyToken]);

    // Auth Routes
    app.post(`${API_BASE}/auth/signup`,[signup.checkDuplicateUsernameOrEmail, signup.checkRolesExisted], authController.signup );
    app.post(`${API_BASE}/auth/signin`, authController.signin);

    // User routes
    app.get(`${API_BASE}/user/`, [auth.isAdmin], userController.indexUser);
    app.get(`${API_BASE}/user/:user_id`, [auth.isSameUserAsRequested], userController.viewUser);
    app.delete(`${API_BASE}/user/:user_id`,[auth.isSameUserAsRequested], userController.destroyUser );
    app.put(`${API_BASE}/user/:user_id`, [auth.isAdmin], userController.updateUser);

    app.post(`${API_BASE}/user/:user_id/equipment/:type/:equipment`,[], userController.addEquipmentToUser );
    app.delete(`${API_BASE}/user/:user_id/equipment/:type/:equipment`,[], userController.removeEquipmentFromUser );

    // Request routes
    app.get(`${API_BASE}/request`, [auth.isAdmin], requestController.indexRequest);
    app.post(`${API_BASE}/request`, [], requestController.createRequest);
    app.get(`${API_BASE}/request/:request_id`, [], requestController.viewRequest);
    app.put(`${API_BASE}/request/:request_id`, [], requestController.updateRequest);
    app.delete(`${API_BASE}/request/:request_id`, [], requestController.destroyRequest);

    app.post(`${API_BASE}/request/:request_id/state/:state`,[auth.isAdmin], requestController.setRequestState );

    // Project routes
    app.get(`${API_BASE}/project`, [auth.isAdmin], projectController.indexProject);
    app.post(`${API_BASE}/project`, [auth.isAdmin], projectController.createProject);
    app.get(`${API_BASE}/project/:project_id`, [], projectController.viewProject);
    app.put(`${API_BASE}/project/:project_id`, [], projectController.updateProject);
    app.delete(`${API_BASE}/project/:project_id`, [], projectController.destroyProject);

    app.post(`${API_BASE}/project/:project_id/user/:user_id`,[], projectController.setPhotographerToProject );
    app.get(`${API_BASE}/project/user/:user_id`,[auth.isSameUserAsRequested], projectController.indexProjectByUser );
    app.post(`${API_BASE}/project/:project_id/validation`, [], projectController.validateProject);

    // Notification routes
    app.get(`${API_BASE}/notification`, [auth.isAdmin], notificationController.indexNotification);
    app.post(`${API_BASE}/notification`, [], notificationController.createNotification);
    app.get(`${API_BASE}/notification/:notification_id`,[], notificationController.viewNotification );
    app.put(`${API_BASE}/notification/:notification_id`,[], notificationController.updateNotification );
    app.delete(`${API_BASE}/notification/:notification_id`,[], notificationController.destroyNotification );

    app.get(`${API_BASE}/notification/user/:user_id`,[], notificationController.indexNotificationByUser );

    // Badge routes
    app.get(`${API_BASE}/badge`, [], badgeController.indexBadge);
    app.post(`${API_BASE}/badge`, [], badgeController.createBadge);
    app.get(`${API_BASE}/badge/:badge_id`, [], badgeController.viewBadge);
    app.put(`${API_BASE}/badge/:badge_id`, [], badgeController.updateBadge);
    app.delete(`${API_BASE}/badge/:badge_id`, [], badgeController.destroyBadge);
};

export default routes;
