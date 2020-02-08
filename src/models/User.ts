import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt-nodejs';
import config from '@config/index';

export const ObjectId = mongoose.Schema.Types.ObjectId;

export interface UserModelInterface extends mongoose.Document {
  role?: number;
  username: string;
  email: string;
  password: string;
  reset_token?: string;
  profile_img?: string;
  online?: boolean;
  href?: string;
  last_seen?: any;
}

const Schema = mongoose.Schema;

const { PRIVATE_ACCESS_USER } = process.env;
const { DEF_PROFILE_IMG } = config.FILES;

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
	profile_img: {
		type: String,
		default: DEF_PROFILE_IMG
	},
	online: {
		type: Boolean,
		default: false
	},
	href: {
		type: String,
		unique: true,
		trim: true,
	},
	last_seen: {
		type: Date,
		default: Date.now		
	}
}, {
  	timestamps: true
});

UserModel.pre('save', function(next): any {

	if (this.isModified('password') || this.isModified('username')){

		const hash = bcrypt.hashSync(this.password, bcrypt.genSaltSync(10), null);
		this.password = hash;
		this.href = this.username.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}|=\-_`~()]/g, '').replace(/\s/g, '-');
		next(null, this);
		
	} 
	return next();
});


const User = mongoose.model<UserModelInterface>('User', UserModel);

export { User };
