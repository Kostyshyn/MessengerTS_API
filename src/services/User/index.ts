import config from '@config/index';
import {
  User,
  UserModelInterface,
  UserUpdateFieldsInterface
} from '@models/User';
import Service, { PaginationInterface, ServiceOptionsInterface } from '@services/index';
import {
  NotFoundError,
  TokenVerificationError,
  ValidationError
} from '@error_handlers/errors';
import {
  userSelf as userSelfFields,
  user as userFields,
  userList as userListFields
} from '@data_lists/user';
import { userImageFields } from '@data_lists/image';

const { PAGINATION } = config;

class UserService extends Service {

  constructor() {
    super();
  }

  public async getUser(
    id: string
  ): Promise<UserModelInterface> {

    const user = await this.findById<UserModelInterface>(User, id, {
      select: userSelfFields.join(' '),
      populate: [
        { path: 'profile_image', select: userImageFields.join(' ') }
      ]
    });

    if (user) {
      return user;
    }

    throw new NotFoundError('User not found');
  }

  public async updateUser(
    id: string,
    fields: object
  ): Promise<UserModelInterface> {

    const query = { _id: id };
    const options = { 'fields': userSelfFields.join(' '), new: true };
    const populate = [
      { path: 'profile_image', select: userImageFields.join(' ') }
    ];

    const updatedUser = await this.updateOne<UserModelInterface>(
      User,
      query,
      fields,
      options,
      populate
    );

    if (updatedUser) {
      return updatedUser;
    }

    throw new NotFoundError('User not found');
  }

  public async updateUserFields(
    id: string,
    fields: UserUpdateFieldsInterface
  ): Promise<UserModelInterface> {
    if (fields.hasOwnProperty('username')) {
      const findUser = await this.findOne<UserModelInterface>(User, {
        '_id': {
          $ne: id
        },
        'username': fields.username
      });
      if (findUser) {
        throw new ValidationError({
          username: [`User with username '${fields.username}' is already exists`]
        });
      } else {
        fields = {
          ...fields,
          url: '@' + fields.username
        }
      }
    }
    return this.updateUser(id, {
      $set: fields
    });
  }

  public async getUsers(
    id: string,
    keyword: string,
    options: ServiceOptionsInterface
  ): Promise<PaginationInterface<UserModelInterface>> {
    const limit = Math.abs(options.limit) || PAGINATION['User'].PER_PAGE;
    const sanitized = keyword.replace(/\\/g, '').trim();
    const regex = new RegExp(sanitized, 'i');
    const query = {
      '_id': {
        $ne: id
      },
      // TODO: dynamic search fields
      $or: [
        { 'username': regex },
        { 'first_name': regex },
        { 'last_name': regex }
      ]
    };
    return await this.find<UserModelInterface>(User, query, {
      ...options,
      select: userListFields.join(' '),
      limit,
      populate: {
        path: 'profile_image', select: userImageFields.join(' ')
      }
    });
  }

  public async getUserBy(query: object = {}): Promise<UserModelInterface> {

    const user = await this.findOne<UserModelInterface>(User, query, {
      select: userFields.join(' '),
      populate: [
        { path: 'profile_image', select: userImageFields.join(' ') }
      ]
    });

    if (user) {
      return user;
    }

    throw new NotFoundError('User not found');
  }

  public async getUserById(id: string): Promise<UserModelInterface> {

    return this.getUserBy({ _id: id });
  }

  public async getUserByUrl(url: string): Promise<UserModelInterface> {

    return this.getUserBy({ url });
  }

}

export default new UserService();
