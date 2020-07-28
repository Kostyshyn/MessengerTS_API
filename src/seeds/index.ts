import DataBase from '@database/index';
import Service from '@services/index';
import { resolve, join } from 'path';
import { config } from 'dotenv';
import * as fs from 'fs';

class SeedService extends Service {

	public createRecord(model): Promise<any> {
		// test
		return this.count(model, {});
	}

}

const seedService = new SeedService();

class Seeder {

	constructor(
		private model: any,
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

	public async seed() {
		await this.setup();
		const result = await seedService.createRecord(this.model);
		console.log('Seeder:', result);
		process.exit(0);
	}

}

export default Seeder;