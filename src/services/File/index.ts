import config from '@config/index';
import { Image, ImageModelInterface } from '@models/Image';
import Service from '@services/index';
import { HttpException, ValidationError } from '@error_handlers/errors';
import { userImageFields, userAllImagesFields } from '@data_lists/image';
const { PAGINATION } = config;

class FileService extends Service {

  constructor() {
    super();
  }

  public async createImage(image: ImageModelInterface): Promise<any> {
    const imageRecord = await this.create(Image, image);
    return imageRecord;
  }

  public async getUserImages(id: string, options: any = {}): Promise<any> {
  	const limit = Math.abs(options.limit) || PAGINATION['Image'].PER_PAGE;
    const sort = { createdAt: 'desc' };
  	const query = {
      user: id
    };
    const images = await this.find(Image, query, {
      ...options,
      select: userAllImagesFields.join(' '),
      limit,
      sort
    });

    return images;
  }

}

export default new FileService();