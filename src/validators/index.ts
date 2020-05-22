import * as express from 'express';
import { check, validationResult } from 'express-validator';
import { ValidationError } from '@error_handlers/errors';
import rules from '@validators/rules';
import { DEF_MIDDLEWARE, MFunction } from '@routes/index';
import config from '@config/index';
const { User } = config.VALIDATION;

// User fields

export const first_name = check('first_name')
  .trim()
  .escape()
  .notEmpty()
  .withMessage('First name is required')
  .bail()
  .matches(User.NAME.REGEX)
  .withMessage('Valid characters are A-Z a-z 0-9')
  .bail()
  .isLength({
    min: User.NAME.MIN_LENGTH,
    max: User.NAME.MAX_LENGTH
  })
  .withMessage(`Must be between ${User.NAME.MIN_LENGTH} and ${User.NAME.MAX_LENGTH} characters long`);

export const last_name = check('last_name')
  .trim()
  .if(value => (!!value))
  .matches(User.NAME.REGEX)
  .withMessage('Valid characters are A-Z a-z 0-9')
  .bail()
  .isLength({
    min: User.NAME.MIN_LENGTH,
    max: User.NAME.MAX_LENGTH
  })
  .withMessage(`Must be between ${User.NAME.MIN_LENGTH} and ${User.NAME.MAX_LENGTH} characters long`);

export const usernameReg = check('username')
  .trim()
  .escape()
  .notEmpty()
  .withMessage('Username is required')
  .bail()
  .matches(User.USERNAME.REGEX)
  .withMessage('Valid characters are A-Z a-z 0-9. You can also use underscore or period between characters')
  .bail()
  .isLength({
    min: User.USERNAME.MIN_LENGTH,
    max: User.USERNAME.MAX_LENGTH
  })
  .withMessage(`Must be between ${User.USERNAME.MIN_LENGTH} and ${User.USERNAME.MAX_LENGTH} characters long`);

export const username = check('username')
  .trim()
  .escape()
  .notEmpty()
  .withMessage('Username is required')  

export const email = check('email')
  .notEmpty()
  .withMessage('Email is required')
  .bail()
  .isEmail()
  .withMessage('Invalid email')
  .normalizeEmail();

export const password = check('password')
  .trim()
  .notEmpty()
  .withMessage('Password is required');

export const passwordReg = check('password')
  .trim()
  .notEmpty()
  .withMessage('Password is required')
  .bail()
  .isLength({
    min: User.PASSWORD.MIN_LENGTH,
    max: User.PASSWORD.MAX_LENGTH
  })
  .withMessage(`Must be between ${User.PASSWORD.MIN_LENGTH} and ${User.PASSWORD.MAX_LENGTH} characters long`);

// add all the rules here

const rulesHash = {
  first_name,
  last_name,
  usernameReg,
  username,
  email,
  password,
  passwordReg
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

