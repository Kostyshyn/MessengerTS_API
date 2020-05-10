import * as express from 'express';
import UserService from '@services/User/index';
import FileService from '@services/File/index';
import Controller from '@controllers/index';

type R = express.Response | express.NextFunction;

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
      const { user } = await UserService.getUser(id);
      res.json({ user });
    } catch (err) {
      next(err);
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
      const { user } = await UserService.updateUserFields(id, {
        first_name,
        last_name,
        username
      });
      res.json({ user });
    } catch (err) {
      next(err);
    }
  }

  public async getUsers(
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ): Promise<R> {
    try {
      const { id } = req.decoded;
      const { page, limit, keyword } = req.query;
      const users = await UserService.getUsers(id, {
        page,
        limit,
        keyword
      });
      res.json(users);
    } catch (err) {
      next(err);
    }
  }

  public async getUserByUrl(
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ): Promise<R> {
    try {
      const { url } = req.params;
      const { user } = await UserService.getUserByUrl(url);
      res.json({ user });
    } catch (err) {
      next(err);
    }
  }

  public async getUserImages(
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ): Promise<R> {
    try {
      const { id } = req.decoded;
      const images = await FileService.getUserImages(id);
      res.json({ images });
    } catch (err) {
      next(err);
    }
  }
}

export default new UserController();