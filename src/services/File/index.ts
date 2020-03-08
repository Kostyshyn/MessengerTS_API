import { Image, ImageModelInterface } from '@models/Image';
import Service from '@services/index';
import { HttpException, ValidationError } from '@error_handlers/errors';
import { userImage } from '@data_lists/image';

class FileService extends Service {

  constructor() {
    super();
  }

  public async createImage(image: ImageModelInterface ): Promise<any> {
    const imageRecord = await this.create(Image, image);
    return imageRecord;
  }

}

export default new FileService();