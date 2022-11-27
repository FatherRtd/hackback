const router = require('express').Router();

const { celebrate, Joi } = require('celebrate');

const authMiddleware = require('../middlewares/auth');

const { urlRegExp } = require('../utils/consts');

const {
  getAllUsers,
  getUserById,
  getCurrentUser,
} = require('../controllers/users');

router.use('/users', authMiddleware);

router.get('/users', getAllUsers);

router.get('/users/me', getCurrentUser);

router.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi
      .string()
      .alphanum()
      .required()
      .hex()
      .length(24),
  }),
}), getUserById);

module.exports = router;
