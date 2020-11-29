import * as colors from 'colors';
import { HttpException } from '@error_handlers/errors';
import { originsSeed } from '@seeds/origins';

const seeds = [
  originsSeed()
];

export const runSeeds = async (): Promise<string[]> => {
  try {
    const result = await Promise.all(seeds);
    result.forEach(seedResult => {
      console.log(colors.green(seedResult));
    });

    return result;
  } catch (err) {
    throw new HttpException(500, err.message);
  }
};
