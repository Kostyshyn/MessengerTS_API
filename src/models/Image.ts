import * as mongoose from 'mongoose';
import config from '@config/index';

export const ObjectId = mongoose.Schema.Types.ObjectId;

const MODEL_NAME = 'Image';

export interface ImageModelInterface extends mongoose.Document {
  _id?: mongoose.Schema.Types.ObjectId;
  original_name?: string;
  name?: string;
  format?: string;
  type?: string;
  user?: mongoose.Types.ObjectId;
  path?: string;
  sizes?: ResizedImageInterface[];
}

export interface ResizedImageInterface {
  format?: string;
  width: number;
  height: number;
  channels?: number;
  premultiplied?: boolean;
  size: number;
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
  format: {
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
  sizes: {
    type: Array,
    default: []
  }
}, {
  timestamps: true
});

const Image = mongoose.model<ImageModelInterface>(MODEL_NAME, Model);

export { Image };
