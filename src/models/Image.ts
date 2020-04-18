import * as mongoose from 'mongoose';
import config from '@config/index';
import { UserModelInterface } from '@models/User';

const { DEF_PROFILE_IMG } = config.FILES;

export const ObjectId = mongoose.Schema.Types.ObjectId;

const MODEL_NAME = 'Image';

export interface ImageModelInterface extends mongoose.Document {
  name?: string;
  mimetype?: string;
  type?: string;
  // user?: UserModelInterface;
  user?: any;
  url?: string;
}

const Schema = mongoose.Schema;

const Model = Schema({
  name: {
    type: String,
    trim: true,
    default: ''
  },
  mimetype: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: ''
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  url: {
    type: String,
    unique: true,
    trim: true
  }
}, {
  timestamps: true
});

const Image = mongoose.model<ImageModelInterface>(MODEL_NAME, Model);

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