import { User, UserModelInterface } from '@models/User';
import Service from '@services/index';
import { HttpException } from '@error_handlers/errors';
import * as bcrypt from 'bcrypt-nodejs';
import * as jwt from 'jsonwebtoken';

class AuthService extends Service {

	constructor() {
		super();
	}

	public async login(user: UserModelInterface): Promise<any> {

		const findUser = await this.findOne(User, {
			$or: [
				{ 'username': user.username }, 
				{ 'email': user.email }
			]
		});

		if (findUser) {
			const token = this.generateToken({ id: findUser._id });

			return {
				user: findUser,
				token
			};
		}

		throw new HttpException(404, `${user.username} not found`);

	}

	public async register(user: UserModelInterface): Promise<any> {

		const findUser = await this.findOne(User, {
			$or: [
				{ 'username': user.username }, 
				{ 'email': user.email }
			]
		});

		if (findUser) {
			throw new HttpException(409, 'User is already exists');
		}

		const userRecord = await this.create(User, user);
		const token = this.generateToken({ id: userRecord._id });

		return {
			user: userRecord,
			token
		};
	}

	private generateToken(payload: any): string {
		const { SECRET_AUTH_KEY, EXPIRES_TOKEN } = process.env;
		const token: string = jwt.sign(payload, SECRET_AUTH_KEY, {
			expiresIn: parseInt(EXPIRES_TOKEN)
		});
		return token;
	}

}

export default new AuthService();