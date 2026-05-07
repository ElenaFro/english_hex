const routes = [
    {
        path: '/service',
        name: 'Service',
        component: () => import('@/pages/ServicePage.vue'),
        meta: { requiresAuth: false },
    },
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
            {
                path: 'startGame',
                name: 'flyAnimation',
                component: () => import('@/components/games/FlyGirlAnimation.vue'),
            },
        ],
        meta: { requiresAuth: false },
    },
    {
        path: '/reset-password/:token',
        name: 'ResetPassword',
        component: () => import('@/pages/Authentication/ResetPasswordPage.vue'),
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
                component: () => import('@/pages/MainPage/MainPage.vue'),
            },
            {
                path: 'addCategories',
                name: 'addCategories',
                component: () => import('@/pages/AddCategoriesPage.vue'),
            },
            {
                path: 'editCategory/:id',
                name: 'editCategory',
                component: () => import('@/pages/EditCategoryPage.vue'),
            },
            {
                path: 'users',
                name: 'users',
                component: () => import('@/pages/UsersPage/UsersPage.vue'),
                meta: { title: 'Пользователи' },
                children: [
                    {
                        path: '',
                        name: 'usersMenu',
                        component: () => import('@/pages/UsersPage/UsersMenuPage.vue'),
                        meta: { title: 'Пользователи' },
                    },
                    {
                        path: 'rating',
                        name: 'rating',
                        component: () => import('@/pages/RatingPage/RatingPage.vue'),
                        meta: { title: 'Рейтинг' },
                    },
                    {
                        path: 'friends',
                        name: 'friends',
                        component: () => import('@/pages/FriendsPage/FriendsPage.vue'),
                        meta: { title: 'Друзья' },
                    },
                    {
                        path: 'classes',
                        name: 'classes',
                        component: () => import('@/pages/ClassesPage/ClassesPage.vue'),
                        meta: { title: 'Классы' },
                        children: [
                            {
                                path: '',
                                name: 'allClasses',
                                component: () =>
                                    import('@/pages/ClassesPage/AllClassesPage/AllClassesPage.vue'),
                                meta: { title: 'Классы' },
                            },
                            {
                                path: 'profile/:id',
                                name: 'classProfile',
                                component: () =>
                                    import(
                                        '@/pages/ClassesPage/ClassProfilePage/ClassProfilePage.vue'
                                    ),
                                meta: { title: 'Ученики' },
                            },
                        ],
                    },
                ],
            },
            {
                path: 'profile',
                name: 'profile',
                component: () => import('@/pages/ProfilePage/ProfilePage.vue'),
                meta: { title: 'Профиль' },
                children: [
                    {
                        path: 'profileEdit',
                        name: 'profileEdit',
                        component: () =>
                            import('@/pages/ProfilePage/EditProfile/ProfileEditPage.vue'),
                        meta: { title: 'Настройки' },
                    },
                    {
                        path: 'profileAchievements/:id',
                        name: 'profileAchievements',
                        component: () =>
                            import(
                                '@/pages/ProfilePage/AchievementsPage/ProfileAchievementsPage.vue'
                            ),
                        meta: { title: 'Достижения' },
                    },
                    {
                        path: 'dictionaryPage',
                        name: 'dictionary',
                        component: () =>
                            import('@/pages/ProfilePage/DictionaryPage/DictionaryPage.vue'),
                        meta: { title: 'Избранное' },
                        children: [
                            {
                                path: 'cardPreview/:id',
                                name: 'cardPreview',
                                component: () =>
                                    import('@/pages/ProfilePage/DictionaryPage/CardPreview.vue'),
                            },
                        ],
                    },
                    {
                        path: 'subscriptions',
                        name: 'profileSubscriptions',
                        component: () =>
                            import('@/pages/ProfilePage/SubscriptionsPage/SubscriptionsPage.vue'),
                        meta: { title: 'Моя подписка' },
                    },
                    {
                        path: 'subscriptions/pro',
                        name: 'subscriptionPro',
                        component: () =>
                            import('@/pages/ProfilePage/SubscriptionsPage/SubscriptionProPage.vue'),
                        meta: { title: 'Продвинутая версия' },
                    },
                ],
            },
            {
                path: 'notifications',
                name: 'notifications',
                component: () => import('@/pages/NotificationsPage.vue'),
                meta: { title: 'Уведомления' },
            },
            {
                path: 'createNotification',
                name: 'createNotification',
                component: () => import('@/pages/CreateNotificationPage.vue'),
                meta: { title: 'Уведомления' },
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
                meta: { title: 'Игры' },
            },
            {
                path: 'allGames',
                name: 'allGames',
                component: () => import('@/pages/allGamesPage/AllGamesPage.vue'),
                meta: { title: 'Игры' },
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
                path: 'galaxyPhrasesGame',
                name: 'galaxyPhrasesGame',
                component: () => import('@/pages/games/galaxyPhrases/GalaxyPhrasesGamePage.vue'),
            },
            {
                path: 'infinityGame',
                name: 'infinityGame',
                component: () => import('@/pages/games/infinityGame/InfinitiGamePage.vue'),
            },
            {
                path: 'myPlanet',
                name: 'myPlanet',
                component: () => import('@/pages/PlanetPage/MyPlanetPage.vue'),
                meta: { title: 'Планета' },
            },
            {
                path: 'editPlanet',
                name: 'editPlanet',
                component: () => import('@/pages/PlanetPage/EditPlanet/EditPlanet.vue'),
                meta: { title: 'Планета' },
            },
            {
                path: 'DailyReward',
                name: 'DailyReward',
                component: () => import('@/pages/DailyRewardPage.vue'),
                meta: { title: '' },
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
