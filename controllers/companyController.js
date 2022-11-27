const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Company = require('../models/company');

const ConflictError = require('../error/ConflictError');
const NotFoundError = require('../error/NotFoundError');
const BadRequestError = require('../error/BadRequestError');

const { okStatusCode } = require('../utils/consts');

const { JWT_SECRET = 'e5941b231be3be054dcec54b7cf2f9f7', SALT = 10 } = process.env;

function loginCompany(req, res, next) {
  const { inn, password } = req.body;
  Company.findCompanyByCredentials(inn, password)
    .then((company) => {
      const token = jwt.sign({ _id: company._id, type: "company" }, JWT_SECRET);

      res.status(okStatusCode).send({ token });
    })
    .catch(next);
}

function createCompany(req, res, next) {
  const {
    email,
    password,
    inn,
  } = req.body;
  bcrypt.hash(password, +SALT)
    .then((hash) => Company.create({
        email,
        password: hash,
        inn,
    }))
    .then((company) => {
      const { password: pw, ...companyInfo } = company.toObject();
      res.status(okStatusCode).send({ companyInfo });
    })
    .catch((e) => {
      switch (e.name) {
        case 'ValidationError':
          next(new BadRequestError('Ошибка. Некорректные данные'));
          break;
        case e.code === 11000 && 'MongoServerError':
          next(new ConflictError('Компания с таким ИНН уже зарегистрирована'));
          break;
        default:
          next(e);
          break;
      }
    });
}

function getCompanyById(req, res, next) {
  Company.findById(req.params.companyId)
    .orFail(new NotFoundError('Ошибка. Пользователь не найден'))
    .then((company) => {
      res.status(okStatusCode).send({ company });
    })
    .catch((e) => {
      if (e.name === 'CastError') {
        next(new BadRequestError('Ошибка. Некорректные данные'));
      } else {
        next(e);
      }
    });
}

function getCurrentCompany(req, res, next) {
  Company.findById(req.company._id)
    .then((company) => {
      res.status(okStatusCode).send({ company });
    })
    .catch(next);
}

module.exports = {
  loginCompany,
  createCompany,
  getCompanyById,
  getCurrentCompany,
};
