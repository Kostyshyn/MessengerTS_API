import 'module-alias/register';
import * as faker from 'faker';
import Seeder from '@seeds/index';
import { User, UserModelInterface } from '@models/User';

const count = 10;
const nameFn = () => faker.name.firstName().replace(/[`'"]/gi, '');
const lastNameFn = () => faker.name.lastName().replace(/[`'"]/gi, '');
const usernameFn = index => `test_user_gen_${index}`;
const emailFn = () => faker.internet.email();
const DEF_PASSWORD = 123456;

export const UserSeeder = new Seeder(User, {
  count,
  drop: true,
  generator: ({ index }) => ({
  first_name: nameFn(),
    last_name: lastNameFn(),
    username: usernameFn(index),
    email: emailFn(),
    password: DEF_PASSWORD
  })
});

UserSeeder.seed<UserModelInterface>();
