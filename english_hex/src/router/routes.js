const routes = [
  {
    path: "/auth",
    name: "Auth",
    component: () => import("@/layouts/GuestLayout.vue"),
    children: [
      {
        path: "",
        name: "AuthPage",
        component: () => import("@/pages/AuthPage.vue"),
      },
    ],
    meta: { requiresAuth: false },
  },
  {
    path: "/",
    name: "Home",
    component: () => import("@/layouts/MainLayout.vue"),
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
      {
        path: "notifications",
        name: "notifications",
        component: () => import("@/pages/NotificationsPage.vue"),
      },
    ],
    meta: { requiresAuth: false },
  },
];

export default routes;
