import UserService from '@services/User/index';
import Controller from '@controllers/index';

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

  public async updateUserInfo(req, res, next) {

    const { first_name, last_name, username } = req.body;

    try {
      const { user } = await UserService.updateUser(req.decoded.id, {
        first_name,
        last_name,
        username
      });
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