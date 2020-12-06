import config from '@config/index';
import { Origin, OriginModelInterface } from '@models/Origin';
import Service, { PaginationInterface, ServiceOptionsInterface } from '@services/index';
import RequestLogService from '@services/RequestLog/index';
import { HttpException, NotFoundError, ValidationError } from '@error_handlers/errors';
import { setOriginsCache } from '@cache/origin';
import select from '@data_lists/index';

const { PAGINATION } = config;

class OriginService extends Service {

  constructor() {
    super();
  }

  public async createOrigin(
    origin: OriginModelInterface
  ): Promise<OriginModelInterface> {
    const findOrigin = await this.findOne<OriginModelInterface>(Origin, {
      $or: [
        { 'name': origin.name },
        { 'origin_url': origin.origin_url }
      ]
    });

    if (findOrigin) {
      const match = findOrigin.name === origin.name ? 'name' : 'origin_url';
      throw new ValidationError({
        [match]: [`Origin with ${match} '${origin[match]}' is already exists`]
      });
    }

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

  public async updateOriginFields(
    id: string,
    fields: OriginModelInterface
  ): Promise<OriginModelInterface> {

    const findOrigin = await this.findOne<OriginModelInterface>(Origin, {
      '_id': {
        $ne: id
      },
      $or: [
        { 'name': fields.name },
        { 'origin_url': fields.origin_url }
      ]
    });

    if (findOrigin) {
      const match = findOrigin.name === fields.name ? 'name' : 'origin_url';
      throw new ValidationError({
        [match]: [`Origin with ${match} '${fields[match]}' is already exists`]
      });
    }

    const query = { _id: id };
    return this.updateOrigin(query, {
      $set: fields
    });
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
      await setOriginsCache();
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
        { 'origin_url': regex }
      ]
    };

    const { data, ...pagination } = await this.find<OriginModelInterface>(Origin, query, {
      ...options,
      select: select.string(selectFields),
      limit
    });

    // const aggregationQuery = {
    //   urlParts: {
    //     $nin : ['admin', 'storage'] // exclude 'admin', 'storage' paths
    //   },
    //   origin: {
    //     $in: data.map(o => o._id)
    //   }
    // };
    //
    // const meta = await RequestLogService.getStatsPerOrigin(aggregationQuery);

    const meta = await RequestLogService.getRequestAggregation(
      {
        urlParts: {
          $nin: ['admin', 'storage'] // exclude 'admin', 'storage' paths
        }
      },
      [
        {
          $lookup: {
            from: 'origins',
            localField: 'origin',
            foreignField: '_id',
            as: 'origin'
          }
          // $lookup: {
          //   from: 'origins',
          //   pipeline: [
          //     {
          //       $match: query
          //     }
          //   ],
          //   as: 'origin'
          // }
        },
        {
          $unwind: '$origin'
        },
        {
          $group: {
            _id: '$origin',
            total: { $sum: 1 }
          }
        }
      ]
    );

    return {
      data,
      meta,
      ...pagination,
    }
  }

  public async deleteOrigin(id: string): Promise<boolean> {
    const origin = await this.findOne<OriginModelInterface>(Origin, { _id: id }, {
      select: select.string('origin')
    });
    if (origin) {

      if (origin.isDefault) {
        throw new ValidationError({
          isDefault: ['You cannot delete default origin']
        });
      }

      await this.delete<OriginModelInterface>(Origin, { _id: id });
      await setOriginsCache();
      return true;
    }

    throw new NotFoundError('Origin');
  }

}

export default new OriginService();
