import { User, UserModelInterface } from '@models/User';
import Service from '@services/index';
import { HttpException } from '@error_handlers/errors';
import { showFields } from '@data_lists/index';
import { userSelf as userShowSelfData, user as userShowData } from '@data_lists/user';

class UserService extends Service {

	constructor() {
		super();
	}

	public async getUser(id: string): Promise<any> {

		const user = await this.findById(User, id);

		if (user) {
			return {
				user: showFields(user, userShowSelfData)
			};
		}

		throw new HttpException(404, `${user.username} not found`);
	}

	public async getUsers(): Promise<any> {

		const users = await this.find(User);

		return {
			users
		};
	}

	public async getUserByUrl(url: string): Promise<any> {

		const user = await this.findOne(User, { url });

		if (user) {
			return {
				user: showFields(user, userShowData)
			};
		}

		throw new HttpException(404, `${ url } not found`);
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

		return showFields(userRecord, userShowData);
	}

}

export default new UserService();