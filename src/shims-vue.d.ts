import { AxiosInstance } from "axios";
import { ContextServiceRegistry as ContextServiceLocator } from "@/_core/service/ServiceLocator";
import VueRouter from "vue-router";
import "vue-router";

declare module "*.vue" {
  import { defineComponent } from "vue";
  const component: ReturnType<typeof defineComponent>;
  export default component;
}

declare module "vue" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface App<HostElement = any> {
    $axios: AxiosInstance;
  }

  interface ComponentCustomProperties {
    $axios: AxiosInstance;
  }
}

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
  }
}

declare module "vue-router" {
  interface RouteMeta {
    // is optional
    isAdmin?: boolean;
    // must be declared by every route
    requiresAuth: boolean;
  }
}
