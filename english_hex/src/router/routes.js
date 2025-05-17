const routes = [
  {
    path: "/auth",
    name: "Auth",
    component: () => import("@/pages/AuthPage.vue"),
    meta: { requiresAuth: false },
  },
  {
    path: "/",
    name: "mainPage",
    component: () => import("@/pages/MainPage/MainPage.vue"),
    meta: { requiresAuth: false },
  },
];
export default routes;
