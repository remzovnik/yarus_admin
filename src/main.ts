import App from "@/App.vue";
import { createApp } from "vue";
import { createPinia } from "pinia";
import vfmPlugin from "vue-final-modal";
import vuetify from "./plugins/vuetify";
import { loadFonts } from "./plugins/webfontloader";
import "@/assets/styles/index.scss";
import { lazySrcDirective } from "@/_core/utils/LazyLoad";
import IMaskDirective from "@/_core/utils/IMaskDirective";
import { ServiceLocator } from "./_core/service/ServiceLocator";
import createAxios from "./createAxios";
import createAppRouter from "./createRouter";
import AuthService from "./modules/Auth/AuthService";

const app = createApp(App);

app.directive("lazysrc", lazySrcDirective);
app.directive("imask", IMaskDirective());

loadFonts();
createAxios(app);

ServiceLocator.instance.setVueApp(app);

app.use(vuetify);
app.use(vfmPlugin);
app.use(createPinia());

ServiceLocator.instance
  .getService(AuthService)
  .tryRestoreUser()
  .then(() => {
    const router = createAppRouter();
    app.use(router);

    app.mount("#app");
  });
