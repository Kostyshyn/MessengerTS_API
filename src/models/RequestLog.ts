import * as mongoose from 'mongoose';

export const ObjectId = mongoose.Schema.Types.ObjectId;

const MODEL_NAME = 'RequestLog';

type methodType = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface RequestLogModelInterface extends mongoose.Document {
  _id?: mongoose.Schema.Types.ObjectId;
  ip?: string;
  originalUrl?: string;
  url?: string;
  urlParts?: string[];
  method?: methodType;
  params?: object;
  query?: object;
  origin?: mongoose.Schema.Types.ObjectId;
  statusCode?: number;
  decoded?: object;
  responseTime?: number; // in ms
  day?: number;
  hour?: number;
}

const Schema = mongoose.Schema;

const Model = Schema({
  ip: {
    type: String,
    trim: true,
    default: ''
  },
  originalUrl: {
    type: String,
    trim: true,
    required: true
  },
  url: {
    type: String,
    trim: true,
    required: true
  },
  urlParts: {
    type: [String]
  },
  method: {
    type: String
  },
  params: {
    type: Schema.Types.Mixed,
    default: {}
  },
  query: {
    type: Schema.Types.Mixed,
    default: {}
  },
  origin: {
    type: Schema.Types.ObjectId,
    ref: 'Origin'
  },
  statusCode: {
    type: Number
  },
  decoded: {
    type: Schema.Types.Mixed,
    default: {}
  },
  responseTime: {
    type: Number
  },
  day: {
    type: Number
  },
  hour: {
    type: Number
  }
}, {
  timestamps: true
});

Model.pre('save', function (next): void {
  next();
});

// Model.post('save', async function (): Promise<void> {
// });

const RequestLog = mongoose.model<RequestLogModelInterface>(MODEL_NAME, Model);

export { RequestLog };
