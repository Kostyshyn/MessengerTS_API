import * as express from 'express';
import * as cookieParser from 'cookie-parser';
import * as logger from 'morgan';
import * as cors from 'cors';
import * as helmet from 'helmet';
import * as compression from 'compression';

// storage

import { publicFolder } from './storage';

export default [
  compression(),
  helmet(),
  logger('dev'),
  express.json(),
  express.urlencoded({ extended: false }),
  cookieParser(),
  cors(),
  publicFolder
];
