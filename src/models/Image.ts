import * as mongoose from 'mongoose';
import config from '@config/index';

const { PROFILE_IMG } = config.DEFAULTS;

export const ObjectId = mongoose.Schema.Types.ObjectId;

const MODEL_NAME = 'Image';

export interface ImageModelInterface extends mongoose.Document {
  _id?: mongoose.Schema.Types.ObjectId;
  original_name?: string;
  name?: string;
  mimetype?: string;
  type?: string;
  user?: mongoose.Types.ObjectId;
  path?: string;
  size?: number;
}

const Schema = mongoose.Schema;
const { ORIGINAL_NAME } = config.VALIDATION[MODEL_NAME];

const Model = Schema({
  original_name: {
    type: String,
    trim: true,
    maxlength: ORIGINAL_NAME.MAX_LENGTH,
    default: ''
  },
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
  path: {
    type: String,
    unique: true,
    trim: true
  },
  size: Number
}, {
  timestamps: true
});

const Image = mongoose.model<ImageModelInterface>(MODEL_NAME, Model);

export { Image };

export const getDefaultImage = async (): Promise<ImageModelInterface> => {
  const findDefImage: ImageModelInterface = await Image.findOne({
    type: 'default'
  });

  if (findDefImage) {
    return findDefImage;
  } else {
    return await Image.create({
      type: 'default',
      path: PROFILE_IMG
    });
  }
};