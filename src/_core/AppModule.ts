import type { Router, RouteRecordRaw } from "vue-router";
import type { App } from "vue";

export default abstract class AppModule {
  abstract register(_app: App, _router: Router): void;

  addRoutes(router: Router, routes: Array<RouteRecordRaw>) {
    if (!!routes && routes.length) {
      routes.forEach((iter) => {
        router.addRoute(iter);
      });
    }
  }
}
