import axios, { AxiosRequestConfig } from "axios";
import { App } from "vue";
import { ServiceLocator } from "@/_core/service/ServiceLocator";
import AuthService from "@/modules/Auth/AuthService";

//FIXME: Use env https://vitejs.dev/guide/env-and-mode.html#intellisense-for-typescript
const createAxios = (app: App) => {
  const apiInstance = axios.create({
    baseURL: "https://api.yarus.ru",
  });
  app.config.globalProperties.$axios = apiInstance;

  apiInstance.interceptors.request.use((config) => {
    apiKeyHeaderInterceptor(config);
    accessTokenHeaderInterceptor(config);
    return config;
  });

  return apiInstance;
};

const uniqueId = `ID-${new Date().getTime().toString()}`;
const apiKeyHeaderInterceptor = (config: AxiosRequestConfig) => {
  if (!config.headers) {
    config.headers = {};
  }
  config.headers["X-APP"] = 3;
  config.headers["X-DEVICE-ID"] = uniqueId;
  config.headers["X-API-KEY"] = config.headers["X-API-KEY"] || "PELQTQN2mWfml8XVYsJwaB9Qi4t8XE";
  return config;
};

const accessTokenHeaderInterceptor = (config: AxiosRequestConfig) => {
  if (!config.headers) {
    config.headers = {};
  }
  const accessToken = ServiceLocator.instance.getService(AuthService).accessToken;

  if (!!accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  } else {
    delete config.headers.Authorization;
  }
};

export default createAxios;
