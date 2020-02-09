import { User, UserModelInterface } from '@models/User';
import Service from '@services/index';
import { HttpException, ValidationError } from '@error_handlers/errors';
import * as bcrypt from 'bcrypt-nodejs';
import * as jwt from 'jsonwebtoken';
import { showFields } from '@data_lists/index';
import { user as userShowData } from '@data_lists/user';

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
			if (this.validatePassword(findUser, user.password)) {
				const token = this.generateToken({ id: findUser._id });

				return {
					user: showFields(findUser, userShowData),
					token
				};
			}

			throw new ValidationError('Invalid password');
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
			user: showFields(userRecord, userShowData),
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

	private validatePassword(user: UserModelInterface, password: string): any {
		return bcrypt.compareSync(password, user.password);
	}

}

export default new AuthService();