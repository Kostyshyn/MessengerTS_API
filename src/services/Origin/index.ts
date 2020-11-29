import config from '@config/index';
import { Origin, OriginModelInterface } from '@models/Origin';
import Service, { PaginationInterface, ServiceOptionsInterface } from '@services/index';
import { HttpException, NotFoundError } from '@error_handlers/errors';
import select from '@data_lists/index';

const { PAGINATION } = config;

class OriginService extends Service {

  constructor() {
    super();
  }

  public async createOrigin(
    origin: OriginModelInterface
  ): Promise<OriginModelInterface> {
    try {
      return await this.create<OriginModelInterface>(Origin, origin);
    } catch (err) {
      throw new HttpException(500, err.message);
    }
  }

  public async getOrigin(
    id: string
  ): Promise<OriginModelInterface> {

    const origin = await this.findById<OriginModelInterface>(Origin, id, {
      select: select.string('origin')
    });

    if (origin) {
      return origin;
    }

    throw new NotFoundError('Origin');
  }

  public async getOriginBy(query: object = {}): Promise<OriginModelInterface> {

    const origin = await this.findOne<OriginModelInterface>(Origin, query, {
      select: select.string('origin')
    });

    if (origin) {
      return origin;
    }

    throw new NotFoundError('Origin');
  }

  public async updateOrigin(
    query: object,
    fields: object,
    options?: object
  ): Promise<OriginModelInterface> {

    const updatedOrigin = await this.updateOne<OriginModelInterface>(
      Origin,
      query,
      fields,
      {
        'fields': select.string('origin'),
        new: true,
        ...options
      }
    );

    if (updatedOrigin) {
      return updatedOrigin;
    }

    throw new NotFoundError('Origin');
  }

  public async getOrigins(
    keyword = '',
    options: ServiceOptionsInterface = {},
    selectFields = 'origins'
  ): Promise<PaginationInterface<OriginModelInterface>> {
    const limit = Math.abs(options.limit) || PAGINATION['Origin'].PER_PAGE;
    const sanitized = keyword.replace(/\\/g, '').trim();
    const regex = new RegExp(sanitized, 'i');
    const query = {
      $or: [
        { 'name': regex },
        { 'origin': regex }
      ]
    };
    return this.find<OriginModelInterface>(Origin, query, {
      ...options,
      select: select.string(selectFields),
      limit
    });
  }

}

export default new OriginService();
