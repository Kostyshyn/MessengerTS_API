import { Request } from 'express';
import * as cors from 'cors';
import { MFunction } from '@routes/index';
import { ForbiddenError } from '@error_handlers/errors';
import { originsCache } from '@cache/origin';

type corsCallback = (err: Error | null, options?: cors.CorsOptions) => void

const corsOptionsDelegate = async (
  req: Request,
  callback: corsCallback
): Promise<void> => {
  const origin = req.header('Origin');
  // TODO: get white list form the DB
  const origins = originsCache.get('origins');
  const whitelist = ['http://localhost:8080', 'Postman', 'http://192.168.0.101:8080'];
  console.log('origin', origin, origins);
  if (origin && whitelist.indexOf(origin) !== -1) {
    callback(null, { origin: true });
  } else {
    const error = new ForbiddenError('Origin is not allowed. Blocked by CORS policy');
    callback(error, { origin: false });
  }
};

export default function (): MFunction {
  return cors(corsOptionsDelegate);
};
