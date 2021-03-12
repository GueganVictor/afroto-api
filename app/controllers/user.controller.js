const User = require('../models/user.model');

exports.getPhotographers = (req, res) => {
  User.find({ roles: '603d1dc49f4c03022333c728' }).populate('badges').exec((errFind, notifications) => {
    if (errFind) { res.json({ status: 'error', message: errFind }); }
    res.json({ status: 'success', message: 'Photographers retrieved successfully', data: notifications });
  });
};

exports.getPhotographer = (req, res) => {
  User.find({ _id: req.params.photographer_id }, (errFind, notifications) => {
    if (errFind) { res.json({ status: 'error', message: errFind }); }
    res.json({ status: 'success', message: 'Photographer retrieved successfully', data: notifications });
  });
};

exports.updatePhotographer = (req, res) => {
  User.findById(req.params.photographer_id, (errFind, user) => {
    if (errFind) { res.send(errFind); }
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

exports.addEquipement = (req, res) => {
  User.findById(req.params.photographer_id, (errFind, user) => {
    if (errFind) { res.send(errFind); }
    console.log(req.body.type);
    if (req.body.type === 'camera') {
      user.cameras.push(req.body.equipement);
    } else {
      user.lenses.push(req.body.equipement);
    }

    user.save((errSave) => {
      if (errSave) { res.json(errSave); }
      res.json({ message: 'Equipement added', data: user });
    });
  });
};

exports.deletePhotographer = (req, res) => {
  User.deleteOne({ _id: req.params.photographer_id }, (errDelete) => {
    if (errDelete) { res.send(errDelete); }
    res.json({ status: 'success', message: 'User deleted' });
  });
};

exports.deleteEquipement = (req, res) => {
  User.findById(req.params.photographer_id, (errFind, user) => {
    if (errFind) { res.send(errFind); }
    if (req.params.type === 'camera') {
      user.cameras = user.cameras.filter((item) => item !== req.params.equipement);
    } else {
      user.lenses = user.lenses.filter((item) => item !== req.params.equipement);
    }

    user.save((errSave) => {
      if (errSave) { res.json(errSave); }
      res.json({ message: `${req.params.type} deleted`, data: user });
    });
  });
};
