var User = require('../models/user.model')

exports.allAccess = (req, res) => { res.status(200).send('Public Content.') }
exports.userBoard = (req, res) => { res.status(200).send('User Content.') }
exports.adminBoard = (req, res) => { res.status(200).send('Admin Content.') }

exports.getPhotographers = function (req, res) {
  User.find({ roles: '603d1dc49f4c03022333c728' }).populate('badges').exec(function (err, notifications) {
    if (err) { res.json({ status: 'error', message: err }) }
    res.json({ status: 'success', message: 'Photographers retrieved successfully', data: notifications })
  })
}

exports.getPhotographer = function (req, res) {
  User.find({ _id: req.params.photographer_id }, function (err, notifications) {
    if (err) { res.json({ status: 'error', message: err }) }
    res.json({ status: 'success', message: 'Photographer retrieved successfully', data: notifications })
  })
}

exports.updatePhotographer = function (req, res) {
  User.findById(req.params.photographer_id, function (err, user) {
    if (err) { res.send(err) }
    user.name = req.body.name
    user.email = req.body.email
    user.birthdate = req.body.birthdate
    user.phone = req.body.phone
    user.city = req.body.city
    user.facebook = req.body.facebook
    user.instagram = req.body.instagram

    user.save(function (err) {
      if (err) { res.json(err) }
      res.json({ message: 'user Info updated', data: user })
    })
  })
}

exports.addEquipement = function (req, res) {
  User.findById(req.params.photographer_id, function (err, user) {
    if (err) { res.send(err) }
    console.log(req.body.type)
    if (req.body.type === 'camera') {
      user.cameras.push(req.body.equipement)
    } else {
      user.lenses.push(req.body.equipement)
    }

    user.save(function (err) {
      if (err) { res.json(err) }
      res.json({ message: 'Equipement added', data: user })
    })
  })
}

exports.deletePhotographer = function (req, res) {
  User.deleteOne({ _id: req.params.photographer_id }, function (err, notification) {
    if (err) { res.send(err) }
    res.json({ status: 'success', message: 'User deleted' })
  })
}

exports.deleteEquipement = function (req, res) {
  User.findById(req.params.photographer_id, function (err, user) {
    if (err) { res.send(err) }
    if (req.params.type === 'camera') {
      user.cameras = user.cameras.filter(item => item !== req.params.equipement)
    } else {
      user.lenses = user.lenses.filter(item => item !== req.params.equipement)
    }

    user.save(function (err) {
      if (err) { res.json(err) }
      res.json({ message: req.params.type + ' deleted', data: user })
    })
  })
}
