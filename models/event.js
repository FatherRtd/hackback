const mongoose = require('mongoose');

const { isURL } = require('validator');

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  description: {
    type: String,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'company',
    required: true,
  },
  responsible: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'employee'
  }],
  eventDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: Number,
  }
}, { versionKey: false });

module.exports = mongoose.model('event', eventSchema);
