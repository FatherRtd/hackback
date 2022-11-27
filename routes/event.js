const router = require('express').Router();

const { celebrate, Joi } = require('celebrate');

const authMiddleware = require('../middlewares/auth');

const { urlRegExp } = require('../utils/consts');

const {
    changeStatus,
    getAllEvents,
    createEvent,
    getEventsForCompany,
    addResponsible,
    removeResponsible,
} = require('../controllers/eventController');

router.get('/events', getAllEvents);

router.post('/events', celebrate({
  body: Joi.object().keys({
    companyId: Joi.string()
    .alphanum()
    .length(24)
    .required()
    .hex(),
    name: Joi.string().required().min(2).max(30),
    description: Joi.string(),
    eventDate: Joi.date(),
    status: Joi.number().required(),
  }),
}), createEvent);

router.put('/events/:eventId/responsible', celebrate({
  params: Joi.object().keys({
    eventId: Joi
      .string()
      .alphanum()
      .length(24)
      .required()
      .hex(),
  }),
  body: Joi.object().keys({
    employeeId: Joi
    .string()
    .alphanum()
    .length(24)
    .required()
    .hex(),
  })
}), addResponsible);

router.put('/events/:eventId/status', celebrate({
    params: Joi.object().keys({
      eventId: Joi
        .string()
        .alphanum()
        .length(24)
        .required()
        .hex(),
        status: Joi
        .number(),
    }
    ),
    body: Joi.object().keys({
      status: Joi.number(),
    })
  }), changeStatus);

router.get('/events/:companyId', celebrate({
    params: Joi.object().keys({
      companyId: Joi
        .string()
        .alphanum()
        .length(24)
        .required()
        .hex(),
    }),
  }), getEventsForCompany);

router.delete('/events/:eventId/responsible', celebrate({
  params: Joi.object().keys({
    eventId: Joi
      .string()
      .alphanum()
      .length(24)
      .required()
      .hex(),
  }),
  body: Joi.object().keys({
    employeeId: Joi
    .string()
    .alphanum()
    .length(24)
    .required()
    .hex(),
  })
}), removeResponsible);

module.exports = router;
