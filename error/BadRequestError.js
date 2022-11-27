const { badRequestStatusCode } = require('../utils/consts');

class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.status = badRequestStatusCode;
  }
}

module.exports = BadRequestError;
