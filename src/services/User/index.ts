import { User, UserModelInterface } from '@models/User';
import Service from '@services/index';
import { HttpException } from '@error_handlers/errors';

class UserService extends Service {

	constructor() {
		super();
	}

	public async getUser(id: string): Promise<any> {

		const user = await this.findById(User, id);

		if (user) {
			return {
				user
			};
		}

		throw new HttpException(404, `${user.username} not found`);
	}

	public async createUser(user: UserModelInterface): Promise<any> {

		const findUser = await this.findOne(User, {
			$or: [
				{ 'username': user.username }, 
				{ 'email': user.email }
			]
		});

		if (findUser) {
			throw new HttpException(409,'User is already exists');
		}

		const userRecord = await this.create(User, user);

		return userRecord;
	}

}

export default new UserService();