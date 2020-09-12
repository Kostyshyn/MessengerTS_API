import * as mongoose from 'mongoose';

export const ObjectId = mongoose.Schema.Types.ObjectId;

const MODEL_NAME = 'Token';
const { EXPIRES_CONFIRM_TOKEN } = process.env;

export type TokenType = 'confirm' | 'reset';

export interface TokenModelInterface extends mongoose.Document {
  _id?: mongoose.Schema.Types.ObjectId;
  value: string;
  type: TokenType;
  user: mongoose.Types.ObjectId;
  createdAt?: string;
}

const Schema = mongoose.Schema;

const Model = Schema({
  value: {
    type: String,
    unique: true,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
    expires: EXPIRES_CONFIRM_TOKEN
  }
});

const Token = mongoose.model<TokenModelInterface>(MODEL_NAME, Model);

export { Token };
