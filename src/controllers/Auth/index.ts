import * as express from 'express';
import { R } from '@routes/index';
import AuthService from '@services/Auth/index';
import Controller from '@controllers/index';
import { generateToken } from '@helpers/auth';

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
      const user = await AuthService.login(req.body);
      const token = generateToken({
        id: user._id
      });
      return res.json({ user, token });
    } catch (err) {
      return next(err);
    }
  }

  public async register(
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ): Promise<R> {
    try {
      const user = await AuthService.register(req.body);
      const token = generateToken({
        id: user._id
      });
      return res.json({ user, token });
    } catch (err) {
      return next(err);
    }
  }
}

export default new AuthController();
