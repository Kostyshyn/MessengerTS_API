import Controller from '@controllers/index';
import UserService from '@services/User/index';
import UploadService from '@services/Upload/index';
import FileService from '@services/File/index';
import { ValidationError } from '@error_handlers/errors';
import * as util from 'util';
import config from '@config/index';
import truncate from '@helpers/truncate';
const { Image } = config.VALIDATION;

class UploadController extends Controller {

  constructor() {
    super();
  }

  private uploadTypesHash = {
    image: this.uploadProfileImage
  }

  public async uploadFile(req, res, next) {
    const { type } = req.params;
    await this.saveFileToStorage(req, res);
    return this.uploadTypesHash[type](req, res, next);
  }

  public async uploadProfileImage(req, res, next) {
    try {
      const { files } = req;
      if (files.length) {
        const file = files[0];
        const original_name = truncate(req.body.original_name, Image.ORIGINAL_NAME.MAX_LENGTH);
        const { id: _id } = req.decoded;
        const {
          filename: name,
          mimetype,
          size
        } = file;
        const path = `storage/user/${_id}/image/${file.filename}`;
        const image = await FileService.createImage({
          original_name,
          name,
          mimetype,
          type: 'profile_image',
          user: { _id },
          path,
          size
        });
        const { user: updatedUser } = await UserService.updateUserFields(_id, {
          profile_image: {
            _id: image._id.toString()
          }
        });
        // const profile_images = await FileService.getUserImages(_id);
        return res.json({
          user: updatedUser
        });
      }
      return next(new ValidationError({
        file: ['Image is required']
      }));
    } catch (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return next(new ValidationError({
          file: ['File too large']
        }));
      }
      next(err);
    }
  }

  private saveFileToStorage(req, res) {
    const { type } = req.params;
    const uploadMiddleware = UploadService.uploadFile(type);
    const uploadPromise = util.promisify(uploadMiddleware.any());
    return uploadPromise(req, res);
  }

}

export default new UploadController();