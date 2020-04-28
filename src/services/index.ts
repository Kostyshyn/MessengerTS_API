class Service {

  protected create(model: any, data: any): Promise<any> {
    return model.create(data).catch(err => {
      throw err;
    });
  }

  protected async find(model: any, query: any = {}, options: any = {}): Promise<any> {
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

  protected findOne(model: any, query: any, options: any = {}): Promise<any> {
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

  protected updateOne(model: any, query: any, fields: any, options: any, populate: any = {}): Promise<any> {
    return model
      .findOneAndUpdate(query, fields, options)
      .populate(populate)
      .catch(err => {
      throw err;
    });
  }

  protected findById(model: any, id: string, options: any = {}): Promise<any> {
    const { select, populate } = options;
    return model
      .findById(id)
      .select(select)
      .populate(populate)      
      .catch(err => {
        throw err;
      });
  }

  protected count(model: any, query: any): Promise<any> {
    return model.countDocuments(query).catch(err => {
      throw err;
    });
  }

}

export default Service;