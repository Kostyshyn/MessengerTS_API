import * as mongoose from 'mongoose';

export interface PopulateInterface {
  path: string;
  select: string;
}

export interface ServiceOptionsInterface {
  page?: number;
  limit?: number;
  sort?: object;
  select?: string;
  populate?: PopulateInterface[] | PopulateInterface;
}

export interface PaginationInterface<T> {
  data: Array<T>;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  prevPage: boolean | number;
  nextPage: boolean | number;
}

class Service {

  protected create<T>(
    model: mongoose.Model,
    data: T
  ): Promise<T> {
    return model.create(data).catch(err => {
      throw err;
    });
  }

  protected async find<T>(
    model: mongoose.Model,
    query: object = {},
    options: ServiceOptionsInterface = {}
  ): Promise<PaginationInterface<T>> {
    const page = Math.abs(options.page) || 1;
    const total = await this.count(model, query);
    const totalPages = Math.ceil(total / options.limit);
    const prevPage = page !== 1 ? (page - 1) : false;
    const nextPage = page < totalPages ? (page + 1) : false;
    const q = model
      .find(query)
      .skip(options.limit * (page - 1))
      .sort(options.sort)
      .limit(options.limit)
      .select(options.select)
      .populate(options.populate)
      .exec()
      .then(data => {
        return Promise.resolve({
          data,
          total,
          page,
          limit: options.limit,
          totalPages,
          prevPage,
          nextPage
        });
      })
      .catch(err => {
        throw err;
      });
    return q;
  }

  protected findOne<T>(
    model: mongoose.Model,
    query: object,
    options: ServiceOptionsInterface = {}
  ): Promise<T> {
    const { select, populate } = options;
    return model
      .findOne(query)
      .select(select)
      .populate(populate)
      .exec()
      .catch(err => {
        throw err;
      });
  }

  protected updateOne<T>(
    model: mongoose.Model,
    query: object,
    fields: object,
    options: object,
    populate: PopulateInterface[] | PopulateInterface
  ): Promise<T> {
    return model
      .findOneAndUpdate(query, fields, options)
      .populate(populate)
      .catch(err => {
      throw err;
    });
  }

  protected findById<T>(
    model: mongoose.Model,
    id: string,
    options: ServiceOptionsInterface = {}
  ): Promise<T> {
    const { select, populate } = options;
    return model
      .findById(id)
      .select(select)
      .populate(populate)      
      .catch(err => {
        throw err;
      });
  }

  protected count(
    model: mongoose.Model,
    query: object
  ): Promise<number> {
    return model.countDocuments(query).catch(err => {
      throw err;
    });
  }

}

export default Service;