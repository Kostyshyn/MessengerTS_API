class Service {

	protected create(model: any, data: any): Promise<any> {
		return model.create(data).catch(err => {
			throw err;
		});
	}

	protected findOne(model: any, query: any): Promise<any> {
		return model.findOne(query).catch(err => {
			throw err;
		});
	}

	protected findById(model: any, id: string): Promise<any> {
		return model.findById(id).catch(err => {
			throw err;
		});
	}

}

export default Service;