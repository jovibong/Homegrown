import { createRouter, createWebHistory } from 'vue-router';
import Finance from '../pages/financePage.vue';
import Courses from '../pages/coursesPage.vue';
import Mentorship from '../pages/mentorshipPage.vue';
import MentorshipCourse from '../pages/mentorshipCourse.vue';
import volunteer from '../pages/volunteerPage.vue';
import TestPage from '../pages/testPage.vue';


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
    {
        path: '/mentorshipCourse',
        name: 'mentorshipCourse',
        component: MentorshipCourse
    },
    {
        path: '/volunteerPage',
        name: 'volunteerPage',
        component: volunteer
    },
    {
        path: '/testPage',
        name: 'testPage',
        component: TestPage
    } // to be removed when done

];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});

export default router;
