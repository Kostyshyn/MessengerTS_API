import { User, UserModelInterface } from '@models/User';
import Service from '@services/index';
import { HttpException, ValidationError } from '@error_handlers/errors';
import * as bcrypt from 'bcrypt-nodejs';
import * as jwt from 'jsonwebtoken';
import { showFields } from '@data_lists/index';
import { userSelf as userSelfFields } from '@data_lists/user';
import { userImageFields } from '@data_lists/image';
import { generateToken, validatePassword } from '@helpers/auth';

class AuthService extends Service {

  constructor() {
    super();
  }

  public async login(user: UserModelInterface): Promise<any> {

    const findUser = await this.findOne(User, {
      'username': user.username
    }, {
      select: `${ userSelfFields.join(' ') } password`,
      populate: [
        { path: 'profile_image', select: userImageFields.join(' ') }
      ]
    });

    if (findUser) {
      if (validatePassword(findUser, user.password)) {
        const token = generateToken({
          id: findUser._id
        });

        return {
          user: showFields(findUser, [...userSelfFields, '_id']),
          token
        };
      }

      throw new ValidationError({
        password: ['Invalid password']
      });
    }


    throw new ValidationError({
      username: [`${user.username} not found`]
    });

  }

  public async register(user: UserModelInterface): Promise<any> {

    const findUser = await this.findOne(User, {
      $or: [
        { 'username': user.username }, 
        { 'email': user.email }
      ]
    });

    if (findUser) {
      const match = findUser.username === user.username ? 'username' : 'email'
      throw new ValidationError({
        [match]: [`User with ${match} '${user[match]}' is already exists`]
      });
    }

    try {
      const userRecord = await this.create(User, user);

      const token = generateToken({
        id: userRecord._id
      });

      return {
        user: {
          ...showFields(userRecord, [...userSelfFields, '_id']),
          profile_image: showFields(userRecord.profile_image, userImageFields)
        },
        token
      };
    } catch (err) {
      throw new HttpException(500, err.message);
    }   
  }
}

export default new AuthService();