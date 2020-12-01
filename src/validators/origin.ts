import { check } from 'express-validator';
import config from '@config/index';

const { Origin } = config.VALIDATION;

export const name = check('name')
  .trim()
  .escape()
  .notEmpty()
  .withMessage('Name is required')
  .bail()
  .matches(Origin.NAME.REGEX)
  .withMessage('Valid characters are A-Z a-z 0-9')
  .bail()
  .isLength({
    min: Origin.NAME.MIN_LENGTH,
    max: Origin.NAME.MAX_LENGTH
  })
  .withMessage(`Must be between ${Origin.NAME.MIN_LENGTH} and ${Origin.NAME.MAX_LENGTH} characters long`);

export const origin_url = check('origin_url')
  .trim()
  .notEmpty()
  .withMessage('Origin URL is required')
  .bail()
  .isLength({
    min: Origin.ORIGIN_URL.MIN_LENGTH
  })
  .withMessage(`Must be at least ${Origin.ORIGIN_URL.MIN_LENGTH} characters long`);

export default {
  name,
  origin_url
};
