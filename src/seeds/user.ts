import 'module-alias/register';
import Seeder from '@seeds/index';
import { User, UserModelInterface } from '@models/User';

export const UserSeeder = new Seeder(User, {
	count: 100,
	drop: true,
	generator: () => {}
});

UserSeeder.seed();
