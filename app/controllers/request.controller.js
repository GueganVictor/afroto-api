const db = require('../models');

const Request = db.request;

exports.index = (req, res) => {
  Request.find({}).populate('badges').populate('photographer').exec((errFind, requests) => {
    if (errFind) { res.json({ status: 'error', message: errFind }); return; }
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
    if (errFind) { res.json(errFind); return; }
    res.json({ message: 'New request created!', data: request });
  });
};

exports.view = (req, res) => {
  Request.findById(req.params.request_id, (errFind, request) => {
    if (errFind) { res.send(errFind); return; }
    res.json({ message: 'Request details loading..', data: request });
  });
};

exports.update = (req, res) => {
  Request.findById(req.params.request_id, (errFind, request) => {
    if (errFind) { res.send(errFind); return; }
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

exports.setState = (req, res) => {
  Request.findById(req.params.request_id, (errFind, request) => {
    if (errFind) { res.send(errFind); return; }
    request.state = req.params.state;
    request.save((errSave) => {
      if (errSave) { res.json(errSave); }
      res.json({ message: 'Request state changed', data: request });
    });
  });
};
