import * as express from 'express';
import middlewares from './middlewares';

class App {
  public express;

  constructor(
      private middlewares: any[],
      private routes: any[]
    ) {
    this.express = express();
    this.mountMiddlewares(middlewares);
    this.mountRoutes();
  }

  private mountMiddlewares(middlewares: any[]): void {
    for (const i in middlewares) {
      this.express.use(middlewares[i]);
    }
  }

  private mountRoutes(): void {
    const router = express.Router()
    router.get('/', (req, res, next) => {
      res.json({
        message: 'Hello World'
      });
    })
    this.express.use('/', router);
  }
}

export default new App(middlewares, []).express;