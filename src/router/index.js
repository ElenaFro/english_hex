import { createRouter, createWebHistory, START_LOCATION } from 'vue-router';
import routes from './routes';

const isAuthenticated = () => {
    return !!localStorage.getItem('access_token');
};

const MAINTENANCE_MODE = false;
const MAINTENANCE_ROUTE = '/service';

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    if (MAINTENANCE_MODE) {
        // Show service page only on the initial app load.
        if (from === START_LOCATION && to.path !== MAINTENANCE_ROUTE) {
            return next(MAINTENANCE_ROUTE);
        }
    }

    const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
    const isAuth = isAuthenticated();

    if (requiresAuth && !isAuth) {
        return next('/auth');
    }

    if (to.path === '/auth' && isAuth) {
        return next('/');
    }

    next();
});

export default router;
