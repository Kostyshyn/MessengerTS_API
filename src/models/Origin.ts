import * as mongoose from 'mongoose';
import { nanoid } from 'nanoid';
import config from '@config/index';

export const ObjectId = mongoose.Schema.Types.ObjectId;

const MODEL_NAME = 'Origin';

export interface OriginModelInterface extends mongoose.Document {
  _id?: mongoose.Schema.Types.ObjectId;
  name?: string;
  origin?: string;
  api_key?: string;
  requests?: number;
}

const Schema = mongoose.Schema;
const { NAME } = config.VALIDATION[MODEL_NAME];

const Model = Schema({
  name: {
    type: String,
    trim: true,
    validate: NAME.REGEX,
    minlength: NAME.MIN_LENGTH,
    maxlength: NAME.MAX_LENGTH,
    required: true
  },
  origin: {
    type: String,
    required: true,
    index: true
  },
  api_key: {
    type: String,
    default: nanoid(),
    index: true
  }
}, {
  timestamps: true
});

Model.post('save', function (doc, next): void {
  console.log('Origin saved', doc);
  next();
});

const Origin = mongoose.model<OriginModelInterface>(MODEL_NAME, Model);

export { Origin };
