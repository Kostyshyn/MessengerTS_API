import * as express from 'express';
import { RouteItem, MFunction } from '@routes/index';
import { DBInterface } from '@root/database';
import { Mailer } from '@services/Mail';
import { notFoundErrorHandler, errorHandler } from '@error_handlers/index';
import { privateFolder } from '@middlewares/storage';

class App {

  public express: express.Application;
  private readonly privateFolder;

  constructor(
    private database: DBInterface,
    private mailer: Mailer,
    private middlewares: MFunction[],
    private routes: RouteItem[]
  ) {
    this.express = express();
    this.privateFolder = privateFolder;
  }

  public async run(): Promise<express.Application> {
    await this.connectDatabase(this.database);
    await this.runServices();
    this.mountMiddlewares(this.middlewares);
    this.mountRoutes(this.routes);
    this.errorHandlers();
    return this.express;
  }

  private async connectDatabase(database): Promise<void> {
    await database.setup();
  }

  private async runServices(): Promise<void> {
    await this.mailer.init();
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
