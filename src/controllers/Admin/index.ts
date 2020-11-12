import * as express from 'express';
import { R } from '@root/routes';
import Controller from '@controllers/index';
import UserService from '@services/User/index';
import FileService from '@services/File/index';

class AdminController extends Controller {

  constructor() {
    super();
  }

  public async getAdminData(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<R> {
    try {
      // const { id, role } = req.decoded;
      const { page, limit, keyword, sort } = req.query;
      const users = await UserService.getUsers('', keyword, {
        page,
        limit,
        sort
      });
      return res.json({ users });
    } catch (err) {
      return next(err);
    }
  }

}

export default new AdminController();
