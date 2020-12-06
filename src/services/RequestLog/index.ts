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
    const sanitized = keyword.replace(/\\/g, '').trim();
    const regex = new RegExp(sanitized, 'i');
    const query = {
      $or: [
        { 'ip': regex },
        { 'originalUrl': regex },
        { 'url': regex },
        { 'method': regex }
      ]
    };
    return this.find<RequestLogModelInterface>(RequestLog, query, {
      ...options,
      select: select.string(selectFields),
      limit
    });
  }

}

export default new RequestLogService();
