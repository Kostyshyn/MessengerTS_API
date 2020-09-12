import { Token, TokenModelInterface, TokenType } from '@models/Token';
import Service from '@services/index';
import { HttpException, TokenVerificationError } from '@error_handlers/errors';
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
    value: string
  ): Promise<TokenModelInterface> {

    const token = await this.findOne<TokenModelInterface>(Token, { value });
    if (token) {
      return token;
    }

    throw new TokenVerificationError('Token verification failed');
  }

  public async deleteToken(id: string): Promise<TokenModelInterface> {

    return this.delete<TokenModelInterface>(Token, { _id: id });
  }

}

export default new TokenService();
