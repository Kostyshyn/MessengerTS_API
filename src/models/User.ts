import * as mongoose from 'mongoose';
import * as bcrypt from 'bcryptjs';
import config from '@config/index';
import { ImageModelInterface } from '@models/Image';

export const ObjectId = mongoose.Schema.Types.ObjectId;

const MODEL_NAME = 'User';

export interface UserModelInterface extends mongoose.Document {
  _id: mongoose.Schema.Types.ObjectId;
  role?: number;
  first_name: string;
  last_name?: string;
  username: string;
  email?: string;
  password?: string;
  profile_image: ImageModelInterface;
  online?: boolean;
  isConfirmed?: boolean;
  isActive?: boolean;
  isBlocked?: boolean;
  softDelete?: boolean;
  url?: string;
  last_seen?: Date;
}

export interface UserUpdateFieldsInterface {
  first_name?: string;
  last_name?: string;
  username?: string;
  profile_image?: ImageModelInterface;
  online?: boolean;
  isConfirmed?: boolean;
  isActive?: boolean;
  isBlocked?: boolean;
  softDelete?: boolean;
  url?: string;
}

const Schema = mongoose.Schema;

const { PRIVATE_ACCESS_USER } = process.env;
const { NAME, USERNAME } = config.VALIDATION[MODEL_NAME];

function lastNameValidator(value): boolean | void {
  if (value) {
    return NAME.REGEX.test(value) && value.length >= NAME.MIN_LENGTH;
  }
}

const Model = Schema({
  role: {
    type: Number,
    default: PRIVATE_ACCESS_USER
  },
  first_name: {
    type: String,
    trim: true,
    validate: NAME.REGEX,
    minlength: NAME.MIN_LENGTH,
    maxlength: NAME.MAX_LENGTH,
    required: true
  },
  last_name: {
    type: String,
    trim: true,
    validate: lastNameValidator,
    maxlength: NAME.MAX_LENGTH,
  },
  username: {
    type: String,
    trim: true,
    validate: USERNAME.REGEX,
    minlength: USERNAME.MIN_LENGTH,
    maxlength: USERNAME.MAX_LENGTH,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  profile_image: {
    type: Schema.Types.ObjectId,
    ref: 'Image'
  },
  online: {
    type: Boolean,
    default: false
  },
  isConfirmed: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: false
  },
  isBlocked: {
    type: Boolean,
    default: false
  },
  softDelete: {
    type: Boolean,
    default: false
  },
  url: {
    type: String,
    unique: true,
    trim: true
  },
  last_seen: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

Model.pre('save', async function (): Promise<void> {
  if (this.isModified('password') || this.isModified('username')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    this.url = '@' + this.username;
  }
});

const User = mongoose.model<UserModelInterface>(MODEL_NAME, Model);

export { User };
