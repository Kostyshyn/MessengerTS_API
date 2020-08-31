import Service from '@services/index';
import { Model } from 'mongoose';

class SeedService extends Service {

  constructor() {
    super();
  }

  public createRecord<T>(
    model: Model,
    data: T
    ): Promise<T> {
    return this.create<T>(model, data);
  }

  public countRecords(
    model: Model,
    query: object = {}
    ): Promise<number> {
    return this.count(model, query);
  }

}

export default new SeedService();
