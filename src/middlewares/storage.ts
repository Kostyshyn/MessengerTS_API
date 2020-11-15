import * as express from 'express';
import * as path from 'path';
import config from '@config/index';
import { protectedRoute } from '@middlewares/protected';

const {
  PUBLIC_DIR,
  PRIVATE_DIR
} = config.DEFAULTS;
export const absolutePath = (url: string): string => path.join(process.cwd(), url);

export const publicFolder = express.static(absolutePath(PUBLIC_DIR));
export const privateFolderPath: string = absolutePath(PRIVATE_DIR);

export const privateFolder = (app): void => {
  app.use(
    `/${PRIVATE_DIR}`,
    protectedRoute,
    express.static(absolutePath(PRIVATE_DIR))
  );
};
