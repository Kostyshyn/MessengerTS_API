import * as express from 'express';
import { check, validationResult } from 'express-validator';
import { ValidationError } from '@error_handlers/errors';
import rules from '@validators/rules';
import { DEF_MIDDLEWARE } from '@routes/index';
import config from '@config/index';
const { NAME, USERNAME, PASSWORD } = config.VALIDATION.User;

export const first_name = check('first_name')
  .trim()
  .escape()
  .notEmpty()
  .withMessage('First name is required')
  .bail()
  .matches(NAME.REGEX)
  .withMessage('Valid characters are A-Z a-z 0-9')
  .bail()
  .isLength({
    min: NAME.MIN_LENGTH,
    max: NAME.MAX_LENGTH
  })
  .withMessage(`Must be between ${NAME.MIN_LENGTH} and ${NAME.MAX_LENGTH} characters long`);

export const last_name = check('last_name')
  .trim()
  .if(value => (!!value))
  .matches(NAME.REGEX)
  .withMessage('Valid characters are A-Z a-z 0-9')
  .bail()
  .isLength({
    min: NAME.MIN_LENGTH,
    max: NAME.MAX_LENGTH
  })
  .withMessage(`Must be between ${NAME.MIN_LENGTH} and ${NAME.MAX_LENGTH} characters long`);

export const usernameReg = check('username')
  .trim()
  .escape()
  .notEmpty()
  .withMessage('Username is required')
  .bail()
  .matches(USERNAME.REGEX)
  .withMessage('Valid characters are A-Z a-z 0-9. You can also use underscore or period between characters')
  .bail()
  .isLength({
    min: USERNAME.MIN_LENGTH,
    max: USERNAME.MAX_LENGTH
  })
  .withMessage(`Must be between ${USERNAME.MIN_LENGTH} and ${USERNAME.MAX_LENGTH} characters long`);

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
    min: PASSWORD.MIN_LENGTH,
    max: PASSWORD.MAX_LENGTH
  })
  .withMessage(`Must be between ${PASSWORD.MIN_LENGTH} and ${PASSWORD.MAX_LENGTH} characters long`);

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

const formatErrors = errors => {
  const result = {};
  errors.map(error => {
    const errors = {};
    if (result[error.param]) {
      result[error.param].push(error.msg)
    } else {
      result[error.param] = [error.msg]
    }
  });
  return result;
};

const validatorFn = (req: express.Request, res: express.Response, next: express.NextFunction): express.NextFunction => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    const errors = result.array()
    return next(new ValidationError(formatErrors(errors)));
  }

  return next();
};

export const validate = type => {
  if (type && (rules && rules[type])) {
    const validator = rules[type].map(rule => {
      if (rulesHash[rule]) {
        return rulesHash[rule]
      }
    });
    return [...validator, validatorFn];
  }
  return [DEF_MIDDLEWARE];
};

