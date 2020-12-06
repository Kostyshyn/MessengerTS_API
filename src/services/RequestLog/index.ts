import config from '@config/index';
import { RequestLog, RequestLogModelInterface } from '@models/RequestLog';
import Service, { PaginationInterface, ServiceOptionsInterface } from '@services/index';
import { HttpException, NotFoundError } from '@error_handlers/errors';
import select from '@data_lists/index';

const { PAGINATION } = config;

class RequestLogService extends Service {

  constructor() {
    super();
  }

  public async createRequestLog(
    request: RequestLogModelInterface
  ): Promise<RequestLogModelInterface> {

    try {
      return await this.create<RequestLogModelInterface>(RequestLog, request);
    } catch (err) {
      throw new HttpException(500, err.message);
    }
  }

  public async getRequestLogBy(
    query: object = {}
  ): Promise<RequestLogModelInterface> {

    const requestLog = await this.findOne<RequestLogModelInterface>(RequestLog, query, {
      select: select.string('requestLog')
    });

    if (requestLog) {
      return requestLog;
    }

    throw new NotFoundError('RequestLog');
  }

  public async getRequestLogs(
    keyword = '',
    options: ServiceOptionsInterface = {},
    selectFields = 'requestLogs'
  ): Promise<PaginationInterface<RequestLogModelInterface>> {
    const limit = Math.abs(options.limit) || PAGINATION['RequestLog'].PER_PAGE;
    const sort = options.sort || { createdAt: 'desc' };
    const sanitized = keyword.replace(/\\/g, '').trim();
    const regex = new RegExp(sanitized, 'i');
    const query = {
      urlParts: {
        $nin : ['admin', 'storage'] // exclude 'admin', 'storage' paths
      },
      $or: [
        { 'ip': regex },
        { 'originalUrl': regex },
        { 'url': regex },
        { 'method': regex }
      ]
    };

    // const statsPerRoute = await this.getStatsPerRoute(query);
    // const statsPerModule = await this.getStatsPerModule(query);
    // const getStatsPerOrigin = await this.getStatsPerOrigin(query);
    // //
    // console.log({ statsPerRoute, statsPerModule, getStatsPerOrigin });

    return this.find<RequestLogModelInterface>(RequestLog, query, {
      ...options,
      select: select.string(selectFields),
      limit,
      sort,
      populate: {
        path: 'origin',
        select: select.string('origin')
      }
    });
  }

  public async getRequestAggregation(
    query: object,
    aggregation: object[]
  ): Promise<object[]> {
    const prepare = [
      {
        $match: query
      }
    ];
    return this.aggregate<object>(RequestLog, [
      ...prepare,
      ...aggregation
    ])
  }

  public async getStatsPerRoute(query: object): Promise<object[]> {
    return this.getRequestAggregation(
      query,
      [
        {
          $group: {
            _id: { url: '$url', method: '$method' },
            responseTime: { $avg: '$responseTime' },
            total: { $sum: 1 }
          }
        }
      ]
    );
  }

  public async getStatsPerModule(query: object): Promise<object[]> {
    return this.getRequestAggregation(
      query,
      [
        {
          $unwind: '$urlParts'
        },
        {
          $group: {
            _id: '$_id',
            urlParts: { $first: '$urlParts' }
          }
        },
        {
          $group: {
            _id: '$urlParts',
            total: { $sum: 1 }
          }
        }
      ]
    );
  }

  public async getStatsPerOrigin(query: object): Promise<object[]> {
    return this.getRequestAggregation(
      query,
      [
        {
          $group: {
            _id: '$origin',
            total: { $sum: 1 }
          }
        }
      ]
    );
  }

}

export default new RequestLogService();
