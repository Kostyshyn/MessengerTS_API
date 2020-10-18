import * as mongoose from 'mongoose';
import { ConfirmToken, ResetToken, TokenModelInterface, TokenType } from '@models/Token';
import Service, { Dictionary } from '@services/index';
import { HttpException, NotFoundError } from '@error_handlers/errors';
import { generateRandomToken } from '@helpers/auth';

class TokenService extends Service {

  constructor() {
    super();
  }

  private tokens: Dictionary<mongoose.Model> = {
    'confirm': ConfirmToken,
    'reset': ResetToken
  };

  public async createToken(
    user: string,
    type: TokenType
  ): Promise<string> {
    try {
      const token = {
        value: await generateRandomToken(16),
        type,
        user
      };
      const tokenModel = this.tokens[type];
      const { value } = await this.create<TokenModelInterface>(tokenModel, token);
      return value;
    } catch (err) {
      throw new HttpException(500, err.message);
    }
  }

  public async getToken(
    query: object,
    type: TokenType
  ): Promise<TokenModelInterface> {
    const tokenModel = this.tokens[type];
    const token = await this.findOne<TokenModelInterface>(tokenModel, query);
    if (token) {
      return token;
    }

    throw new NotFoundError('Token');
  }

  public async deleteToken(
    id: string,
    type: TokenType
  ): Promise<TokenModelInterface> {
    const tokenModel = this.tokens[type];
    return this.delete<TokenModelInterface>(tokenModel, { _id: id });
  }

}

export default new TokenService();
