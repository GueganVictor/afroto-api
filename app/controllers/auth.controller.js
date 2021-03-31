const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mailer = require('./mail.controller');
const db = require('../models');

const User = db.user;
const Role = db.role;

exports.signup = (req, res) => {
  console.log(req.body);
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    birthdate: req.body.birthdate,
    phone: req.body.phone,
    city: req.body.city,
    password: bcrypt.hashSync(req.body.password, 8),
  });

  user.save((err, userData) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (req.body.roles) {
      Role.find({ name: { $in: req.body.roles } },
        (errFind, roles) => {
          if (errFind) {
            res.status(500).send({ message: errFind });
            return;
          }

          userData.roles = roles.map((role) => role._id);
          userData.save((errSave) => {
            if (errSave) {
              res.status(500).send({ message: errSave });
              return;
            }
            mailer.welcomeMail(userData);
            res.send({ message: 'User was registered successfully!' });
          });
        });
    } else {
      Role.findOne({ name: 'user' }, (errFind, role) => {
        if (errFind) {
          res.status(500).send({ message: errFind });
          return;
        }
        user.roles = [role._id];
        user.save((errSave) => {
          if (errSave) {
            res.status(500).send({ message: errSave });
            return;
          }
          mailer.welcomeMail(user);
          res.send({ message: 'User was registered successfully!' });
        });
      });
    }
  });
};

exports.signin = (req, res) => {
  User.findOne({ $or: [{ email: req.body.username }, { username: req.body.username }] }).populate('badges').populate('-__v').populate('roles')
    .exec((err, user) => {
      if (err) {
        console.log(err);
        res.status(500).send({ message: err });
        return;
      }
      if (!user) {
        return res.status(404).send({ message: 'User Not found.' });
      }

      const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
      if (!passwordIsValid) {
        return res.status(401).send({ accessToken: null, message: 'Invalid Password!' });
      }

      const authorities = [];
      for (let i = 0; i < user.roles.length; i += 1) {
        authorities.push(`ROLE_${user.roles[i].name.toUpperCase()}`);
      }

      res.status(200).send({
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        roles: authorities,
        birthdate: user.birthdate,
        phone: user.phone,
        city: user.city,
        instagram: user.instagram,
        facebook: user.facebook,
        cameras: user.cameras,
        lenses: user.lenses,
        badges: user.badges,
        accessToken: jwt.sign({ id: user.id }, process.env.SECRET_KEY, { expiresIn: 86400 }), // 24h
      });
    });
};
