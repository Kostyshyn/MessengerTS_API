import UserService from '@services/User/index';
import FileService from '@services/File/index';
import Controller from '@controllers/index';

class UserController extends Controller {

  constructor() {
    super();
  }

  public async fetchUser(req, res, next) {
    try {
      const { id } = req.decoded;
      const { user } = await UserService.getUser(id);
      res.json({ user });
    } catch (err) {
      next(err);
    }
  }

  public async updateUserInfo(req, res, next) {
    try {
      const { id } = req.decoded;
      const { first_name, last_name, username } = req.body;
      const { user } = await UserService.updateUserFields(id, {
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
    try {
      const { id } = req.decoded;
      const { page, limit, keyword } = req.query;
      const users = await UserService.getUsers(id, {
        page,
        limit,
        keyword
      });
      res.json(users);
    } catch (err) {
      next(err);
    }
  }

  public async getUserByUrl(req, res, next) {
    try {
      const { url } = req.params;
      const { user } = await UserService.getUserByUrl(url);
      res.json({ user });
    } catch (err) {
      next(err);
    }
  }

  public async getUserImages(req, res, next) {
    try {
      const { id } = req.decoded;
      const images = await FileService.getUserImages(id);
      res.json({ images });
    } catch (err) {
      next(err);
    }
  }
}

export default new UserController();