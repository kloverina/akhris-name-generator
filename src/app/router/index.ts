import { createRouter, createWebHashHistory } from 'vue-router';

export const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            component: () => import('@/pages/HomePage.vue'),
        },
        // {
        //     path: '/generator/:id',
        //     component: () => import('@/pages/GeneratorPage.vue'),
        // },
    ],
});