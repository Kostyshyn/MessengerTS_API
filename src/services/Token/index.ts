import { Token, TokenModelInterface, TokenType } from '@models/Token';
import Service from '@services/index';
import { HttpException, NotFoundError } from '@error_handlers/errors';
import { generateRandomToken } from '@helpers/auth';

class TokenService extends Service {

  constructor() {
    super();
  }

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
      const { value } = await this.create<TokenModelInterface>(Token, token);
      return value;
    } catch (err) {
      throw new HttpException(500, err.message);
    }
  }

  public async getToken(
    query: object
  ): Promise<TokenModelInterface> {

    const token = await this.findOne<TokenModelInterface>(Token, query);
    if (token) {
      return token;
    }

    throw new NotFoundError('Token');
  }

  public async deleteToken(id: string): Promise<TokenModelInterface> {

    return this.delete<TokenModelInterface>(Token, { _id: id });
  }

}

export default new TokenService();
