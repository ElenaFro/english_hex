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
                path: 'editCategory/:id',
                name: 'editCategory',
                component: () => import('@/pages/EditCategoryPage.vue'),
            },
            {
                path: 'users',
                name: 'users',
                component: () => import('@/pages/UsersPage/UsersPage.vue'),
                children: [
                    {
                        path: '',
                        name: 'usersMenu',
                        component: () => import('@/pages/UsersPage/UsersMenuPage.vue'),
                    },
                    {
                        path: 'rating',
                        name: 'rating',
                        component: () => import('@/pages/RatingPage/RatingPage.vue'),
                    },
                    {
                        path: 'friends',
                        name: 'friends',
                        component: () => import('@/pages/FriendsPage/FriendsPage.vue'),
                    },
                    {
                        path: 'classes',
                        name: 'classes',
                        component: () => import('@/pages/ClassesPage/ClassesPage.vue'),
                        children: [
                            {
                                path: '',
                                name: 'allClasses',
                                component: () =>
                                    import('@/pages/ClassesPage/AllClassesPage/AllClassesPage.vue'),
                            },
                            {
                                path: 'profile/:id',
                                name: 'classProfile',
                                component: () =>
                                    import(
                                        '@/pages/ClassesPage/ClassProfilePage/ClassProfilePage.vue'
                                    ),
                            },
                        ],
                    },
                ],
            },
            {
                path: 'profile',
                name: 'profile',
                component: () => import('@/pages/ProfilePage/ProfilePage.vue'),
                children: [
                    {
                        path: 'profileEdit',
                        name: 'profileEdit',
                        component: () =>
                            import('@/pages/ProfilePage/EditProfile/ProfileEditPage.vue'),
                    },
                    {
                        path: 'profileAchievements/:id',
                        name: 'profileAchievements',
                        component: () =>
                            import(
                                '@/pages/ProfilePage/AchievementsPage/ProfileAchievementsPage.vue'
                            ),
                    },
                    {
                        path: 'dictionaryPage',
                        name: 'dictionary',
                        component: () =>
                            import('@/pages/ProfilePage/DictionaryPage/DictionaryPage.vue'),
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
                    },
                ],
            },
            {
                path: 'notifications',
                name: 'notifications',
                component: () => import('@/pages/NotificationsPage.vue'),
            },
            {
                path: 'createNotification',
                name: 'createNotification',
                component: () => import('@/pages/CreateNotificationPage.vue'),
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
                path: 'allGames',
                name: 'allGames',
                component: () => import('@/pages/allGamesPage/AllGamesPage.vue'),
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
                path: 'myPlanet',
                name: 'myPlanet',
                component: () => import('@/pages/MyPlanetPage.vue'),
            },
            {
                path: 'DailyReward',
                name: 'DailyReward',
                component: () => import('@/pages/DailyRewardPage.vue'),
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
