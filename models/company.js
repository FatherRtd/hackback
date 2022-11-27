/* eslint-disable func-names */
const mongoose = require('mongoose');
const { isEmail, isURL } = require('validator');
const bcrypt = require('bcrypt');
const UnauthorizedError = require('../error/UnauthorizedError');

const companySchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    validate: { validator: (v) => isEmail(v) },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  employers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'employee',
    },
  ],
  inn: {
    type: String,
    unique: true,
    minlength: 10,
    maxlength: 12,
    required: true,
  }
}, { versionKey: false });

companySchema.statics.findCompanyByCredentials = function (inn, password) {
  return this.findOne({ inn }).select('+password')
    .orFail(new UnauthorizedError('Неверный ИНН или пароль'))
    .then((company) => bcrypt.compare(password, company.password)
      .then((matched) => {
        if (!matched) {
          return Promise.reject(new UnauthorizedError('Неверный ИНН или пароль'));
        }

        return company;
      }));
};
module.exports = mongoose.model('company', companySchema);