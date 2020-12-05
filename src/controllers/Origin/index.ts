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

  public async getOrigin(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<R> {
    try {
      const { id } = req.params;
      const origin = await OriginService.getOrigin(id);
      return res.json({ origin });
    } catch (err) {
      return next(err);
    }
  }

  public async updateOrigin(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<R> {
    try {
      const { id } = req.params;
      const { name, origin_url } = req.body;
      const origin = await OriginService.updateOriginFields(id, { name, origin_url });
      return res.json({ origin });
    } catch (err) {
      return next(err);
    }
  }

  public async deleteOrigin(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<R> {
    try {
      const { id } = req.params;
      await OriginService.deleteOrigin(id);
      return res.json({ success: true });
    } catch (err) {
      return next(err);
    }
  }

}

export default new OriginController();
