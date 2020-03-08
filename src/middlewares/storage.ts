import * as express from 'express';
import * as path from 'path';
import protectedRoute from '@middlewares/protected';

export const publicFolder = express.static(path.join(process.cwd(), 'public'));

export const privateFolder = (app) => {
  app.use(
    '/storage',
    protectedRoute,
    express.static(path.join(process.cwd(), 'storage'))
  );
};