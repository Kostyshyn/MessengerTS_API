import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import * as crypto from 'crypto';

export const generatePassword = async (
  password: string,
  rounds = 10
): Promise<string> => {
  const salt = await bcrypt.genSalt(rounds);
  return bcrypt.hash(password, salt);
};

export const validatePassword = (
  savedPassword: string,
  password: string
): Promise<boolean> => {
  return bcrypt.compare(password, savedPassword);
};

export const generateToken = (payload: object): string => {
  const { SECRET_AUTH_KEY, EXPIRES_AUTH_TOKEN } = process.env;
  return jwt.sign(payload, SECRET_AUTH_KEY, {
    expiresIn: parseInt(EXPIRES_AUTH_TOKEN)
  });
};

export const generateRandomToken = async (length = 16): Promise<string> => {
  const buffer = await crypto.randomBytes(length);
  return buffer.toString('hex');
};
