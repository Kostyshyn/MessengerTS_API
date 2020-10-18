import { check } from 'express-validator';
import config from '@config/index';

const { User } = config.VALIDATION;

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
  .withMessage('Username is required');

export const email = check('email')
  .notEmpty()
  .withMessage('Email is required')
  .bail()
  .isEmail()
  .withMessage('Invalid email')
  .normalizeEmail({
    gmail_remove_dots: false
  });

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

export const confirmPasswordReg = check('confirm_password')
  .trim()
  .notEmpty()
  .withMessage('Password confirmation is required')
  .bail()
  .custom(async (value, { req }): Promise<boolean | string> => {
    if (!req.body.password || req.body.password === value) {
      return true
    }
    return Promise.reject('Password does not match');
  });

export default {
  first_name,
  last_name,
  usernameReg,
  username,
  email,
  password,
  passwordReg,
  confirmPasswordReg
};
