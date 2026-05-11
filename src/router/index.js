import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '@/stores/user';
import routes from './routes';

const isAuthenticated = () => !!localStorage.getItem('access_token');

const MAINTENANCE_MODE = false;
const MAINTENANCE_ROUTE = '/service';

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach(async (to, from, next) => {
    if (MAINTENANCE_MODE && to.path !== MAINTENANCE_ROUTE) {
        return next(MAINTENANCE_ROUTE);
    }

    const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
    const requiresAdmin = to.matched.some((record) => record.meta.requiresAdmin);
    const isAuth = isAuthenticated();

    if (requiresAuth && !isAuth) {
        return next('/auth');
    }

    if (to.path === '/auth' && isAuth) {
        return next('/');
    }

    if (requiresAdmin) {
        const userStore = useUserStore();
        if (userStore.isAdmin === null) {
            await userStore.getUserRole();
        }
        if (!userStore.isAdmin) {
            return next({ name: 'mainPage' });
        }
    }

    next();
});

export default router;
