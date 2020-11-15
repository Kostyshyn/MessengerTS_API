import config from '@config/index';
import {
  User,
  UserModelInterface,
  UserUpdateFieldsInterface
} from '@models/User';
import Service, { PaginationInterface, ServiceOptionsInterface } from '@services/index';
import {
  NotFoundError,
  ValidationError
} from '@error_handlers/errors';
import select from '@data_lists/index';

const { PAGINATION } = config;

class UserService extends Service {

  constructor() {
    super();
  }

  public async getUser(
    id: string
  ): Promise<UserModelInterface> {

    const user = await this.findById<UserModelInterface>(User, id, {
      select: select.string('userSelf'),
      populate: [
        {
          path: 'profile_image',
          select: select.string('profileImage')
        }
      ]
    });

    if (user) {
      return user;
    }

    throw new NotFoundError('User');
  }

  public async updateUser(
    id: string,
    fields: object
  ): Promise<UserModelInterface> {

    const query = { _id: id };
    const options = {
      'fields': select.string('userSelf'),
      new: true
    };
    const populate = [
      {
        path: 'profile_image',
        select: select.string('profileImage')
      }
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

    throw new NotFoundError('User');
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
    id = '',
    keyword = '',
    options: ServiceOptionsInterface = {},
    selectFields = 'users'
  ): Promise<PaginationInterface<UserModelInterface>> {
    const limit = Math.abs(options.limit) || PAGINATION['User'].PER_PAGE;
    const sanitized = keyword.replace(/\\/g, '').trim();
    const regex = new RegExp(sanitized, 'i');
    const exceptId = (id): object => (id ? {
      '_id': {
        $ne: id
      }
    } : {});
    const query = {
      ...exceptId(id),
      // TODO: dynamic text fields for search
      $or: [
        { 'username': regex },
        { 'first_name': regex },
        { 'last_name': regex }
      ]
    };
    return this.find<UserModelInterface>(User, query, {
      ...options,
      select: select.string(selectFields),
      limit,
      populate: {
        path: 'profile_image',
        select: select.string('profileImage')
      }
    });
  }

  public async getUserBy(query: object = {}): Promise<UserModelInterface> {

    const user = await this.findOne<UserModelInterface>(User, query, {
      select: select.string('user'),
      populate: [
        {
          path: 'profile_image',
          select: select.string('profileImage')
        }
      ]
    });

    if (user) {
      return user;
    }

    throw new NotFoundError('User');
  }

}

export default new UserService();
