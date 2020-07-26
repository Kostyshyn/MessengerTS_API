import * as express from 'express';
import { R } from '@root/routes';
import Controller from '@controllers/index';
import UserService from '@services/User/index';
import FileService from '@services/File/index';

class UploadController extends Controller {

  constructor() {
    super();
  }

  public async uploadProfileImage(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<R> {
    try {
      const { id } = req.decoded;
      const file = req.files[0];
      const image = await FileService.createProfileImage(
        file,
        id,
        req.body.original_name
      );
      const updatedUser = await UserService.updateUserFields(id, {
        profile_image: {
          _id: image._id.toString()
        }
      });
      return res.json({
        user: updatedUser
      });
    } catch (err) {
      return next(err);
    }
  }

}

export default new UploadController();
