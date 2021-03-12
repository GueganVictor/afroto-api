const jwt = require('jsonwebtoken');
const db = require('../models');

const User = db.user;
const Role = db.role;

const verifyToken = (req, res, next) => {
  const token = req.headers['x-access-token'];

  if (!token) {
    return res.status(403).send({ message: 'No token provided!' });
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).send({ message: 'Unauthorized! Token Expired' });
      }
      return res.status(401).send({ message: 'Unauthorized! Wrong token' });
    }
    req.userId = decoded.id;
    next();
  });
};

const isAdmin = (req, res, next) => {
  User.findById(req.userId).exec((errUser, user) => {
    if (errUser) {
      res.status(500).send({ message: errUser });
      return;
    }
    Role.find({ _id: { $in: user.roles } }, (errRole, roles) => {
      if (errRole) {
        res.status(500).send({ message: errRole });
        return;
      }
      for (let i = 0; i < roles.length; i += 1) {
        if (roles[i].name === 'admin') {
          next();
          return;
        }
      }
      res.status(403).send({ message: 'Permission denied!' });
    });
  });
};

module.exports = {
  verifyToken,
  isAdmin,
};
