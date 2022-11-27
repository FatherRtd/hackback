/* eslint-disable func-names */
const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  fullName: {
    type: String,
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
}, { versionKey: false });

module.exports = mongoose.model('employee', employeeSchema);