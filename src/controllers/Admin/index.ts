import * as express from 'express';
import { R } from '@root/routes';
import Controller from '@controllers/index';
import UserService from '@services/User/index';

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
      const users = await UserService.getUsers();
      return res.json({ users });
    } catch (err) {
      return next(err);
    }
  }

  public async getUsers(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<R> {
    try {
      const { page, limit, keyword, sort } = req.query;
      const users = await UserService.getUsers('', keyword, {
        page,
        limit,
        sort
      });
      return res.json(users);
    } catch (err) {
      return next(err);
    }
  }
}

export default new AdminController();
