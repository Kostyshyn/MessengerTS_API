import * as mongoose from 'mongoose';
import { generateSort, generatePagination } from '@helpers/service';

export interface Dictionary<T> {
  [key: string]: T;
}

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

  protected delete<T>(
    model: mongoose.Model,
    query: object = {}
  ): Promise<T> {
    return model.deleteOne(query).catch(err => {
      throw err;
    });
  }

  protected async find<T>(
    model: mongoose.Model,
    query: object = {},
    options: ServiceOptionsInterface = {}
  ): Promise<PaginationInterface<T>> {
    const { limit, select, populate } = options;
    const sortFromQuery = options.sort;
    const fields = select.split(' ');
    const sort = generateSort(sortFromQuery, fields);
    const total = await this.count(model, query);
    const { page, ...restPagination } = generatePagination(
      options.page,
      total,
      limit
    );
    return model
      .find(query)
      .skip(limit * (page - 1))
      .sort(sort)
      .limit(limit)
      .select(select)
      .populate(populate)
      .exec()
      .then(data => {
        return Promise.resolve({
          data,
          total,
          page,
          limit,
          ...restPagination
        });
      })
      .catch(err => {
        throw err;
      });
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
