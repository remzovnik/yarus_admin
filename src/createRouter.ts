import { createRouter, createWebHistory, NavigationGuardNext, RouteLocationNormalized } from "vue-router";
import LoginLayout from "@/layouts/LoginLayout.vue";
import { ServiceLocator } from "./_core/service/ServiceLocator";
import AuthService from "./modules/Auth/AuthService";

const authGuard = (to: RouteLocationNormalized, from: RouteLocationNormalized) => {
  if (to.meta?.requiresAuth && !ServiceLocator.instance.getService(AuthService).isAuthenticated) {
    return {
      name: "login",
    };
  }
};

const createAppRouter = () => {
  const router = createRouter({
    history: createWebHistory(),
    routes: [
      {
        name: "main",
        path: "/",
        meta: { requiresAuth: true },
        component: () => import("@/modules/BloggersFeed/pages/BloggersFeed.vue"),
      },
      {
        name: "bloggers-feed",
        path: "/bloggers-feed",
        meta: { requiresAuth: true },
        component: () => import("@/modules/BloggersFeed/pages/BloggersFeed.vue"),
      },
      {
        name: "parser-list",
        path: "/parsers",
        meta: { requiresAuth: true },
        component: () => import("@/modules/Parsers/pages/ParserList.vue"),
      },

      {
        name: "news-edit",
        path: "/news",
        meta: { requiresAuth: true },
        component: () => import("@/modules/NewsEdit/pages/NewsEdit.vue"),
      },
      {
        name: "event-list",
        path: "/events",
        meta: { requiresAuth: true },
        component: () => import("@/modules/Events/pages/EventList.vue"),
      },
      {
        name: "greet-card",
        path: "/greet-card",
        meta: { requiresAuth: true },
        redirect: (to) => {
          return { name: "greet-card-list" };
        },
        component: () => import("@/modules/Greetcards/layouts/GreetCardPagesLayout.vue"),
        children: [
          {
            name: "greet-card-list",
            path: "/greet-card/all",
            meta: { requiresAuth: true },
            component: () => import("@/modules/Greetcards/pages/GreetCardList.vue"),
          },
          {
            name: "greet-card-unused-slider-list",
            path: "/greet-card/unused-slider-list",
            meta: { requiresAuth: true },
            component: () => import("@/modules/Greetcards/pages/UnusedSliderList.vue"),
          },
          {
            name: "greet-card-statistic",
            path: "/greet-card/statistic",
            meta: { requiresAuth: true },
            component: () => import("@/modules/Greetcards/pages/GreetCardStatistic.vue"),
          },
        ],
      },
      {
        name: "complaint",
        path: "/complaint",
        meta: { requiresAuth: true },
        redirect: (to) => {
          return { name: "complaint-list" };
        },
        component: () => import("@/modules/Complaint/layouts/ComplaintPagesLayout.vue"),
        children: [
          {
            name: "complaint-list",
            path: "/complaint/all",
            meta: { requiresAuth: true },
            component: () => import("@/modules/Complaint/pages/ComplaintList.vue"),
          },
          {
            name: "complaint-item",
            path: "/complaint/:id",
            props: true,
            meta: { requiresAuth: true },
            component: () => import("@/modules/Complaint/pages/ComplaintPage.vue"),
          },
        ],
      },

      {
        name: "search-content",
        path: "/content",
        props: true,
        meta: { requiresAuth: true },
        component: () => import("@/modules/Yarus/pages/ContentSearch.vue"),
        children: [
          {
            name: "content-user-info",
            path: "user/:userId",
            props: true,
            meta: { requiresAuth: true },
            component: () => import("@/modules/Yarus/components/UserPage.vue"),
          },
          {
            name: "content-detail",
            path: ":contentType/:id",
            props: true,
            meta: { requiresAuth: true },
            component: () => import("@/modules/Yarus/components/ContentPage.vue"),
          },
        ],
      },
      {
        name: "login",
        path: "/login",
        meta: {
          layout: LoginLayout,
          requiresAuth: false,
        },
        component: () => import("@/modules/Auth/pages/LoginForm.vue"),
      },
      {
        name: "quest-list",
        path: "/quests",
        meta: { requiresAuth: true },
        component: () => import("@/modules/Quests/pages/QuestList.vue"),
      },
      {
        name: "not-found",
        path: "/:catchAll(.*)",
        component: () => import("@/components/NotFound.vue"),
      },
    ],
  });

  router.beforeEach((from, to) => authGuard(from, to));

  return router;
};

export default createAppRouter;
