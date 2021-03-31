const jwt = require('jsonwebtoken');
const db = require('../models');

const User = db.user;
const Role = db.role;

const verifyToken = (req, res, next) => {
  const token = req.headers['x-access-token'];
  const nonSecurePaths = ['/api/v1/auth/login', '/api/v1/auth/signin', '/api/v1/auth/signup'];
  console.log(req.path);
  if (nonSecurePaths.includes(req.path)) return next();
  if (!token) return res.status(403).send({ message: 'No token provided!' });

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') return res.status(401).send({ message: 'Unauthorized! Token Expired' });
      return res.status(401).send({ message: 'Unauthorized! Wrong token' });
    }
    req.userId = decoded.id;
    next();
  });
};

const isAdmin = async (req, res, next) => {
  const user = await User.findById(req.userId, (errUser, userData) => {
    if (errUser) { res.status(500).send({ message: errUser }); return 'NotFound'; }
    return userData;
  });
  const userRoles = await Role.find({ _id: { $in: user.roles } });
  const adminBool = userRoles.findIndex((r) => r.name === 'admin') > -1 ? 'IsAdmin' : 'IsNotAdmin';
  switch (adminBool) {
    case 'NotFound':
      return false;
    case 'IsAdmin':
      next(); return true;
    default:
      res.status(403).send({ message: 'Permission denied! You don\'t have admin rights' });
      return false;
  }
};

// check if the user who issued the request is the same as the requested user
const isSameUserAsRequested = async (req, res, next) => {
  const decodedId = await jwt.verify(req.headers['x-access-token'], process.env.SECRET_KEY).id;
  if (isAdmin) return;
  if (decodedId === req.params.user_id) {
    next();
  } else {
    res.status(403).send({ message: 'Permission denied! You can\'t access a ressource that doesn\'t belong to you' });
  }
};

module.exports = {
  verifyToken,
  isAdmin,
  isSameUserAsRequested,
};
