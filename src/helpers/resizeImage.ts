import * as sharp from 'sharp';
import * as path from 'path';
import config from '@config/index';
const { CROP_SIZES } = config.FILES.IMAGE;

const resize = (
		size: number,
		imagePath: string,
		destination: string
	): any => {
	return sharp(imagePath)
		.resize(size, size)
  	.toFile(destination);
};

export const resizeImage = (
		imagePath: string,
		destination: string
	): Promise<any> => {
	return Promise
		.all(CROP_SIZES.map(size => {
		  const name = path.basename(imagePath);
		  const resized = `${destination}/${size}_${size}_${name}`
		  return resize(size, imagePath, resized);
		})
	);
};
