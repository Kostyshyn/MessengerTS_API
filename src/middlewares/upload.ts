import * as multer from 'multer';
import * as fs from 'fs';
import * as path from 'path';
import config from '@config/index';
import { HttpException, ValidationError } from '@error_handlers/errors';

const UPLOAD_TYPES = ['image'];

// util.promisify

// now for images only

const {
  ACCEPT_FILES_IMG,
  MAX_FILE_SIZE_MB_IMG
} = config.FILES;

//

const privateFolderPath = path.join(process.cwd(), 'storage');

const checkDir = (directory: string) => {
  try {
    fs.statSync(directory);
  } catch (err) {
    fs.mkdirSync(directory);
  }
};

const destination = (req, file, cb) => {
  const { url } = req.decoded;
  const { type } = req.params;
  const directory = `${ privateFolderPath }/user/${ url }/${ type }s`;
  checkDir(directory);
  cb(null, directory);
};

const filename = (req, file, cb) => {
  const { url } = req.decoded;
  const fileName = `${ url }-${ Date.now() }`;
  cb(null, fileName);
};

const storage = multer.diskStorage({
  destination,
  filename
});

const fileFiltersHash = {
  image: ACCEPT_FILES_IMG
};

const fileLimitsHash = {
  image: MAX_FILE_SIZE_MB_IMG
};

const fileLimits = (type: string) => ({
  fileSize: 1024 * 1024 * fileLimitsHash[type]
});

const fileFilters = (type: string) => {
  const mimetypes = fileFiltersHash[type];
  return (req, file, cb) => {
    if (mimetypes.includes(file.mimetype)){
      cb(null, true);
    } else {
      cb(new ValidationError({
        file: ['Incorrect file extension']
      }), false);
    }
  };
};

export const uploadFile = (type: string) => {
  return multer({
    storage,
    fileFilter: fileFilters(type),
    limits: fileLimits(type)
  });
};