import { Request } from 'express';
import * as cors from 'cors';
import { MFunction } from '@routes/index';
import { ForbiddenError } from '@error_handlers/errors';
import { OriginModelInterface } from '@models/Origin';
import { originsCache } from '@cache/origin';

type corsCallback = (err: Error | null, options?: cors.CorsOptions) => void

const validateOrigin = (
  origins: Array<OriginModelInterface>,
  origin: string
): boolean => {
  return origins.some(o => (o.origin_url === origin));
};

const corsOptionsDelegate = async (
  req: Request,
  callback: corsCallback
): Promise<void> => {
  const origin = req.header('Origin');
  const origins: OriginModelInterface[] = originsCache.get('origins');
  if (validateOrigin(origins, origin)) {
    callback(null, { origin: true });
  } else {
    const error = new ForbiddenError('Origin is not allowed. Blocked by CORS policy');
    callback(error, { origin: false });
  }
};

export default function (): MFunction {
  return cors(corsOptionsDelegate);
};
