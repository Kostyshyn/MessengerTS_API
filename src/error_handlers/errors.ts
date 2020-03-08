export class HttpException extends Error {

  public name = 'HttpExceptionError';

  constructor(
      public status: number,
      public message: string,
      public errors?: object
    ) {
    super(message);
  }

}

export class NotFoundError extends HttpException {

  public name = 'NotFoundError';

  constructor(public page: string) {
    super(404, `Page ${ page } not found`);
  }

}

export class TokenVerificationError extends HttpException {

  public name = 'TokenVerificationError';

  constructor(public message: string) {
    super(401, message);
  }

}

export class ValidationError extends HttpException {

  public name = 'ValidationError';

  constructor(public errors: object) {
    super(422, 'Validation failed', errors);
  }

}
