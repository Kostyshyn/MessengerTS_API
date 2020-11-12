import * as jwt from 'jsonwebtoken';
import * as express from 'express';
import { ForbiddenError, TokenVerificationError } from '@error_handlers/errors';

export const protectedRoute = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): express.NextFunction => {
  const token = req.body.token || req.query.token || req.headers['x-access-token'];
  const { SECRET_AUTH_KEY } = process.env;
  if (token) {
    jwt.verify(token, SECRET_AUTH_KEY, (err, decoded): express.NextFunction => {
      if (err) {
        return next(new TokenVerificationError('Token verification failed'));
      }
      req.decoded = decoded;
      console.log('decoded', decoded);
      return next();
    });
  } else {
    return next(new TokenVerificationError('No token'));
  }
};

export const selfRoute = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): express.NextFunction => {
  const { id: resourceId } = req.params;
  const { id } = req.decoded;
  if (id && id === resourceId) {
    return next();
  }
  return next(new ForbiddenError('Access forbidden'));
};

export const adminRoute = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): express.NextFunction => {
  const { PRIVATE_ACCESS_ADMIN } = process.env;
  const { role } = req.decoded;
  if (role && role === PRIVATE_ACCESS_ADMIN) {
    return next();
  }
  return next(new ForbiddenError('Access forbidden'));
};
