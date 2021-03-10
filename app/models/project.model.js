const mongoose = require('mongoose')

const Project = mongoose.model(
  'Project',
  new mongoose.Schema({
    id: String,
    name: String,
    type: String,
    email: String,
    status: String,
    company: String,
    address: String,
    country: String,
    remuneration: String,
    dates: Array,
    comments: String,
    informations: String,
    pictures: String,
    photographer: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ]
  })
)

module.exports = Project
