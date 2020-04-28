import config from '@config/index';
import { User, UserModelInterface } from '@models/User';
import Service from '@services/index';
import { NotFoundError, HttpException, TokenVerificationError } from '@error_handlers/errors';
import { showFields } from '@data_lists/index';
import { userSelf as userShowSelfData, user as userShowData, userList } from '@data_lists/user';
import { userImage } from '@data_lists/image';
const { PAGINATION } = config;

class UserService extends Service {

  constructor() {
    super();
  }

  public async getUser(id: string): Promise<any> {

    const user = await this.findById(User, id, {
      select: userShowSelfData.join(' '),
      populate: [
        { path: 'profile_image', select: userImage.join(' ') },
        { path: 'profile_images', select: userImage.join(' ') }
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
      { path: 'profile_image', select: userImage.join(' ') },
      { path: 'profile_images', select: userImage.join(' ') }
    ];

    const updatedUser = await this.updateOne(User, query, fields, options, populate);

    if (updatedUser) {
      return {
        user: updatedUser
      };
    }

    throw new TokenVerificationError('Token verification failed')
  }

  public updateUserFields(id: string, fields: any): Promise<any> {
    return this.updateUser(id, {
      $set: fields
    });
  }

  public updateUserImages(id: string, image: any): Promise<any> {
    return this.updateUser(id, {
      $set: {
        profile_image: {
          _id: image._id.toString()
        }
      },
      $push: {
        profile_images: {
          $each: [
          {
            _id: image._id.toString()
          }
          ],
          $position: 0
        }
      }
    });  
  }

  public async getUsers(options): Promise<any> {
    const { keyword } = options;
    const limit = Math.abs(options.limit) || PAGINATION['User'].PER_PAGE;
    const regex = new RegExp(keyword, 'i');
    const query = {
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
      populate: { path: 'profile_image', select: userImage.join(' ') }
    });

    return users;
  }

  public async getUserByUrl(url: string): Promise<any> {

    const user = await this.findOne(User, { url }, {
      select: userShowData.join(' '),
      populate: [
        { path: 'profile_image', select: userImage.join(' ') },
        { path: 'profile_images', select: userImage.join(' ') }
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