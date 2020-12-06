import * as express from 'express';
import { R } from '@root/routes';
import Controller from '@controllers/index';
import RequestLogService from '@services/RequestLog/index';

class RequestLogController extends Controller {

  constructor() {
    super();
  }

  public async getRequestLogs(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<R> {
    try {
      const { page, limit, keyword, sort } = req.query;
      const requestLogs = await RequestLogService.getRequestLogs(keyword, {
        page,
        limit,
        sort
      });
      return res.json(requestLogs);
    } catch (err) {
      return next(err);
    }
  }

  public async getRequestLog(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<R> {
    try {
      const { id } = req.params;
      const query = { _id: id };
      const requestLog = await RequestLogService.getRequestLogBy(query);
      return res.json({ requestLog });
    } catch (err) {
      return next(err);
    }
  }

}

export default new RequestLogController();
