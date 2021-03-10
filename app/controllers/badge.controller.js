const db = require('../models')
const Badge = db.badge

exports.index = function (req, res) {
  Badge.find({}, function (err, badges) {
    if (err) { res.json({ status: 'error', message: err }) }
    res.json({ status: 'success', message: 'Badges retrieved successfully', data: badges })
  })
}

exports.new = function (req, res) {
  var badge = new Badge()
  badge.name = req.body.name
  badge.description = req.body.description
  badge.type = req.body.type

  badge.save(function (err) {
    if (err) { res.json(err) }
    res.json({ message: 'New badge created!', data: badge })
  })
}

exports.view = function (req, res) {
  Badge.findById(req.params.badge_id, function (err, badge) {
    if (err) { res.send(err) }
    res.json({ message: 'Badge details loading..', data: badge })
  })
}

exports.update = function (req, res) {
  Badge.findById(req.params.badge_id, function (err, badge) {
    if (err) { res.send(err) }
    badge.name = req.body.name
    badge.description = req.body.description
    badge.type = req.body.type

    badge.save(function (err) {
      if (err) { res.json(err) }
      res.json({ message: 'Badge Info updated', data: badge })
    })
  })
}

exports.delete = function (req, res) {
  Badge.deleteOne({ _id: req.params.badge_id }, function (err, badge) {
    if (err) { res.send(err) }
    res.json({ status: 'success', message: 'Badge deleted' })
  })
}
