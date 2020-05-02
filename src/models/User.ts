import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt-nodejs';
import config from '@config/index';
import { ImageModelInterface, getDefaultImage } from '@models/Image';

export const ObjectId = mongoose.Schema.Types.ObjectId;

const MODEL_NAME = 'User';

export interface UserModelInterface extends mongoose.Document {
  role?: number;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  password: string;
  reset_token?: string;
  profile_image?: ImageModelInterface;
  online?: boolean;
  url?: string;
  last_seen?: any;
}

const Schema = mongoose.Schema;

const { PRIVATE_ACCESS_USER } = process.env;
const { NAME, USERNAME } = config.VALIDATION[MODEL_NAME];

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
  reset_token: {
    type: String
  },
  profile_image: {
    type: Schema.Types.ObjectId,
    ref: 'Image'
  },
  online: {
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

function lastNameValidator(value) {
  if (value) {
    return NAME.REGEX.test(value) && value.length >= NAME.MIN_LENGTH;
  }
};

Model.pre('save', async function(): Promise<any> {

  if (this.isNew) {
    const defImage = await getDefaultImage();
    this.profile_image = defImage;
  }

  if (this.isModified('password') || this.isModified('username')) {
    const hash = bcrypt.hashSync(this.password, bcrypt.genSaltSync(10), null);
    this.password = hash;
    this.url = '@' + this.username;
  }

});

const User = mongoose.model<UserModelInterface>(MODEL_NAME, Model);

export { User };
