const db = require('../models')
const Notification = db.notification
const User = db.user
const Project = db.project

const mailer = require('../controllers/mail.controller')

exports.index = function (req, res) {
  Project.find({}, function (err, notifications) {
    if (err) { res.json({ status: 'error', message: err }) }
    res.json({ status: 'success', message: 'Projects retrieved successfully', data: notifications })
  })
}

exports.new = function (req, res) {
  var project = new Project()

  project.name = req.body.name
  project.type = req.body.type
  project.email = req.body.email
  project.company = req.body.company
  project.address = req.body.address
  project.country = req.body.country
  project.remuneration = req.body.remuneration
  project.dates = req.body.dates
  project.comments = req.body.comments
  project.informations = req.body.informations
  project.pictures = req.body.pictures

  project.save(function (err) {
    if (err) { res.json(err) }
    res.json({
      message: 'New project created!',
      data: project
    })
  })
}

exports.view = function (req, res) {
  Project.findById(req.params.project_id, function (err, project) {
    if (err) { res.send(err) }
    res.json({
      message: 'Project details loading..',
      data: project
    })
  })
}

exports.update = function (req, res) {
  Project.findById(req.params.project_id, function (err, project) {
    if (err) { res.send(err) }
    project.name = req.body.name
    project.type = req.body.type
    project.email = req.body.email
    project.company = req.body.company
    project.address = req.body.address
    project.country = req.body.country
    project.remuneration = req.body.remuneration
    project.dates = req.body.dates
    project.comments = req.body.comments
    project.informations = req.body.informations
    project.pictures = req.body.pictures

    project.save(function (err) {
      if (err) { res.json(err) }
      res.json({ message: 'Project Info updated', data: project })
    })
  })
}

exports.delete = function (req, res) {
  Project.deleteOne({ _id: req.params.project_id }, function (err, project) {
    if (err) { res.send(err) }
    res.json({ status: 'success', message: 'Project deleted' })
  })
}

exports.setPhotographer = function (req, res) {
  Project.findById(req.body.project_id, function (err, project) {
    if (err) { res.send(err) }
    project.photographer = req.body.photographer_id
    project.save(function (err) {
      if (err) { res.json(err) }
      setNotification(req.body.photographer_id)
      User.findById(req.body.photographer_id, function (err, user) {
        if (err) { res.json(err) }
        // mailer.newProjectMail(user)
      })
      res.json({ message: 'Added Photogpraher', data: project })
    })
  })
}

exports.getProjectByPhotographer = function (req, res) {
  Project.find({ photographer: { _id: req.params.project_id } }, function (err, notifications) {
    if (err) { res.json({ status: 'error', message: err }) }
    res.json({ status: 'success', message: 'Projects retrieved successfully', data: notifications })
  })
}

exports.validateProject = function (req, res) {
  Project.findById(req.params.project_id, function (err, project) {
    if (err) { res.send(err) }
    project.pictures = req.body.url
    project.status = 'Fini'
    project.save(function (err) {
      if (err) { res.json(err) }
      res.json({ message: 'Project Info updated', data: project })
    })
  })
}

// Functions

function setNotification (user) {
  var notification = new Notification()
  notification.message = 'Un projet vous a été attribué, cliquez pour le consulter'
  notification.importance = 3
  notification.seen = false
  notification.user = user
  notification.save()
}
