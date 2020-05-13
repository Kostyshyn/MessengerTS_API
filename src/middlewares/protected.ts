import * as jwt from 'jsonwebtoken';
import * as express from 'express';
import { TokenVerificationError } from '@error_handlers/errors';

export default function(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): express.NextFunction {
  const token = req.body.token || req.query.token || req.headers['x-access-token'];
  const { SECRET_AUTH_KEY } = process.env;
  if (token) {
    jwt.verify(token, SECRET_AUTH_KEY, (err, decoded): express.NextFunction => {      
      if (err) {
        return next(new TokenVerificationError('Token verification failed'));    
      }
      req.decoded = decoded;
      return next();
    });
  } else {
    return next(new TokenVerificationError('No token'));
  }
};
