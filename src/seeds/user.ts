import 'module-alias/register';
import * as faker from 'faker';
import Seeder from '@seeds/index';
import { User, UserModelInterface } from '@models/User';

const usernameFn = index => `test_user_gen_${index}`;
const DEF_PASSWORD = 123456;

export const UserSeeder = new Seeder(User, {
	count: 5,
	drop: false,
	generator: ({ index }) => ({
		first_name: faker.name.firstName(),
		last_name: faker.name.lastName(),
		username: usernameFn(index),
		email: faker.internet.email(),
		password: DEF_PASSWORD
	})
});

UserSeeder.seed<UserModelInterface>();
