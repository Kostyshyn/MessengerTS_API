import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt-nodejs';
import config from '@config/index';
import { ImageModelInterface, getDefaultImage } from '@models/Image';

export const ObjectId = mongoose.Schema.Types.ObjectId;

export interface UserModelInterface extends mongoose.Document {
  role?: number;
  username: string;
  email: string;
  password: string;
  reset_token?: string;
  profile_image?: ImageModelInterface;
  profile_images?: ImageModelInterface[];
  online?: boolean;
  url?: string;
  last_seen?: any;
}

const Schema = mongoose.Schema;

const { PRIVATE_ACCESS_USER } = process.env;

const UserModel = Schema({
  role: {
    type: Number,
    default: PRIVATE_ACCESS_USER
  },
  username: {
    type: String,
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
  profile_images: [{
    type: Schema.Types.ObjectId,
    ref: 'Image'
  }],
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

UserModel.pre('save', async function(): Promise<any> {

  if (this.isNew) {
    const defImage = await getDefaultImage();
    this.profile_image = defImage;
    this.profile_images.push(defImage)
  }

  if (this.isModified('password') || this.isModified('username')){
    const hash = bcrypt.hashSync(this.password, bcrypt.genSaltSync(10), null);
    this.password = hash;
    this.url = '@' + this.username.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}|=\-_`~()]/g, '').replace(/\s/g, '_');    
  }

});

const User = mongoose.model<UserModelInterface>('User', UserModel);

export { User };
