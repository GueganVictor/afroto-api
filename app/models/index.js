const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require('./user.model');
db.role = require('./role.model');
db.project = require('./project.model');
db.notification = require('./notification.model');
db.badge = require('./badge.model');
db.request = require('./request.model');

db.ROLES = ['user', 'admin'];

module.exports = db;
