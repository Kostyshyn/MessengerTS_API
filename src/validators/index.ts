import * as express from 'express';
import { validationResult } from 'express-validator';
import { ValidationError } from '@error_handlers/errors';
import { DEF_MIDDLEWARE, MFunction } from '@routes/index';
import userValidators from './user';
import imageValidators from './image';
import rules from '@validators/rules';

// add all the rules here

const rulesHash = {
  ...userValidators,
  ...imageValidators
};

export const formatErrors = (errors: any): object => {
  const result = {};
  errors.map(error => {
    if (result[error.param]) {
      result[error.param].push(error.msg)
    } else {
      result[error.param] = [error.msg]
    }
  });
  return result;
};

export const validatorFn = (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
): express.NextFunction => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    const errors = result.array();
    return next(new ValidationError(formatErrors(errors)));
  }

  return next();
};

export const validate = (type: string): MFunction[] => {
  if (type && (rules && rules[type])) {
    const validator = rules[type].map(rule => {
      if (rulesHash[rule]) {
        return rulesHash[rule]
      }
    });
    return [...validator, validatorFn];
  }
  return DEF_MIDDLEWARE;
};

