import {
  Image,
  ImageModelInterface,
  ResizedImageInterface
} from '@models/Image';
import Service, {
  PaginationInterface,
  ServiceOptionsInterface
} from '@services/index';
import { FileInterface } from '@services/Upload';
import select from '@data_lists/index';
import { truncate } from '@helpers/general';
import { resizeImage } from '@helpers/resizeImage';
import { deleteFile, checkDir } from '@helpers/file';
import { privateFolderPath } from '@middlewares/storage'
import config from '@config/index';

const {
  PRIVATE_DIR,
  TMP_DIR,
  USER_DIR
} = config.DEFAULTS;
const { PAGINATION } = config;
const { Image: ImageValidation } = config.VALIDATION;

class FileService extends Service {

  constructor() {
    super();
  }

  public async createImage(image: ImageModelInterface): Promise<ImageModelInterface> {
    return this.create(Image, image);
  }

  public async createProfileImage(
    file: FileInterface,
    id: string,
    originalName: string
  ): Promise<ImageModelInterface> {
    const {
      filename: name,
    } = file;
    const tmp = `${privateFolderPath}/${TMP_DIR}/${name}`;
    const userFolder = `${privateFolderPath}/user/${id}/image`;

    checkDir(userFolder);
    const resizedResult = await resizeImage(tmp, userFolder);
    const resizedArray = resizedResult.map((
      {
        width,
        height,
        size
      }: ResizedImageInterface
    ): ResizedImageInterface => {
      return {
        width,
        height,
        size
      };
    });
    await deleteFile(tmp);

    const imagePath = `${PRIVATE_DIR}/${USER_DIR}/${id}/image/${name}`;
    const original_name = truncate(originalName, ImageValidation.ORIGINAL_NAME.MAX_LENGTH);

    return this.createImage({
      original_name,
      name,
      format: 'jpeg',
      type: 'profile_image',
      user: { _id: id },
      path: imagePath,
      sizes: resizedArray
    });
  }

  public async getUserImages(
    id: string,
    options: ServiceOptionsInterface = {}
  ): Promise<PaginationInterface<ImageModelInterface>> {
    const limit = Math.abs(options.limit) || PAGINATION['Image'].PER_PAGE;
    const sort = options.sort || { createdAt: 'desc' };
    const query = {
      user: id
    };

    return this.find<ImageModelInterface>(Image, query, {
      ...options,
      select: select.string('images'),
      limit,
      sort
    });
  }
}

export default new FileService();
