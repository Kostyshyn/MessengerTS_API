import * as multer from 'multer';
import * as path from 'path';
import config from '@config/index';
import { checkDir } from '@helpers/file';
import { ValidationError } from '@error_handlers/errors';

const privateFolderPath: string = path.join(process.cwd(), 'storage');

// now for images only

const {
  MAX_FILE_SIZE_MB,
  IMAGE
} = config.FILES;

class UploadService {

  // types: image, video, application

  private fileFiltersHash = {
    image: IMAGE.ACCEPT_FILES
  }

  private defaultExtHash = {
    image: IMAGE.DEF_EXT
  }

  private fileLimits = {
    fileSize: 1024 * 1024 * MAX_FILE_SIZE_MB
  }

  private getType (file: any): string {
    if (file) {
      const { mimetype } = file;
      return mimetype.split('/')[0];
    }
    return '';
  }

  private fileFilters(): any {
    return (req, file, cb) => {
      const type = this.getType(file);
      const mimetypes = this.fileFiltersHash[type];
      if (mimetypes.includes(file.mimetype)){
        cb(null, true);
      } else {
        cb(new ValidationError({
          file: ['Incorrect file extension']
        }), false);
      }
    };
  }

  private destination(req, file, cb): void {
    const directory = path.normalize(`${privateFolderPath}/tmp`);
    checkDir(directory);
    cb(null, directory);
  }

  private filename(): any {
    return (req, file, cb) => {
      const type = this.getType(file);
      const ext = path.extname(file.originalname) || `.${this.defaultExtHash[type]}`;
      const fileName = `${ Date.now() }${ext}`;
      cb(null, fileName);
    };
  }

  private storage = multer.diskStorage({
    destination: this.destination,
    filename: this.filename()
  })

  public uploadFile(): any {
    return multer({
      storage: this.storage,
      fileFilter: this.fileFilters(),
      limits: this.fileLimits
    });
  }

}

export default new UploadService();