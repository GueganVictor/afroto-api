const db = require('../models');

const Notification = db.notification;
const User = db.user;
const Project = db.project;

const mailer = require('./mail.controller');

exports.index = (req, res) => {
  Project.find({}, (errFind, notifications) => {
    if (errFind) { res.json({ status: 'error', message: errFind }); }
    res.json({ status: 'success', message: 'Projects retrieved successfully', data: notifications });
  });
};

exports.new = (req, res) => {
  const project = new Project();

  project.name = req.body.name;
  project.type = req.body.type;
  project.email = req.body.email;
  project.company = req.body.company;
  project.address = req.body.address;
  project.country = req.body.country;
  project.remuneration = req.body.remuneration;
  project.dates = req.body.dates;
  project.comments = req.body.comments;
  project.informations = req.body.informations;
  project.pictures = req.body.pictures;

  project.save((errSave) => {
    if (errSave) { res.json(errSave); }
    res.json({
      message: 'New project created!',
      data: project,
    });
  });
};

exports.view = (req, res) => {
  Project.findById(req.params.project_id, (errFind, project) => {
    if (errFind) { res.send(errFind); }
    res.json({
      message: 'Project details loading..',
      data: project,
    });
  });
};

exports.update = (req, res) => {
  Project.findById(req.params.project_id, (errFind, project) => {
    if (errFind) { res.send(errFind); }
    project.name = req.body.name;
    project.type = req.body.type;
    project.email = req.body.email;
    project.company = req.body.company;
    project.address = req.body.address;
    project.country = req.body.country;
    project.remuneration = req.body.remuneration;
    project.dates = req.body.dates;
    project.comments = req.body.comments;
    project.informations = req.body.informations;
    project.pictures = req.body.pictures;

    project.save((errSave) => {
      if (errSave) { res.json(errSave); }
      res.json({ message: 'Project Info updated', data: project });
    });
  });
};

exports.delete = (req, res) => {
  Project.deleteOne({ _id: req.params.project_id }, (errDelete) => {
    if (errDelete) { res.send(errDelete); }
    res.json({ status: 'success', message: 'Project deleted' });
  });
};

exports.setPhotographer = (req, res) => {
  Project.findById(req.params.project_id, (errFind, project) => {
    if (errFind) { res.send(errFind); }
    project.photographer = req.params.user_id;
    project.save((errSave) => {
      if (errSave) { res.json(errSave); }
      setNotification(req.params.user_id);
      User.findById(req.params.user_id, (errFindUser, user) => {
        if (errFindUser) { res.json(errFindUser); }
        mailer.newProjectMail(user);
      });
      res.json({ message: 'Added Photographer', data: project });
    });
  });
};

exports.getProjectByPhotographer = (req, res) => {
  Project.find({ photographer: { _id: req.params.user_id } }, (errFind, notifications) => {
    if (errFind) { res.json({ status: 'error', message: errFind }); }
    res.json({ status: 'success', message: 'Projects retrieved successfully', data: notifications });
  });
};

exports.validateProject = (req, res) => {
  Project.findById(req.params.project_id, (errFind, project) => {
    if (errFind) { res.send(errFind); }
    if (project.status === 'Fini') { res.json({ status: 'error', message: 'Project was already closed' }); }
    project.pictures = req.body.url;
    project.status = 'Fini';
    project.save((errSave) => {
      if (errSave) { res.json(errSave); }
      res.json({ message: 'Project Info updated', data: project });
    });
  });
};

// Functions
function setNotification(user) {
  const notification = new Notification();
  notification.message = 'Un projet vous a été attribué, cliquez pour le consulter';
  notification.importance = 3;
  notification.seen = false;
  notification.user = user;
  notification.save();
}
