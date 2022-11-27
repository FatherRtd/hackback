const { conflictStatusCode } = require('../utils/consts');

class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.status = conflictStatusCode;
  }
}

module.exports = ConflictError;
