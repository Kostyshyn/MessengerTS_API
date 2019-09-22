import * as http from 'http';
import * as colors from 'colors';
import * as os from 'os';
import * as ip from 'ip';
import * as cluster from 'cluster'
import app from './server';
import { resolve } from 'path';
import { config } from 'dotenv';

const port = normalizePort(process.env.PORT || 8080);

if (process.env.NODE_ENV === 'production') {
  if (cluster.isMaster) {
    const cpuCount = os.cpus().length;

    // Create a worker for each CPU
    for (let i = 0; i < cpuCount; i++) {
      cluster.fork();
    }

  } else {
    runServer(process.env.NODE_ENV);
  }
} else {
  runServer(process.env.NODE_ENV);
}

function runServer(env: string): void {

  let envFile: string;

  if (env === 'production') {
    envFile = '../env';
  } else {
    envFile = '../env.dev';
  }

  config({ path: resolve(__dirname, envFile) });

  const server = http.createServer(app);

  server.listen(port, () => {
    console.log(colors.green('Server listenning on:'), ip.address() + ':' + port, '--- process: ' + process.pid);
  });
  server.on('error', onError);
};

function normalizePort(val) {
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

function onError(error): void {
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
};
