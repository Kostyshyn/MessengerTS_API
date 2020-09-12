import * as express from 'express';
import { R } from '@root/routes';
import Controller from '@controllers/index';
import UserService from '@services/User/index';
import FileService from '@services/File/index';

class UserController extends Controller {

  constructor() {
    super();
  }

  public async fetchUser(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<R> {
    try {
      const { id } = req.decoded;
      const user = await UserService.getUser(id);
      return res.json({ user });
    } catch (err) {
      return next(err);
    }
  }

  public async updateUserInfo(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<R> {
    try {
      const { id } = req.decoded;
      const { first_name, last_name, username } = req.body;
      const user = await UserService.updateUserFields(id, {
        first_name,
        last_name,
        username
      });
      return res.json({ user });
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
      const { id } = req.decoded;
      const { page, limit, keyword, sort } = req.query;
      const users = await UserService.getUsers(id, keyword, {
        page,
        limit,
        sort
      });
      return res.json(users);
    } catch (err) {
      return next(err);
    }
  }

  public async getUserByUrl(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<R> {
    try {
      const { url } = req.params;
      const user = await UserService.getUserByUrl(url);
      return res.json({ user });
    } catch (err) {
      return next(err);
    }
  }

  public async getUserById(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<R> {
    try {
      const { id } = req.params;
      const user = await UserService.getUserById(id);
      return res.json({ user });
    } catch (err) {
      return next(err);
    }
  }

  public async getUserImages(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<R> {
    try {
      const { id } = req.params;
      const images = await FileService.getUserImages(id);
      return res.json({ images });
    } catch (err) {
      return next(err);
    }
  }
}

export default new UserController();
