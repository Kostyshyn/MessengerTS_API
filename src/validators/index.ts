import * as express from 'express';
import { check, validationResult } from 'express-validator/check';
import { ValidationError } from '@error_handlers/errors';
import rules from '@validators/rules';
import { DEF_MIDDLEWARE } from '@routes/index';

export const username = check('username')
	.not()
	.isEmpty()
	.withMessage('Usermame is required');

export const email = check('email')
	.not()
	.isEmpty()
	.withMessage('Email is required')
	.bail()
	.isEmail()
	.withMessage('Invalid email');

export const password = check('password')
	.not()
	.isEmpty()
	.withMessage('Password is required');

export const passwordReg = check('password')
	.not()
	.isEmpty()
	.withMessage('Password is required')
	.bail()
	.isLength({ min: 6 })
	.withMessage('Must be at least 6 chars long');

const rulesHash = {
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

