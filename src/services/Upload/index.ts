import * as multer from 'multer';
import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util';
import * as shell from 'shelljs';
import config from '@config/index';
import { ValidationError } from '@error_handlers/errors';

const privateFolderPath: string = path.join(process.cwd(), 'storage');

// now for images only

const {
  ACCEPT_FILES_IMG,
  MAX_FILE_SIZE_MB_IMG,
  DEF_IMG_EXT
} = config.FILES;

class UploadService {

  private fileFiltersHash = {
    image: ACCEPT_FILES_IMG
  }

  private fileLimitsHash = {
    image: MAX_FILE_SIZE_MB_IMG
  }

  private fileLimits(type: string): any {
    return {
      fileSize: 1024 * 1024 * this.fileLimitsHash[type]
    };
  }

  private fileFilters(type: string): any {
    const mimetypes = this.fileFiltersHash[type];
    return (req, file, cb) => {
      if (mimetypes.includes(file.mimetype)){
        cb(null, true);
      } else {
        cb(new ValidationError({
          file: ['Incorrect file extension']
        }), false);
      }
    };
  }

  private destination(req, file, cb): any {
    const { username } = req.decoded;
    const { type } = req.params;
    const directory = path.normalize(`${privateFolderPath}/user/${username}/${type}`);
    try {
      fs.statSync(directory);
    } catch (err) {
      shell.mkdir('-p', directory);
    }
    cb(null, directory);
  }

  private filename(req, file, cb): any {
    const ext = path.extname(file.originalname) || `.${DEF_IMG_EXT}`;
    const fileName = `${ Date.now() }${ext}`;
    cb(null, fileName);
  }

  private storage = multer.diskStorage({
    destination: this.destination,
    filename: this.filename
  })

  public uploadFile(type: string): any {
    return multer({
      storage: this.storage,
      fileFilter: this.fileFilters(type),
      limits: this.fileLimits(type)
    });
  }

}

export default new UploadService();