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
        path: "rating",
        name: "rating",
        component: () => import("@/pages/RatingPage.vue"),
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
	    {
      path: "learning",
      name: "learning",
      component: () => import("@/pages/LearningPage.vue"),
      },
      {
        path: "games",
        name: "games",
        component: () => import("@/pages/games/GameMainPage.vue"),
      },
      {
        path: "planetGame",
        name: "planetGame",
        component: () => import("@/pages/games/attackPlanet/PlanetAttack.vue"),
      }, 
      {
        path: "planetAttackGame",
        name: "planetAttackGame",
        component: () => import("@/pages/games/attackPlanet/PlanetAttackGame.vue"),
      },       
    ],
    meta: { requiresAuth: false },
  },
];

export default routes;
