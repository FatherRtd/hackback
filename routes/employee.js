const router = require('express').Router();

const { celebrate, Joi } = require('celebrate');

const authMiddleware = require('../middlewares/auth');

const { urlRegExp } = require('../utils/consts');

const {
    createEmployee,
} = require('../controllers/employeeController');


router.post('/employee', celebrate({
    body: Joi.object().keys({
    fullName: Joi.string().required().min(2).max(30), 
    email: Joi.string().required().min(2).max(30), 
    phone: Joi.string().required().min(2).max(30)
    }),
  }), createEmployee);

module.exports = router;