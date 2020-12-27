import * as mongoose from 'mongoose';
import { setOriginsCache } from '@cache/origin';
import { nanoid } from 'nanoid';
import config from '@config/index';

export const ObjectId = mongoose.Schema.Types.ObjectId;

const MODEL_NAME = 'Origin';

export interface OriginModelInterface extends mongoose.Document {
  _id?: mongoose.Schema.Types.ObjectId;
  name?: string;
  origin_url?: string;
  api_key?: string;
  isDefault?: boolean;
  totalRequests?: number;
}

const Schema = mongoose.Schema;
const { NAME, ORIGIN_URL } = config.VALIDATION[MODEL_NAME];

const Model = Schema({
  name: {
    type: String,
    trim: true,
    validate: NAME.REGEX,
    minlength: NAME.MIN_LENGTH,
    maxlength: NAME.MAX_LENGTH,
    required: true
  },
  origin_url: {
    type: String,
    minlength: ORIGIN_URL.MIN_LENGTH,
    required: true,
    unique: true,
    index: true
  },
  api_key: {
    type: String,
    index: true
  },
  isDefault: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

Model.pre('save', function (next): void {
  this.api_key = nanoid();
  next();
});

Model.post('save', async function (): Promise<void> {
  await setOriginsCache();
});

const Origin = mongoose.model<OriginModelInterface>(MODEL_NAME, Model);

export { Origin };
