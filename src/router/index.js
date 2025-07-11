import { createRouter, createWebHistory } from "vue-router";
import routes from "./routes";

const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const isAuth = isAuthenticated();

  if (requiresAuth && !isAuth) {
    return next("/auth");
  }

  if (to.path === "/auth" && isAuth) {
    return next("/");
  }

  next();
});

export default router;
