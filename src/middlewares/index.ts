import * as express from 'express';
import * as cookieParser from 'cookie-parser';
import * as helmet from 'helmet';
import * as compression from 'compression';

// logger

import { logger, requestLogger } from './logger';

// storage
import { publicFolder } from './storage';

// cors
import allowedOrigins from './cors';

export default [
  compression(),
  helmet(),
  logger('dev'),
  express.json(),
  express.urlencoded({ extended: false }),
  cookieParser(),
  allowedOrigins(),
  requestLogger,
  publicFolder
];
