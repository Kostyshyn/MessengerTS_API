import config from '@config/index';
import { User, UserModelInterface } from '@models/User';
import Service from '@services/index';
import {
  NotFoundError,
  HttpException,
  TokenVerificationError,
  ValidationError
} from '@error_handlers/errors';
import { showFields } from '@data_lists/index';
import { userSelf as userShowSelfData, user as userShowData, userList } from '@data_lists/user';
import { userImageFields } from '@data_lists/image';
const { PAGINATION } = config;

class UserService extends Service {

  constructor() {
    super();
  }

  public async getUser(id: string): Promise<any> {

    const user = await this.findById(User, id, {
      select: userShowSelfData.join(' '),
      populate: [
        { path: 'profile_image', select: userImageFields.join(' ') }
      ]
    });

    if (user) {
      return {
        user
      };
    }

    throw new TokenVerificationError('Token verification failed')
  }

  public async updateUser(id: string, fields: any): Promise<any> {

    const query = { _id: id };
    const options = { 'fields': userShowSelfData.join(' '), new: true };
    const populate = [
      { path: 'profile_image', select: userImageFields.join(' ') }
    ];

    const updatedUser = await this.updateOne(User, query, fields, options, populate);

    if (updatedUser) {
      return {
        user: updatedUser
      };
    }

    throw new TokenVerificationError('Token verification failed')
  }

  public async updateUserFields(id: string, fields: any): Promise<any> {
    if (fields.hasOwnProperty('username')) {
      const findUser = await this.findOne(User, {
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

  public async getUsers(id: string, options: any): Promise<any> {
    const { keyword } = options;
    const limit = Math.abs(options.limit) || PAGINATION['User'].PER_PAGE;
    const regex = new RegExp(keyword, 'i');
    const query = {
      '_id': {
        $ne: id
      },
      $or: [
        { 'username': regex }, 
        { 'first_name': regex },
        { 'last_name': regex }
      ]
    };
    const users = await this.find(User, query, {
      ...options,
      select: userList.join(' '),
      limit,
      populate: {
        path: 'profile_image', select: userImageFields.join(' ')
      }
    });

    return users;
  }

  public async getUserByUrl(url: string): Promise<any> {

    const user = await this.findOne(User, { url }, {
      select: userShowData.join(' '),
      populate: [
        { path: 'profile_image', select: userImageFields.join(' ') }
      ]
    });

    if (user) {
      return {
        user
      };
    }

    throw new NotFoundError(`${ url } not found`);
  }

}

export default new UserService();