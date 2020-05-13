import * as http from 'http';
import * as colors from 'colors';
import * as os from 'os';
import 'module-alias/register';
import * as ip from 'ip';
import * as cluster from 'cluster';
import * as fs from 'fs';
import * as path from 'path';
import App from '@root/server';
import DataBase from '@database/index';
import { resolve } from 'path';
import { config } from 'dotenv';

import middlewares from '@middlewares/index';
import routes from '@routes/index';

const { NODE_ENV } = process.env;

const envFile = path.join(__dirname, `../.env.${ NODE_ENV }`);

if (!fs.existsSync(envFile)) {
  throw new Error(`Environment variables: .env.${ NODE_ENV } file is missing`);
}

config({ path: resolve(__dirname, `../.env.${ NODE_ENV }`) });

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
  return function(error): void {
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
        process.exit(1);
      break;
      case 'EADDRINUSE':
        console.error(bind + ' is already in use');
        process.exit(1);
      break;
      default:
        throw error;
    }
  }
};

function runServer(): void {

  const { DB_HOST, DB_URL, PORT } = process.env;
  const database = new DataBase(`${ DB_HOST }${ DB_URL }`);
  const port = normalizePort(PORT || 8080);
  const app = new App(database, middlewares, routes).express;
  const server = http.createServer(app);

  server.listen(port, () => {
    console.log(colors.green('Server listenning on:'), ip.address() + ':' + port, '--- process: ' + process.pid);
  });
  server.on('error', onError(port));
};

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