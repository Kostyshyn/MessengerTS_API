import * as express from 'express';
import * as multer from 'multer';
import * as path from 'path';
import config from '@config/index';
import { checkDir } from '@helpers/file';
import { ValidationError } from '@error_handlers/errors';
import { privateFolderPath } from '@middlewares/storage'

// now for images only

const { TMP_DIR } = config.DEFAULTS;
const {
  MAX_FILE_SIZE_MB,
  IMAGE
} = config.FILES;

export interface FileInterface {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
  size: number;
}

type ErrorArg = null | ValidationError;
type ResultArg = boolean | string;

interface MulterCallbackInterface {
  (
    req: express.Request,
    file: FileInterface,
    cb: (ErrorArg, ResultArg) => {}
  ): void;
}

class UploadService {

  // types: image, video, application

  private fileFiltersHash = {
    image: IMAGE.ACCEPT_FILES
  };

  private defaultExtHash = {
    image: IMAGE.DEF_EXT
  };

  private fileLimits = {
    fileSize: 1024 * 1024 * MAX_FILE_SIZE_MB
  };

  private static getType(file: FileInterface): string {
    if (file) {
      const { mimetype } = file;
      return mimetype.split('/')[0];
    }
    return '';
  }

  private fileFilters(): MulterCallbackInterface {
    return (req, file, cb): void => {
      const type = UploadService.getType(file);
      const mimetypes = this.fileFiltersHash[type];
      if (mimetypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new ValidationError({
          file: ['Incorrect file extension']
        }), false);
      }
    };
  }

  private static destination(
    req: express.Request,
    file: FileInterface,
    cb: (ErrorArg, ResultArg) => {}
  ): void {
    const directory = path.normalize(`${privateFolderPath}/${TMP_DIR}`);
    checkDir(directory);
    cb(null, directory);
  }

  private filename(): MulterCallbackInterface {
    return (req, file, cb): void => {
      const type = UploadService.getType(file);
      const ext = path.extname(file.originalname) || `.${this.defaultExtHash[type]}`;
      const fileName = `${Date.now()}${ext}`;
      cb(null, fileName);
    };
  }

  private storage = multer.diskStorage({
    destination: UploadService.destination,
    filename: this.filename()
  });

  public uploadFile(): multer.diskStorage {
    return multer({
      storage: this.storage,
      fileFilter: this.fileFilters(),
      limits: this.fileLimits
    });
  }

}

export default new UploadService();
