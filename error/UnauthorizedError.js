const { unauthorizedStatusCode } = require('../utils/consts');

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.status = unauthorizedStatusCode;
  }
}

module.exports = UnauthorizedError;
