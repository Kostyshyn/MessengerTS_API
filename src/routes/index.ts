import * as express from 'express';
import routesConfig from './routes';
import { notFoundErrorHandler } from '@error_handlers/index';
import config from '@config/index';

export const DEF_MIDDLEWARE = [(req: express.Request, res: express.Response, next: express.NextFunction): any => next()];
const DEF_METHOD = 'get';
const DEF_CONTROLLER = notFoundErrorHandler;
const { ALLOWED_ROUTER_METHODS } = config;

export interface RouteItem {
  route: string;
  method?: string;
  middleware?: any[];
  controller?: any;
  children?: RouteItem[];
}

const routes: RouteItem[] = routesConfig;

function generateRoutes(router: express.Router, routes): express.Router {
  for (const i in routes) {
    const { 
      method = DEF_METHOD, 
      route, 
      middleware = DEF_MIDDLEWARE, 
      controller = DEF_CONTROLLER, 
      children = []
    } = routes[i];

    if (!ALLOWED_ROUTER_METHODS.includes(method)) {
      throw new Error(`'${ method }' - router method is forbidden`);
    }

    router[method](route, middleware, controller);

    if (children && children.length) {
      const childrenRoutes = generateRoutes(express.Router(), children);
      router.use(route, middleware, childrenRoutes);
    }
  }

  return router;
};

export default generateRoutes(express.Router(), routes);