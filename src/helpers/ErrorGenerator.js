class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
    this.name = 'BadRequestError';
  }
}

class InvalidDataError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 422;
    this.name = 'InvalidDataError';
  }
}

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
    this.name = 'NotFoundError';
  }
}

class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 403;
    this.name = 'ForbiddenError';
  }
}

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
    this.name = 'UnauthorizedError';
  }
}

export {
  InvalidDataError,
  BadRequestError,
  NotFoundError,
  ForbiddenError,
  UnauthorizedError,
};
