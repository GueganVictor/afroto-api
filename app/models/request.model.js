const mongoose = require('mongoose')

const Request = mongoose.model(
  'Request',
  new mongoose.Schema({
    type: String,
    url: String,
    description: String,
    state: String,
    badges: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Badge'
      }
    ],
    photographer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  })
)

module.exports = Request
