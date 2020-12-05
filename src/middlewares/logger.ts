import * as express from 'express';
import * as logger from 'morgan';
import * as moment from 'moment';
import { getCleanUrl } from '@helpers/general';
import { OriginModelInterface } from '@models/Origin';
import { originsCache } from '@cache/origin';

const { API_VERSION } = process.env;
const API_VERSION_KEY = `/v${API_VERSION}`;

export { logger };

export const requestLogger = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): express.NextFunction => {
  const requestTime = Date.now();
  res.on('finish', () => {
    const {
      ip,
      originalUrl,
      params,
      method,
      query,
      decoded
    } = req;
    const { statusCode } = res;
    const reqOrigin = req.header('Origin');
    const origins: OriginModelInterface[] = originsCache.get('origins');
    const findOrigin = origins.find(o => (o.origin_url === reqOrigin));
    const origin = findOrigin ? findOrigin._id : '';
    const urlWithoutQuery = originalUrl.split(/[?#]/)[0];
    const responseTime = (Date.now() - requestTime);
    const day = moment.utc(requestTime).day();
    const hour = moment.utc(requestTime).hour();

    const url = getCleanUrl(
      urlWithoutQuery,
      [API_VERSION_KEY],
      params
    );

    console.log({
      ip,
      originalUrl,
      url,
      method,
      params,
      query,
      origin,
      statusCode,
      decoded,
      responseTime,
      day,
      hour
    });
  });
  return next();
};
