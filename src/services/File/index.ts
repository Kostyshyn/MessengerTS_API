import config from '@config/index';
import { Image, ImageModelInterface } from '@models/Image';
import Service from '@services/index';
import { PaginationInterface, ServiceOptionsInterface } from '@services/index';
import { userAllImagesFields } from '@data_lists/image';
const { PAGINATION } = config;

class FileService extends Service {

  constructor() {
    super();
  }

  public async createImage(image: ImageModelInterface): Promise<ImageModelInterface> {
    const imageRecord = await this.create(Image, image);
    return imageRecord;
  }

  public async getUserImages(
      id: string,
      options: ServiceOptionsInterface = {}
    ): Promise<PaginationInterface<ImageModelInterface>> {
  	const limit = Math.abs(options.limit) || PAGINATION['Image'].PER_PAGE;
    const sort = { createdAt: 'desc' };
  	const query = {
      user: id
    };
    const images = await this.find<ImageModelInterface>(Image, query, {
      ...options,
      select: userAllImagesFields.join(' '),
      limit,
      sort
    });

    return images;
  }
}

export default new FileService();