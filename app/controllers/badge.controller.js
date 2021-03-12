const db = require('../models');

const Badge = db.badge;

exports.index = (req, res) => {
  Badge.find({}, (err, badges) => {
    if (err) { res.json({ status: 'error', message: err }); }
    res.json({ status: 'success', message: 'Badges retrieved successfully', data: badges });
  });
};

exports.new = (req, res) => {
  const badge = new Badge();
  badge.name = req.body.name;
  badge.description = req.body.description;
  badge.type = req.body.type;

  badge.save((errSave) => {
    if (errSave) { res.json(errSave); }
    res.json({ message: 'New badge created!', data: badge });
  });
};

exports.view = (req, res) => {
  Badge.findById(req.params.badge_id, (err, badge) => {
    if (err) { res.send(err); }
    res.json({ message: 'Badge details loading..', data: badge });
  });
};

exports.update = (req, res) => {
  Badge.findById(req.params.badge_id, (err, badge) => {
    if (err) { res.send(err); }
    badge.name = req.body.name;
    badge.description = req.body.description;
    badge.type = req.body.type;

    badge.save((errSave) => {
      if (errSave) { res.json(errSave); }
      res.json({ message: 'Badge Info updated', data: badge });
    });
  });
};

exports.delete = (req, res) => {
  Badge.deleteOne({ _id: req.params.badge_id }, (err) => {
    if (err) { res.send(err); }
    res.json({ status: 'success', message: 'Badge deleted' });
  });
};
