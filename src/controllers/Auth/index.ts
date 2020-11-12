import * as express from 'express';
import { R } from '@root/routes';
import Controller from '@controllers/index';
import AuthService from '@services/Auth/index';
import MailService from '@services/Mail/index';
import TokenService from '@services/Token/index';
import { generateToken } from '@helpers/auth';
import UserService from '@services/User';
import { ValidationError } from '@error_handlers/errors';

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
        id: user._id,
        role: user.role
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
        id: user._id,
        role: user.role
      });
      const origin = req.header('Origin');
      await MailService.sendConfirmationEmail(user, origin);
      return res.json({ user, token });
    } catch (err) {
      return next(err);
    }
  }

  public async confirm(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<R> {
    try {
      const { token } = req.query;
      const confirmationToken = await TokenService.getToken({ value: token }, 'confirm');
      const { user: userId, _id: tokenId } = confirmationToken;
      const user = await UserService.getUser(userId);
      if (user.isConfirmed) {
        return next(new ValidationError({
          isConfirmed: ['User is already confirmed']
        }));
      }
      const confirmedUser = await UserService.updateUserFields(userId, { isConfirmed: true });
      await TokenService.deleteToken(tokenId, 'confirm');
      const authToken = generateToken({
        id: user._id,
        role: user.role
      });
      return res.json({
        user: confirmedUser,
        token: authToken
      });
    } catch (err) {
      if (err.status === 404) {
        return next(new ValidationError({
          token: ['Token invalid or expired']
        }));
      }
      return next(err);
    }
  }

  public async resendConfirm(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<R> {
    try {
      const { id } = req.decoded;
      const user = await UserService.getUser(id);
      if (user.isConfirmed) {
        return next(new ValidationError({
          isConfirmed: ['User is already confirmed']
        }));
      }
      const origin = req.header('Origin');
      await MailService.sendConfirmationEmail(user, origin);
      return res.json({ success: true });
    } catch (err) {
      return next(err);
    }
  }

  public async resetPassword(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<R> {
    const { email } = req.body;
    try {
      const user = await UserService.getUserBy({ email });
      const origin = req.header('Origin');
      await MailService.sendResetPasswordEmail(user, origin);
      return res.json({ success: true });
    } catch (err) {
      if (err.status === 404) {
        return next(new ValidationError({
          email: [`User with email '${email}' is not exists`]
        }));
      }
      return next(err);
    }
  }

  public async changePassword(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<R> {
    try {
      const { token, password } = req.body;
      const resetToken = await TokenService.getToken({ value: token }, 'reset');
      const { user: userId, _id: tokenId } = resetToken;
      const updatedUser = await AuthService.updateUserPassword(userId, { password });
      await TokenService.deleteToken(tokenId, 'reset');
      await MailService.sendInfoEmail(
        updatedUser,
        'Security alert',
        'Your password has been changed',
        'Security alert'
      );
      const authToken = generateToken({
        id: updatedUser._id,
        role: updatedUser.role
      });
      return res.json({
        user: updatedUser,
        token: authToken
      });
    } catch (err) {
      if (err.status === 404) {
        return next(new ValidationError({
          token: ['Token invalid or expired. Please re-initiate password resetting']
        }));
      }
      return next(err);
    }
  }
}

export default new AuthController();
