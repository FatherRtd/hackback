const Employee = require('../models/employee');

const { okStatusCode } = require('../utils/consts');

const NotFoundError = require('../error/NotFoundError');
const ForbiddenError = require('../error/ForbiddenError');
const BadRequestError = require('../error/BadRequestError');

function createEmployee(req, res, next) {
  const { fullName, email, phone } = req.body;

  Employee.create({
    fullName, email, phone,
  })
    .then((employee) => res.status(okStatusCode).send({ employee }))
    .catch((e) => {
      if (e.name === 'ValidationError') {
        next(new BadRequestError('Ошибка. Некорректные данные'));
      } else {
        next(e);
      }
    });
}

module.exports = {
  createEmployee
};
