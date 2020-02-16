import AuthService from '@services/Auth/index';
import Controller from '@controllers/index';

class AuthController extends Controller {

	constructor() {
		super();
	}

	public async login(req, res, next) {
		try {
			const { user, token } = await AuthService.login(req.body);
			res.json({ user, token });
		} catch (err) {
			next(err);
		}
	}

	public async register(req, res, next) {
		try {
			const { user, token } = await AuthService.register(req.body);
			res.json({ user, token });
		} catch (err) {
			next(err);
		}
	}
}

export default new AuthController();