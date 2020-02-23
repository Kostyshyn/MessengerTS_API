import Controller from '@controllers/index';
import UserService from '@services/User/index';

class UploadController extends Controller {

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

}

export default new UploadController();