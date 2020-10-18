import * as mongoose from 'mongoose';

export const ObjectId = mongoose.Schema.Types.ObjectId;

const {
  EXPIRES_CONFIRM_TOKEN,
  EXPIRES_RESET_TOKEN
} = process.env;

export type TokenType = 'confirm' | 'reset';

export interface TokenModelInterface extends mongoose.Document {
  _id?: mongoose.Schema.Types.ObjectId;
  value: string;
  type: TokenType;
  user: mongoose.Types.ObjectId;
  createdAt?: string;
}

const Schema = mongoose.Schema;

const BaseTokenSchema = {
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
  }
};

const confirmTokenModel = Schema({
  ...BaseTokenSchema,
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
    expires: EXPIRES_CONFIRM_TOKEN
  }
});

const resetTokenModel = Schema({
  ...BaseTokenSchema,
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
    expires: EXPIRES_RESET_TOKEN
  }
});

const ConfirmToken = mongoose.model<TokenModelInterface>('ConfirmToken', confirmTokenModel);
const ResetToken = mongoose.model<TokenModelInterface>('ResetToken', resetTokenModel);

export { ConfirmToken, ResetToken };
