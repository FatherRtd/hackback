/* eslint no-unused-vars: 0 */

const { internalStatusCode } = require('../utils/consts');

module.exports = (error, req, res, next) => res
  .status(error.status || internalStatusCode)
  .send({ message: error.status ? error.message : 'Ошибка на сервере' });
