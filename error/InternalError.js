const { internalStatusCode } = require('../utils/consts');

class InternalError extends Error {
  constructor(message) {
    super(message);
    this.status = internalStatusCode;
  }
}

module.exports = InternalError;
