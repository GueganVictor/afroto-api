const mongoose = require('mongoose');

const User = mongoose.model(
  'User',
  new mongoose.Schema({
    username: String,
    name: String,
    email: String,
    phone: String,
    city: String,
    birthdate: Date,
    password: String,
    lenses: Array,
    cameras: Array,
    facebook: String,
    instagram: String,
    about: String,
    badges: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Badge',
      },
    ],
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role',
      },
    ],
  }),
);

module.exports = User;
