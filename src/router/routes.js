const routes = [
    {
        path: '/auth',
        name: 'Auth',
        component: () => import('@/layouts/GuestLayout.vue'),
        children: [
            {
                path: '',
                name: 'AuthPage',
                component: () => import('@/pages/AuthPage.vue'),
            },
        ],
        meta: { requiresAuth: false },
    },
    {
        path: '/',
        name: 'Home',
        component: () => import('@/layouts/MainLayout.vue'),
        children: [
            {
                path: '',
                name: 'mainPage',
                component: () => import('@/pages/MainPage.vue'),
            },
            {
                path: 'addCategories',
                name: 'addCategories',
                component: () => import('@/pages/AddCategoriesPage.vue'),
            },
            {
                path: 'rating',
                name: 'rating',
                component: () => import('@/pages/RatingPage.vue'),
            },
            {
                path: 'profile',
                name: 'profile',
                component: () => import('@/pages/ProfilePage.vue'),
            },
            {
                path: 'notifications',
                name: 'notifications',
                component: () => import('@/pages/NotificationsPage.vue'),
            },
            {
                path: 'learning/:id',
                name: 'learning',
                component: () => import('@/pages/LearningPage.vue'),
            },
            {
                path: 'games',
                name: 'games',
                component: () => import('@/pages/games/GameMainPage.vue'),
            },
            {
                path: 'planetGame',
                name: 'planetGame',
                component: () => import('@/pages/games/attackPlanet/PlanetAttack.vue'),
            },
            {
                path: 'planetAttackPage',
                name: 'planetAttackPage',
                component: () => import('@/pages/games/attackPlanet/PlanetAttackPage.vue'),
            },
            {
                path: 'wordTwinkle',
                name: 'wordTwinkle',
                component: () => import('@/pages/games/wordTwinkle/wordTwinklePage.vue'),
            },
            {
                path: 'gameResult',
                name: 'gameResult',
                component: () => import('@/pages/games/gameResult.vue'),
            },
            {
                path: 'constellationGame',
                name: 'constellationGame',
                component: () => import('@/pages/games/constellationGame/ConstellationPage.vue'),
            },
            {
                path: 'myPlanet',
                name: 'myPlanet',
                component: () => import('@/pages/MyPlanetPage.vue'),
            },
        ],
        meta: { requiresAuth: true },
    },
    {
        path: '/error/:code',
        name: 'ErrorPage',
        component: () => import('@/pages/ErrorPage.vue'),
        props: true,
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'error',
        component: () => import('@/pages/ErrorPage.vue'),
        props: { code: 404 },
    },
];

export default routes;
