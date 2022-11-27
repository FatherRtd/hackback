const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const ConflictError = require('../error/ConflictError');
const NotFoundError = require('../error/NotFoundError');
const BadRequestError = require('../error/BadRequestError');

const { okStatusCode } = require('../utils/consts');

const { JWT_SECRET = 'e5941b231be3be054dcec54b7cf2f9f7', SALT = 10 } = process.env;

function login(req, res, next) {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id, type: "user" }, JWT_SECRET);

      res.status(okStatusCode).send({ token });
    })
    .catch(next);
}
function createUser(req, res, next) {
  const {
    firstName,
    lastName,
    patrName,
    email,
    password,
    isAdmin,
  } = req.body;
  bcrypt.hash(password, +SALT)
    .then((hash) => User.create({
      firstName,
      lastName,
      patrName,
      email,
      password: hash,
      isAdmin,
    }))
    .then((user) => {
      const { password: pw, ...userInfo } = user.toObject();
      res.status(okStatusCode).send({ userInfo });
    })
    .catch((e) => {
      switch (e.name) {
        case 'ValidationError':
          next(new BadRequestError('Ошибка. Некорректные данные'));
          break;
        case e.code === 11000 && 'MongoServerError':
          next(new ConflictError('Пользователь с таким email уже зарегистрирован'));
          break;
        default:
          next(e);
          break;
      }
    });
}

function getAllUsers(req, res, next) {
  User.find({})
    .then((users) => res.send({ users }))
    .catch(next);
}

function getUserById(req, res, next) {
  User.findById(req.params.userId)
    .orFail(new NotFoundError('Ошибка. Пользователь не найден'))
    .then((user) => {
      res.status(okStatusCode).send({ user });
    })
    .catch((e) => {
      if (e.name === 'CastError') {
        next(new BadRequestError('Ошибка. Некорректный id пользователя'));
      } else {
        next(e);
      }
    });
}
function getCurrentUser(req, res, next) {
  User.findById(req.user._id)
    .then((user) => {
      res.status(okStatusCode).send({ user });
    })
    .catch(next);
}

module.exports = {
  login,
  createUser,
  getAllUsers,
  getUserById,
  getCurrentUser,
};
