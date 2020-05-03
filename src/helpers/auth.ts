import { UserModelInterface } from '@models/User';
import * as bcrypt from 'bcrypt-nodejs';
import * as jwt from 'jsonwebtoken';

export const generateToken = (payload: any): string => {
  const { SECRET_AUTH_KEY, EXPIRES_TOKEN } = process.env;
  const token: string = jwt.sign(payload, SECRET_AUTH_KEY, {
    expiresIn: parseInt(EXPIRES_TOKEN)
  });
  return token;
};

export const validatePassword = (user: UserModelInterface, password: string): any => {
  return bcrypt.compareSync(password, user.password);
};