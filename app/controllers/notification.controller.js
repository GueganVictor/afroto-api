const db = require('../models')
const Notification = db.notification

exports.index = function (req, res) {
  Notification.find({}, function (err, notifications) {
    if (err) { res.json({ status: 'error', message: err }) }
    res.json({ status: 'success', message: 'Notifications retrieved successfully', data: notifications })
  })
}

exports.new = function (req, res) {
  var notification = new Notification()
  notification.message = req.body.message
  notification.deadline = req.body.deadline
  notification.importance = req.body.importance
  notification.seen = req.body.seen
  notification.user = req.body.user

  notification.save(function (err) {
    if (err) { res.json(err) }
    res.json({ message: 'New notification created!', data: notification })
  })
}

exports.view = function (req, res) {
  Notification.findById(req.params.notification_id, function (err, notification) {
    if (err) { res.send(err) }
    res.json({ message: 'Notification details loading..', data: notification })
  })
}

exports.update = function (req, res) {
  Notification.findById(req.params.notification_id, function (err, notification) {
    if (err) { res.send(err) }
    notification.message = req.body.message
    notification.deadline = req.body.deadline
    notification.importance = req.body.importance
    notification.seen = req.body.seen
    notification.user = req.params.notification_id

    notification.save(function (err) {
      if (err) { res.json(err) }
      res.json({ message: 'Notification Info updated', data: notification })
    })
  })
}

exports.delete = function (req, res) {
  Notification.deleteOne({ _id: req.params.notification_id }, function (err, notification) {
    if (err) { res.send(err) }
    res.json({ status: 'success', message: 'Notification deleted' })
  })
}

exports.getNotificationsByPhotographer = function (req, res) {
  Notification.find({ user: req.params.user_id }, function (err, notifications) {
    if (err) { res.json({ status: 'error', message: err }) }
    res.json({ status: 'success', message: 'Notifications retrieved successfully', data: notifications })
  })
}
