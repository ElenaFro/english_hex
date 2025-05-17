const routes = [
  {
    path: "/auth",
    name: "Auth",
    component: () => import("@/pages/AuthPage.vue"),
    meta: { requiresAuth: false },
  },
  {
    path: "/",
    name: "home",
    component: () => import("@/App.vue"),
    children: [
      {
        path: "",
        name: "mainPage",
        component: () => import("@/pages/MainPage.vue"),
      },
      {
        path: "addCategories",
        name: "addCategories",
        component: () => import("@/pages/AddCategoriesPage.vue"),
      },
      {
        path: "raiting",
        name: "raiting",
        component: () => import("@/pages/RaitingPage.vue"),
      },
      {
        path: "profile",
        name: "profile",
        component: () => import("@/pages/ProfilePage.vue"),
      },
    ],
    meta: { requiresAuth: false },
  },
];
export default routes;
