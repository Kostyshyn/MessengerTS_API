import { check } from 'express-validator';
import { privateFolderPath } from '@middlewares/storage'
import { deleteFile } from '@helpers/file';
import config from '@config/index';

const { TMP_DIR } = config.DEFAULTS;

export const original_name = check('original_name')
  .trim()
  .custom(async (value, { req }): Promise<boolean | string> => {
    if (value) {
      return true;
    }
    const file = req.files[0];
    if (file) {
      const tmp = `${privateFolderPath}/${TMP_DIR}/${file.filename}`;
      await deleteFile(tmp);
    }
    return Promise.reject('File original name is required');
  });

export const files = check('files')
  .custom(async (value, { req }): Promise<boolean | string> => {
    if (req.files && req.files[0]) {
      return true
    }
    return Promise.reject('Image is required');
  });

export default  {
  original_name,
  files
};