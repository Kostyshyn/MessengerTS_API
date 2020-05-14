import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

export const generateToken = (payload: object): string => {
  const { SECRET_AUTH_KEY, EXPIRES_TOKEN } = process.env;
  const token: string = jwt.sign(payload, SECRET_AUTH_KEY, {
    expiresIn: parseInt(EXPIRES_TOKEN)
  });
  return token;
};

export const validatePassword = (
		savedPassword: string,
		password: string
	): Promise<boolean> => {
  return bcrypt.compare(password, savedPassword);
};
