import 'module-alias/register';
import * as http from 'http';
import * as colors from 'colors';
import * as os from 'os';
import * as ip from 'ip';
import * as cluster from 'cluster';
import * as fs from 'fs';
import App from '@root/server';
import DataBase from '@database/index';
import MailService from '@services/Mail/index';
import { resolve, join } from 'path';
import { config } from 'dotenv';

import middlewares from '@middlewares/index';
import routes from '@routes/index';

const {
  env,
  cwd,
  exit,
  pid
} = process;

const { NODE_ENV } = env;

const envFile = join(cwd(), `.env.${NODE_ENV}`);

if (!fs.existsSync(envFile)) {
  throw new Error(`Environment variables: .env.${NODE_ENV} file is missing`);
}

config({ path: resolve(cwd(), `.env.${NODE_ENV}`) });

function normalizePort(val): number | boolean {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
};

function onError(port) {
  return function (error): void {
    if (error.syscall !== 'listen') {
      throw error;
    }

    const bind = typeof port === 'string'
      ? 'Pipe ' + port
      : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges');
        exit(1);
        break;
      case 'EADDRINUSE':
        console.error(bind + ' is already in use');
        exit(1);
        break;
      default:
        throw error;
    }
  }
};

function runServer(): void {

  const {
    DB_HOST,
    DB_USERNAME,
    DB_PASSWORD,
    DB_URL,
    DB_NAME,
    PORT
  } = env;
  const dbAuth = `${DB_HOST}${DB_USERNAME}:${DB_PASSWORD}${DB_URL}/${DB_NAME}`;
  const database = new DataBase(`${dbAuth}`);
  const port = normalizePort(PORT || 8080);
  const app = new App(
    database,
    MailService,
    middlewares,
    routes
  );
  app.run().then(express => {
    const server = http.createServer(express);

    server.listen(port, () => {
      console.log(colors.green('Server listening on:'), ip.address() + ':' + port, '--- process: ' + pid);
    });
    server.on('error', onError(port));
  }).catch(onError(port));
}

if (NODE_ENV === 'production') {
  if (cluster.isMaster) {
    const cpuCount = os.cpus().length;

    // Create a worker for each CPU
    for (let i = 0; i < cpuCount; i++) {
      cluster.fork();
    }

  } else {
    runServer();
  }
} else {
  runServer();
}
