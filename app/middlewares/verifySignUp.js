const db = require('../models');

const { ROLES } = db;
const User = db.user;

const checkDuplicateUsernameOrEmail = (req, res, next) => {
  User.findOne({ $or: [{ email: req.body.email }, { username: req.body.username }] })
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      if (user) {
        const mess = user.email === req.body.email ? 'Email' : 'Username';
        res.status(400).send({ message: `Failed! ${mess} is already in use!` });
        return;
      }
      next();
    });
};

const checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i += 1) {
      if (!ROLES.includes(req.body.roles[i])) {
        res.status(400).send({
          message: `Failed! Role ${req.body.roles[i]} does not exist!`,
        });
        return;
      }
    }
  }
  next();
};

module.exports = {
  checkDuplicateUsernameOrEmail,
  checkRolesExisted,
};
