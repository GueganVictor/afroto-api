const db = require('../models');

const Notification = db.notification;

exports.index = (req, res) => {
  Notification.find({}, (err, notifications) => {
    if (err) { res.json({ status: 'error', message: err }); }
    res.json({ status: 'success', message: 'Notifications retrieved successfully', data: notifications });
  });
};

exports.new = (req, res) => {
  const notification = new Notification();
  notification.message = req.body.message;
  notification.deadline = req.body.deadline;
  notification.importance = req.body.importance;
  notification.seen = req.body.seen;
  notification.user = req.body.user;

  notification.save((err) => {
    if (err) { res.json(err); }
    res.json({ message: 'New notification created!', data: notification });
  });
};

exports.view = (req, res) => {
  Notification.findById(req.params.notification_id, (err, notification) => {
    if (err) { res.send(err); }
    res.json({ message: 'Notification details loading..', data: notification });
  });
};

exports.update = (req, res) => {
  Notification.findById(req.params.notification_id, (err, notification) => {
    if (err) { res.send(err); }
    notification.message = req.body.message;
    notification.deadline = req.body.deadline;
    notification.importance = req.body.importance;
    notification.seen = req.body.seen;
    notification.user = req.params.notification_id;

    notification.save((errSave) => {
      if (errSave) { res.json(errSave); }
      res.json({ message: 'Notification Info updated', data: notification });
    });
  });
};

exports.delete = (req, res) => {
  Notification.deleteOne({ _id: req.params.notification_id }, (err) => {
    if (err) { res.send(err); }
    res.json({ status: 'success', message: 'Notification deleted' });
  });
};

exports.getNotificationsByPhotographer = (req, res) => {
  Notification.find({ user: req.params.user_id }, (err, notifications) => {
    if (err) { res.json({ status: 'error', message: err }); }
    res.json({ status: 'success', message: 'Notifications retrieved successfully', data: notifications });
  });
};
