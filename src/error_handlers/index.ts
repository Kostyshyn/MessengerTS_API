import * as express from 'express';
import * as multer from 'multer';
import {
  HttpException,
  NotFoundError,
  ValidationError
} from './errors';
import config from '@config/index';

export const notFoundErrorHandler = (
  req: express.Request,
  res: express.Response
): express.Response => {
  const err = new NotFoundError(req.originalUrl);
  const { name, status, message } = err;
  res.status(err.status).json({
    name,
    status,
    message
  });
};


export const errorHandler = (
  error: HttpException,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): express.Response => {
  let err;
  if (error instanceof multer.MulterError) {
    err = new ValidationError({
      file: [error.message]
    });
  } else {
    err = error
  }
  const { NODE_ENV } = process.env;
  const { ERRORS_TO_LOG, ERRORS_TO_EXIT } = config.LOGGER;
  const name = err.name || 'HttpExceptionError';
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  const errors = err.errors;

  if (NODE_ENV === 'development' && ERRORS_TO_LOG.includes(err.name)) {
    console.error(err);
  }

  if (ERRORS_TO_EXIT.includes(err.name)) {
    return process.exit(0);
  }

  res.status(status).json({
    name,
    status,
    message,
    errors
  });
};
