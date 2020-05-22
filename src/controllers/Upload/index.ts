import Controller from '@controllers/index';
import UserService from '@services/User/index';
import FileService from '@services/File/index';
import { ValidationError } from '@error_handlers/errors';
import config from '@config/index';
import { truncate } from '@helpers/general';
import { resizeImage } from '@helpers/resizeImage';
import { moveFile, deleteFile, checkDir } from '@helpers/file';
const { Image } = config.VALIDATION;

import * as path from 'path';

class UploadController extends Controller {

  constructor() {
    super();
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
        const imagePath = `storage/user/${_id}/image/128_128_${name}`; // for test
        const image = await FileService.createImage({
          original_name,
          name,
          mimetype,
          type: 'profile_image',
          user: { _id },
          path: imagePath,
          size // TODO: BUG should be the size of the resized image
        });
        const privateFolderPath: string = path.join(process.cwd(), 'storage');
        const tmp = `${privateFolderPath}/tmp/${name}`;
        const userFolder = `${privateFolderPath}/user/${_id}/image`;
        checkDir(userFolder);
        await resizeImage(tmp, userFolder);
        await deleteFile(tmp); // TODO: fix bug with file deleting
        // await moveFile(tmp, `${userFolder}/${name}`);

        const { user: updatedUser } = await UserService.updateUserFields(_id, {
          profile_image: {
            _id: image._id.toString()
          }
        });
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

}

export default new UploadController();
