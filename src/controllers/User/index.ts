import UserService from '@services/User/index';
import Controller from '@controllers/index';
import { ValidationError } from '@error_handlers/errors';

class UserController extends Controller {

	constructor() {
		super();
	}

	public async fetchUser(req, res, next) {
		try {
			const { user } = await UserService.getUser(req.decoded.id);
			res.json({ user });
		} catch (err) {
			next(err);
		}
	}

	public async getUsers(req, res, next) {
		const { page, limit } = req.query;

		try {
			const users = await UserService.getUsers({
				page,
				limit
			});
			res.json(users);
		} catch (err) {
			next(err);
		}
	}

	public async getUserByUrl(req, res, next) {
		try {
			const { user } = await UserService.getUserByUrl(req.params.url);
			res.json({ user });
		} catch (err) {
			next(err);
		}
	}
}

export default new UserController();