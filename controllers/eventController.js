const Event = require('../models/event');

const { okStatusCode } = require('../utils/consts');

const NotFoundError = require('../error/NotFoundError');
const ForbiddenError = require('../error/ForbiddenError');
const BadRequestError = require('../error/BadRequestError');

function createEvent(req, res, next) {
  const { name, description, eventDate, status, companyId } = req.body;

  Event.create({
    name,
    description, 
    eventDate, 
    status,
    owner: companyId,
  })
    .then((event) => res.status(okStatusCode).send({ event }))
    .catch((e) => {
      if (e.name === 'ValidationError') {
        next(new BadRequestError('Ошибка. Некорректные данные'));
      } else {
        next(e);
      }
    });
}

function getAllEvents(req, res, next) {
  Card.find({})
    .populate('responsible')
    .then((events) => res.status(okStatusCode).send({ events }))
    .catch(next);
}

function changeStatus(req, res, next) {
  Event.findByIdAndUpdate(
    req.params.eventId,
    { status: req.body.status},
    { new: true },
  )
    .orFail(new NotFoundError('Ошибка. Событие не найдено'))
    .then((event) => res.status(okStatusCode).send({ event }))
    .catch((e) => {
      if (e.name === 'CastError') {
        next(new BadRequestError('Ошибка. Некорректные данные'));
      } else {
        next(e);
      }
    });
}

function getEventsForCompany(req, res, next) {
    Event.find({ company: req.params.companyId})
      .then((events) => res.status(okStatusCode).send({ events }))
      .catch(next);
}

function addResponsible(req, res, next) {
    Event.findByIdAndUpdate(
      req.params.eventId,
      { $addToSet: { responsible: req.body.employeeId } },
      { new: true },
    )
      .orFail(new NotFoundError('Ошибка. Событие не найдено'))
      .populate('responsible')
      .then((event) => res.status(okStatusCode).send({ event }))
      .catch((e) => {
        if (e.name === 'CastError') {
          next(new BadRequestError('Ошибка. Некорректные данные'));
        } else {
          next(e);
        }
      });
}

function removeResponsible(req, res, next) {
    Event.findByIdAndUpdate(
      req.params.eventId,
      { $pull: { responsible: req.body.employeeId } },
      { new: true },
    )
      .orFail(new NotFoundError('Ошибка. Событие не найдено'))
      .populate('responsible')
      .then((card) => res.status(okStatusCode).send({ card }))
      .catch((e) => {
        if (e.name === 'CastError') {
          next(new BadRequestError('Ошибка. Некорректные данные'));
        } else {
          next(e);
        }
      });
  }

module.exports = {
    changeStatus,
    getAllEvents,
    createEvent,
    getEventsForCompany,
    addResponsible,
    removeResponsible
};
