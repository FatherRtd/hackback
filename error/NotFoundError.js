const { notFoundStatusCode } = require('../utils/consts');

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.status = notFoundStatusCode;
  }
}

module.exports = NotFoundError;
