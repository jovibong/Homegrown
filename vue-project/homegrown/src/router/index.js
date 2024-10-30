import { createRouter, createWebHistory } from 'vue-router';
import Finance from '../pages/finance.vue';


const routes = [
    // {
    //     path: '/',
    //     name: 'courses',
    //     component: Courses
    // },

    {
        path: '/finance',
        name: 'finance',
        component: Finance
    },

];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});

export default router;
