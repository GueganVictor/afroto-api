const db = require('../models');

const Request = db.request;

exports.index = (req, res) => {
  Request.find({}).populate('badges').populate('photographer').exec((errFind, requests) => {
    if (errFind) { res.json({ status: 'error', message: errFind }); }
    res.json({ status: 'success', message: 'Requests retrieved successfully', data: requests });
  });
};

exports.new = (req, res) => {
  const request = new Request();
  request.state = req.body.state;
  request.badges = req.body.badges;
  request.photographer = req.body.photographer;
  request.url = req.body.url;
  request.description = req.body.description;
  request.type = req.body.type;

  request.save((errFind) => {
    if (errFind) { res.json(errFind); }
    res.json({ message: 'New request created!', data: request });
  });
};

exports.view = (req, res) => {
  Request.findById(req.params.request_id, (errFind, request) => {
    if (errFind) { res.send(errFind); }
    res.json({ message: 'Request details loading..', data: request });
  });
};

exports.setState = (req, res) => {
  Request.findById(req.body.request_id, (errFind, request) => {
    if (errFind) { res.send(errFind); }
    request.state = req.body.state;
    request.save((errSave) => {
      if (errSave) { res.json(errSave); }
      res.json({ message: 'Request state changed', data: request });
    });
  });
};

exports.update = (req, res) => {
  Request.findById(req.params.request_id, (errFind, request) => {
    if (errFind) { res.send(errFind); }
    request.name = req.body.name;
    request.description = req.body.description;
    request.type = req.body.type;

    request.save((errSave) => {
      if (errSave) { res.json(errSave); }
      res.json({ message: 'Request Info updated', data: request });
    });
  });
};

exports.delete = (req, res) => {
  Request.deleteOne({ _id: req.params.request_id }, (errDelete) => {
    if (errDelete) { res.send(errDelete); }
    res.json({ status: 'success', message: 'Request deleted' });
  });
};
