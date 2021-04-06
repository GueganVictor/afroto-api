const mongoose = require('mongoose');

const Notifications = mongoose.model(
  'Notifications',
  new mongoose.Schema({
    message: String,
    deadline: String,
    importance: String,
    seen: Boolean,
    user: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  }),
);

module.exports = Notifications;
