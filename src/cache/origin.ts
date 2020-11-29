import * as NodeCache from 'node-cache';
import { Origin, OriginModelInterface } from '@models/Origin';

export const originsCache = new NodeCache();

export const setOriginsCache = async (): Promise<Array<OriginModelInterface>> => {
  try {
    const originRecords = await Origin.find();
    originsCache.set('origins', originRecords);
    return originRecords;
  } catch (err) {
    throw err;
  }
};
