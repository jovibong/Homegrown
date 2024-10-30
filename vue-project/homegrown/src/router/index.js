import { createRouter, createWebHistory } from 'vue-router';
import Finance from '../pages/financePage.vue';
import Courses from '../pages/coursesPage.vue';
import Mentorship from '../pages/mentorshipPage.vue';


const routes = [
    // {
    //     path: '/',
    //     name: 'courses',
    //     component: Courses
    // },

    {
        path: '/financePage',
        name: 'financePage',
        component: Finance
    },
    {
        path: '/coursesPage',
        name: 'coursesPage',
        component: Courses
    },
    {
        path: '/mentorshipPage',
        name: 'mentorshipPage',
        component: Mentorship
    },

];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});

export default router;
