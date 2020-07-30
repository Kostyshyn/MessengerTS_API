import DataBase from '@database/index';
import Service from '@services/index';
import { resolve, join } from 'path';
import { config } from 'dotenv';
import * as fs from 'fs';
import { Model } from 'mongoose';

class SeedService extends Service {

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

const seedService = new SeedService();

class Seeder {

	constructor(
		private model: Model,
		private options: any = {}
	) {}

	public async setup() {
		const { NODE_ENV } = process.env;

		const envFile = join(process.cwd(), `.env.${ NODE_ENV }`);

		if (!fs.existsSync(envFile)) {
		  throw new Error(`Environment variables: .env.${ NODE_ENV } file is missing`);
		}

		config({ path: resolve(process.cwd(), `.env.${ NODE_ENV }`) });

		const {
	    DB_HOST,
	    DB_USERNAME,
	    DB_PASSWORD,
	    DB_URL,
	    DB_NAME,
	    PORT
	  } = process.env;
	  const dbAuth = `${DB_HOST}${DB_USERNAME}:${DB_PASSWORD}${DB_URL}/${DB_NAME}`
	  const database = new DataBase(`${dbAuth}`);
	  await database.setup();
	}

	public async seed<T>() {
		try {
			await this.setup();
			const { count, generator, drop } = this.options;
			let pointer = 1;
			if (drop) {
				await this.model.collection.drop();
			} else {
				pointer = await seedService.countRecords(this.model) + 1;
			}
			for (let index = pointer; index <= (count + pointer); index++) {
				const data: T = generator({ index });
				const result = await seedService.createRecord<T>(this.model, data);
				console.log(result);
			}
			process.exit(0);
		} catch (err) {
			throw err;
		}
	}

}

export default Seeder;