import { join, resolve } from 'path';
import * as fs from 'fs';
import { config } from 'dotenv';

const {
  env,
  cwd
} = process;

const { NODE_ENV } = env;

const envFile = join(cwd(), `.env.${NODE_ENV}`);

if (!fs.existsSync(envFile)) {
  throw new Error(`Environment variables: .env.${NODE_ENV} file is missing`);
}

config({ path: resolve(cwd(), `.env.${NODE_ENV}`) });
