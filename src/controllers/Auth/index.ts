import * as express from 'express';
import AuthService from '@services/Auth/index';
import Controller from '@controllers/index';

type R = express.Response | express.NextFunction;

class AuthController extends Controller {

  constructor() {
    super();
  }

  public async login(
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ): Promise<R> {
    try {
      const { user, token } = await AuthService.login(req.body);
      res.json({ user, token });
    } catch (err) {
      next(err);
    }
  }

  public async register(
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ): Promise<R> {
    try {
      const { user, token } = await AuthService.register(req.body);
      res.json({ user, token });
    } catch (err) {
      next(err);
    }
  }
}

export default new AuthController();