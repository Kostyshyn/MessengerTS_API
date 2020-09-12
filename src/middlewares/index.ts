import * as express from 'express';
import * as cookieParser from 'cookie-parser';
import * as logger from 'morgan';
import * as helmet from 'helmet';
import * as compression from 'compression';

// storage

import { publicFolder } from './storage';
import allowedOrigins from './cors';

export default [
  compression(),
  helmet(),
  logger('dev'),
  express.json(),
  express.urlencoded({ extended: false }),
  cookieParser(),
  allowedOrigins(),
  publicFolder
];
