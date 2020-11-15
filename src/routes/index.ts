import * as express from 'express';
import routesConfig from './routes';
import { notFoundErrorHandler } from '@error_handlers/index';
import config from '@config/index';

export type R = express.Response | express.NextFunction;
export type CFunction = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => Promise<R>;

export type MFunction = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => express.NextFunction;

export const DEF_MIDDLEWARE: MFunction[] = [
  (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): express.NextFunction => next()
];
const DEF_ROUTE = '/';
const DEF_METHOD = 'get';
const DEF_CONTROLLER: CFunction = notFoundErrorHandler;
const { ALLOWED_ROUTER_METHODS } = config;
const ROUTE_PARAMS = { mergeParams: true };

export interface RouteItem {
  route?: string;
  method?: string;
  middleware?: MFunction[];
  controller?: CFunction;
  children?: RouteItem[];
}

const routes: RouteItem[] = routesConfig;

function generateRoutes(
  router: express.Router,
  routes: RouteItem[]
): express.Router {
  for (const i in routes) {
    const {
      method = DEF_METHOD,
      route = DEF_ROUTE,
      middleware = DEF_MIDDLEWARE,
      controller = DEF_CONTROLLER,
      children = []
    } = routes[i];

    if (!ALLOWED_ROUTER_METHODS.includes(method)) {
      throw new Error(`'${method}' - router method is forbidden`);
    }

    router[method](route, middleware, controller);

    if (children && children.length) {
      const childrenRoutes = generateRoutes(express.Router(ROUTE_PARAMS), children);
      router.use(route, middleware, childrenRoutes);
    }
  }

  return router;
};

export default generateRoutes(express.Router(ROUTE_PARAMS), routes);
