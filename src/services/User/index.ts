import config from '@config/index';
import { User, UserModelInterface } from '@models/User';
import Service from '@services/index';
import { HttpException, TokenVerificationError } from '@error_handlers/errors';
import { showFields } from '@data_lists/index';
import { userSelf as userShowSelfData, user as userShowData, userList } from '@data_lists/user';
const { PAGINATION } = config;

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

		throw new TokenVerificationError('Token verification failed')
	}

	public async getUsers(options): Promise<any> {
		const limit = Math.abs(options.limit) || PAGINATION['User'].PER_PAGE;
		const users = await this.find(User, {}, {
			...options,
			select: userList.join(' '),
			limit
		});

		return users;
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