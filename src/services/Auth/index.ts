import {
  User,
  UserModelInterface,
  UserUpdatePasswordInterface
} from '@models/User';
import Service from '@services/index';
import UserService from '@services/User/index';
import { HttpException, NotFoundError, ValidationError } from '@error_handlers/errors';
import { showFields } from '@data_lists/index';
import { userSelf as userSelfFields } from '@data_lists/user';
import { userImageFields } from '@data_lists/image';
import { validatePassword, generatePassword } from '@helpers/auth';

class AuthService extends Service {

  constructor() {
    super();
  }

  public async login(user: UserModelInterface): Promise<UserModelInterface> {

    const findUser = await this.findOne<UserModelInterface>(User, {
      'username': user.username
    }, {
      select: `${userSelfFields.join(' ')} password`,
      populate: [
        { path: 'profile_image', select: userImageFields.join(' ') }
      ]
    });

    if (findUser) {
      const isValidPass = await validatePassword(findUser.password, user.password);
      if (isValidPass) {
        return showFields(findUser, [...userSelfFields, '_id']);
      }

      throw new ValidationError({
        password: ['Invalid password']
      });
    }


    throw new ValidationError({
      username: [`${user.username} not found`]
    });

  }

  public async register(user: UserModelInterface): Promise<UserModelInterface> {

    const findUser = await this.findOne<UserModelInterface>(User, {
      $or: [
        { 'username': user.username },
        { 'email': user.email }
      ]
    });

    if (findUser) {
      const match = findUser.username === user.username ? 'username' : 'email';
      throw new ValidationError({
        [match]: [`User with ${match} '${user[match]}' is already exists`]
      });
    }

    try {
      const userRecord = await this.create(User, user);

      return {
        ...showFields(userRecord, [...userSelfFields, '_id'])
      };
    } catch (err) {
      throw new HttpException(500, err.message);
    }
  }

  public async updateUserPassword(
    id: string,
    payload: UserUpdatePasswordInterface
  ): Promise<UserModelInterface> {
    const findUser = await this.findById<UserModelInterface>(User, id, { select: 'password' });

    if (findUser) {
      const isSamePass = await validatePassword(findUser.password, payload.password);
      if (!isSamePass) {
        const password = await generatePassword(payload.password);
        return UserService.updateUser(id, {
          $set: { password }
        });
      }

      throw new ValidationError({
        password: ['New password cannot be the same as your old password']
      });
    }

    throw new NotFoundError('User');
  }
}

export default new AuthService();
