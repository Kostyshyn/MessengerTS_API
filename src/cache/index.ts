import * as colors from 'colors';
import { HttpException } from '@error_handlers/errors';
import { setOriginsCache } from '@cache/origin';

const caches = [
  setOriginsCache()
];

export const initCache = async (): Promise<void> => {
  try {
    await Promise.all(caches);
    console.log(colors.green('Initialized cache'));
  } catch (err) {
    throw new HttpException(500, err.message);
  }
};
