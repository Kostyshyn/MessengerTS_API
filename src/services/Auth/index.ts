import { User, UserModelInterface } from '@models/User';
import Service from '@services/index';
import { HttpException, ValidationError } from '@error_handlers/errors';
import * as bcrypt from 'bcrypt-nodejs';
import * as jwt from 'jsonwebtoken';
import { showFields } from '@data_lists/index';
import { userSelf as userShowSelfData } from '@data_lists/user';
import { userImage } from '@data_lists/image';

class AuthService extends Service {

  constructor() {
    super();
  }

  public async login(user: UserModelInterface): Promise<any> {

    const findUser = await this.findOne(User, {
      'username': user.username
    }, {
      select: `${ userShowSelfData.join(' ') } password`,
      populate: [
        { path: 'profile_image', select: userImage.join(' ') },
        { path: 'profile_images', select: userImage.join(' ') }
      ]
    });

    if (findUser) {
      if (this.validatePassword(findUser, user.password)) {
        const token = this.generateToken({
          id: findUser._id,
          username: findUser.username
        });

        return {
          user: showFields(findUser, [...userShowSelfData, '_id']),
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

      const token = this.generateToken({
        id: userRecord._id,
        username: userRecord.username // this is required to upload a files (destination directory)
      });

      return {
        user: {
          ...showFields(userRecord, [...userShowSelfData, '_id']),
          profile_image: showFields(userRecord.profile_image, userImage),
          profile_images: userRecord.profile_images
        },
        token
      };
    } catch (err) {
      throw new HttpException(500, err.message);
    }   
  }

  private generateToken(payload: any): string {
    const { SECRET_AUTH_KEY, EXPIRES_TOKEN } = process.env;
    const token: string = jwt.sign(payload, SECRET_AUTH_KEY, {
      expiresIn: parseInt(EXPIRES_TOKEN)
    });
    return token;
  }

  private validatePassword(user: UserModelInterface, password: string): any {
    return bcrypt.compareSync(password, user.password);
  }

}

export default new AuthService();