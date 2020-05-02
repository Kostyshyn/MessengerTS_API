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
  IMAGE
} = config.FILES;

class UploadService {

  private fileFiltersHash = {
    image: IMAGE.ACCEPT_FILES
  }

  private fileLimitsHash = {
    image: IMAGE.MAX_FILE_SIZE_MB
  }

  private defaultExtHash = {
    image: IMAGE.DEF_EXT
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
    const { id } = req.decoded;
    const { entity, type } = req.params;
    const directory = path.normalize(`${privateFolderPath}/${entity}/${id}/${type}`);
    try {
      fs.statSync(directory);
    } catch (err) {
      shell.mkdir('-p', directory);
    }
    cb(null, directory);
  }

  private filename(context): any {
    return function (req, file, cb): any {
      const { type } = req.params;
      const ext = path.extname(file.originalname) || `.${context.defaultExtHash[type]}`;
      const fileName = `${ Date.now() }${ext}`;
      cb(null, fileName);
    };
  }

  private storage = multer.diskStorage({
    destination: this.destination,
    filename: this.filename(this)
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