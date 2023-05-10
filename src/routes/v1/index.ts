import express, { Router } from "express";

import config from "../../config/config";
import docsRoute from "./swagger.route";
import restaurantRoute from "./restaurant.route";
import menuRouter from "./menu.route";

const router = express.Router();

interface IRoute {
  path: string;
  route: Router;
}

const defaultIRoute: IRoute[] = [
  {
    path: "/menu",
    route: menuRouter,
  },
  {
    path: "/",
    route: restaurantRoute,
  },
];

const devIRoute: IRoute[] = [
  // IRoute available only in development mode
  {
    path: "/docs",
    route: docsRoute,
  },
];
/* istanbul ignore next */
if (config.env === "development") {
  devIRoute.forEach((route) => {
    router.use(route.path, route.route);
  });
}

defaultIRoute.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
