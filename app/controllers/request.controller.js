const db = require('../models')
const Request = db.request

exports.index = function (req, res) {
  Request.find({}).populate('badges').populate('photographer').exec((err, requests) => {
    if (err) { res.json({ status: 'error', message: err }) }
    res.json({ status: 'success', message: 'Requests retrieved successfully', data: requests })
  })
}

exports.new = function (req, res) {
  var request = new Request()
  request.state = req.body.state
  request.badges = req.body.badges
  request.photographer = req.body.photographer
  request.url = req.body.url
  request.description = req.body.description
  request.type = req.body.type

  request.save(function (err) {
    if (err) { res.json(err) }
    res.json({ message: 'New request created!', data: request })
  })
}

exports.view = function (req, res) {
  Request.findById(req.params.request_id, function (err, request) {
    if (err) { res.send(err) }
    res.json({ message: 'Request details loading..', data: request })
  })
}

exports.setState = function (req, res) {
  Request.findById(req.body.request_id, function (err, request) {
    if (err) { res.send(err) }
    request.state = req.body.state
    request.save(function (err) {
      if (err) { res.json(err) }
      res.json({ message: 'Request state changed', data: request })
    })
  })
}

exports.update = function (req, res) {
  Request.findById(req.params.request_id, function (err, request) {
    if (err) { res.send(err) }
    request.name = req.body.name
    request.description = req.body.description
    request.type = req.body.type

    request.save(function (err) {
      if (err) { res.json(err) }
      res.json({ message: 'Request Info updated', data: request })
    })
  })
}

exports.delete = function (req, res) {
  Request.deleteOne({ _id: req.params.request_id }, function (err, request) {
    if (err) { res.send(err) }
    res.json({ status: 'success', message: 'Request deleted' })
  })
}
