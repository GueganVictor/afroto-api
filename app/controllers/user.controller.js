const db = require('../models');

const Role = db.role;
const User = db.user;

exports.getPhotographers = (req, res) => {
  Role.findOne({ name: 'user' }, (errRole, role) => {
    if (errRole) { res.status(500).send({ message: errRole }); return; }
    User.find({ roles: role._id }).populate('badges').exec((errFind, photographer) => {
      if (errFind) { res.json({ status: 'error', message: errFind }); }
      res.json({ status: 'success', message: 'Photographers retrieved successfully', data: photographer });
    });
  });
};

exports.getPhotographer = (req, res) => {
  User.findOne({ _id: req.params.user_id }, (errFind, photographer) => {
    if (errFind) { res.json({ status: 'error', message: Object.assign(errFind, { infos: 'UserNotFound' }) }); return; }
    res.json({ status: 'success', message: 'Photographer retrieved successfully', data: photographer });
  });
};

exports.updatePhotographer = (req, res) => {
  User.findById(req.params.user_id, (errFind, user) => {
    if (errFind) { res.send(errFind); return; }
    user.name = req.body.name;
    user.email = req.body.email;
    user.birthdate = req.body.birthdate;
    user.phone = req.body.phone;
    user.city = req.body.city;
    user.facebook = req.body.facebook;
    user.instagram = req.body.instagram;

    user.save((errSave) => {
      if (errSave) { res.json(errSave); }
      res.json({ message: 'user Info updated', data: user });
    });
  });
};

exports.addEquipment = (req, res) => {
  User.findById(req.params.user_id, (errFind, user) => {
    if (errFind) { res.send(errFind); return; }
    if (req.params.type === 'camera') {
      user.cameras.push(req.params.equipment);
    } else {
      user.lenses.push(req.params.equipment);
    }

    user.save((errSave) => {
      if (errSave) { res.json(errSave); }
      res.json({ message: 'Equipment added', data: user });
    });
  });
};

exports.deletePhotographer = (req, res) => {
  User.deleteOne({ _id: req.params.user_id }, (errDelete) => {
    if (errDelete) { res.send(errDelete); return; }
    res.json({ status: 'success', message: 'User deleted' });
  });
};

exports.deleteEquipment = (req, res) => {
  User.findById(req.params.user_id, (errFind, user) => {
    if (errFind) { res.send(errFind); return; }
    if (req.params.type === 'camera') {
      user.cameras = user.cameras.filter((item) => item !== req.params.equipment);
    } else {
      user.lenses = user.lenses.filter((item) => item !== req.params.equipment);
    }

    user.save((errSave) => {
      if (errSave) { res.json(errSave); }
      res.json({ message: `${req.params.type} deleted`, data: user });
    });
  });
};
