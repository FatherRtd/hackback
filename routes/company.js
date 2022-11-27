const router = require('express').Router();

const { celebrate, Joi } = require('celebrate');

const authMiddleware = require('../middlewares/auth');

const { urlRegExp } = require('../utils/consts');

const {
  getCompanyById,
  getCurrentCompany,
} = require('../controllers/companyController');

router.use('/company', authMiddleware);

router.get('/company/me', getCurrentCompany);

router.get('/company/:companyId', celebrate({
  params: Joi.object().keys({
    userId: Joi
      .string()
      .alphanum()
      .required()
      .hex()
      .length(24),
  }),
}), getCompanyById);

module.exports = router;