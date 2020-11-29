import * as express from 'express';
import { R } from '@root/routes';
import Controller from '@controllers/index';
import OriginService from '@services/Origin/index';

class OriginController extends Controller {

  constructor() {
    super();
  }

  public async createOrigin(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<R> {
    try {
      const originRecord = await OriginService.createOrigin(req.body);
      return res.json({ origin: originRecord });
    } catch (err) {
      return next(err);
    }
  }

  public async getOrigins(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<R> {
    try {
      const { page, limit, keyword, sort } = req.query;
      const origins = await OriginService.getOrigins(keyword, {
        page,
        limit,
        sort
      });
      return res.json(origins);
    } catch (err) {
      return next(err);
    }
  }

}

export default new OriginController();
