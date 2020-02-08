import * as express from 'express';
import { HttpException, NotFoundError } from './errors';
import config from '@config/index';

export const notFoundErrorHandler = (req: express.Request, res: express.Response): express.Response => {
  const err = new NotFoundError(req.originalUrl);
  const { name, status, message } = err;
  res.status(err.status).json({
    name,
    status,
    message
  });
};


export const errorHandler = (err: HttpException, req: express.Request, res: express.Response, next: express.NextFunction): express.Response => {
  const { NODE_ENV } = process.env;
  const { ERRORS_TO_LOG } = config.LOGGER;
  const name = err.name || 'HttpExceptionError';
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  if (NODE_ENV === 'development' && ERRORS_TO_LOG.includes(err.name)) {
    console.error(err);
  }

  res.status(status).json({
    name,
    status,
    message
  });
};