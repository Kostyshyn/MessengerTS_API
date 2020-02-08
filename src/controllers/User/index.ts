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

	public async getUserById(req, res, next) {
		try {
			const { user } = await UserService.getUser(req.decoded);
			res.json({ user });
		} catch (err) {
			next(err);
		}
	}
}

export default new UserController();