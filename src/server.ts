import * as express from 'express';
import { RouteItem, MFunction } from '@routes/index';
import { notFoundErrorHandler, errorHandler } from '@error_handlers/index';
import { privateFolder } from '@middlewares/storage';

class App {

  public express;
  private readonly privateFolder;

  constructor(
      private database: any,
      private middlewares: MFunction[],
      private routes: RouteItem[]
    ) {
    this.express = express();
    this.privateFolder = privateFolder;
    this.connectDatabase(database);
    this.mountMiddlewares(middlewares);
    this.mountRoutes(routes);
    this.errorHandlers();
  }

  private connectDatabase(database): void {
    database.setup();
  }

  private mountMiddlewares(middlewares: MFunction[]): void {
    for (const i in middlewares) {
      this.express.use(middlewares[i]);
    }
    this.privateFolder(this.express);
  }

  private mountRoutes(routes): void {
    this.express.use('/', routes);
  }

  private errorHandlers(): void {
    // catch 404 and forward to error handler
    this.express.use(notFoundErrorHandler);

    // error handler
    this.express.use(errorHandler);
  }
}

export default App;