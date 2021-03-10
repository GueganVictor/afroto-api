const mongoose = require('mongoose')

const Badge = mongoose.model(
  'Badge',
  new mongoose.Schema({
    name: String,
    type: String,
    description: String
  })
)

module.exports = Badge
