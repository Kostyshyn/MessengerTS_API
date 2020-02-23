import * as mongoose from 'mongoose';
import config from '@config/index';
import { UserModelInterface } from '@models/User';

const { DEF_PROFILE_IMG } = config.FILES;

export const ObjectId = mongoose.Schema.Types.ObjectId;

export interface ImageModelInterface extends mongoose.Document {
  type?: string;
  user?: UserModelInterface;
  url?: string;
}

const Schema = mongoose.Schema;

const ImageModel = Schema({
  type: {
    type: String,
    default: '',
    select: false
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    select: false
  },
  url: {
    type: String,
    unique: true,
    trim: true
  }
}, {
  timestamps: true
});

const Image = mongoose.model<ImageModelInterface>('Image', ImageModel);

export { Image };

export const getDefaultImage = async () => {
  const findDefImage: ImageModelInterface = await Image.findOne({
    type: 'default'
  });

  if (findDefImage) {
    return findDefImage;
  } else {
    return await Image.create({
      type: 'default',
      url: DEF_PROFILE_IMG
    });
  }
};