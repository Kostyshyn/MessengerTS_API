import * as sharp from 'sharp';
import * as path from 'path';
import config from '@config/index';
import { ResizedImageInterface } from '@models/Image';

const { CROP_SIZES } = config.FILES.IMAGE;

sharp.cache(false);

const resize = (
  size: number,
  imagePath: string,
  destination: string
): Promise<ResizedImageInterface> => {
  return sharp(imagePath)
    .resize(size, size)
    .toFile(destination);
};

export const resizeImage = (
  imagePath: string,
  destination: string
): Promise<Array<ResizedImageInterface>> => {
  return Promise
    .all(CROP_SIZES.map(size => {
        const ext = path.extname(imagePath);
        const name = path.basename(imagePath, ext);
        const resized = `${destination}/${name}_${size}_${size}${ext}`;
        return resize(size, imagePath, resized);
      })
    );
};
