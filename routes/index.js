const router = require('express').Router();

const { celebrate, Joi } = require('celebrate');

const { login, createUser } = require('../controllers/users');
const { loginCompany, createCompany} = require('../controllers/companyController');

const userRoutes = require('./users');
const companyRoutes = require('./company');
const eventRoutes = require('./event');
const employeeRoutes = require('./employee');

const { urlRegExp } = require('../utils/consts');

const NotFoundError = require('../error/NotFoundError');
router.post('/users/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

router.post('/users/signup', celebrate({
  body: Joi.object().keys({
    firstName: Joi.string().min(2).max(30),
    lastName: Joi.string().min(2).max(30),
    patrName: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }).unknown(true),
}), createUser);

router.post('/company/signin', celebrate({
  body: Joi.object().keys({
    inn: Joi.string().required().min(10).max(12),
    password: Joi.string().required(),
  }),
}), loginCompany);

router.post('/company/signup', celebrate({
  body: Joi.object().keys({
    firstName: Joi.string().min(2).max(30),
    lastName: Joi.string().min(2).max(30),
    patrName: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    inn: Joi.string().min(10).max(12).required(),
  }).unknown(true),
}), createCompany);

router.use('/', userRoutes);

router.use('/', companyRoutes);

router.use('/', eventRoutes);

router.use('/', employeeRoutes);

router.use(() => {
  throw new NotFoundError('404 Not Found');
});

module.exports = router;
