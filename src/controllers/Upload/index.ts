import Controller from '@controllers/index';
import UserService from '@services/User/index';
import UploadService from '@services/Upload/index';
import FileService from '@services/File/index';
import { ValidationError } from '@error_handlers/errors';
import * as util from 'util';

class UploadController extends Controller {

  constructor() {
    super();
  }

  public async uploadFile(req, res, next) {
    try {
      const upload = UploadService.uploadFile(req.params.type);
      const uploadImage = util.promisify(upload.single('file'));
      await uploadImage(req, res);
      const file = req.file;
      if (file) {
        const { user } = await UserService.getUser(req.decoded.id);
        const image = await FileService.createImage({
          name: file.filename,
          mimetype: file.mimetype,
          type: 'profile_image',
          user: {
            _id: user._id.toString()
          },
          url: `storage/user/${user.username}/image/${file.filename}`
        });
        const { user: updatedUser } = await UserService.updateUserImages(req.decoded.id, image);
        return res.json({ user: updatedUser });
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