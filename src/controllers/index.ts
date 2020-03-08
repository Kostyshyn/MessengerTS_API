import * as express from 'express';
import { validationResult } from 'express-validator/check';

export default class Controller {

  public asyncController(controller): any {
    return (req: express.Request, res: express.Response, next: express.NextFunction) => {
      Promise.resolve(controller(req, res)).catch(next);
    }
  }

}