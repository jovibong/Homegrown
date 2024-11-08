import { createRouter, createWebHistory } from 'vue-router';
import Finance from '../pages/financePage.vue';
import Courses from '../pages/coursesPage.vue';
import Events from '../pages/eventPage.vue';
import Mentorship from '../pages/mentorshipPage.vue';
import MentorshipCourse from '../pages/mentorshipCourse.vue';
import volunteer from '../pages/volunteerPage.vue';
import OngoingCourses from '../pages/ongoingCoursesPage.vue';
import IndividualCourse from '../pages/individualCoursePage.vue';
import VideoPage from '../pages/videoPage.vue';
import QuizPage from '../pages/quizPage.vue';
import QuizSummaryPage from '../pages/quizSummaryPage.vue';
import AllNewCoursesPage from '../pages/allNewCoursesPage.vue';
import NewCoursePage from '../pages/newCoursePage.vue';
import TestPage from '../pages/testPage.vue';
import EditProfile from '../pages/editProfile.vue';
import WorkersCertification from '../pages/workersCertification.vue';
import HomePage from '../pages/homePage.vue';
import ChatPage from '../pages/chatPage.vue';
import LandingPage from '../pages/landingPage.vue';


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
        path: '/eventPage',
        name: 'eventPage',
        component: Events
    },

    {
        path: '/eventPage/:id',
        name: 'eventDetail',
        component: () => import('../components/eventDetail.vue')
    },

    {
        path: '/forum',
        name: 'eventForum',
        component: () => import('../pages/forumPage.vue')
    }
    ,

    {
        path: '/calender',
        name: 'eventCalender',
        component: () => import('../components/userCalender.vue')
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
        path: '/ongoingCoursesPage',
        name: 'ongoingCoursePage',
        component: OngoingCourses
    },
    {
        path: '/individualCoursePage',
        name: 'individualCoursePage',
        component: IndividualCourse
    },
    {
        path: '/videoPage',
        name: 'videoPage',
        component: VideoPage
    },
    {
        path: '/quizPage',
        name: 'quizPage',
        component: QuizPage
    },
    {
        path: '/quizSummaryPage',
        name: 'quizSummaryPage',
        component: QuizSummaryPage
    },
    {
        path: '/newCoursePage',
        name: 'newCoursePage',
        component: NewCoursePage
    },
    {
        path: '/allNewCoursesPage',
        name: 'allNewCoursesPage',
        component: AllNewCoursesPage
    },
    {
        path: '/testPage',
        name: 'testPage',
        component: TestPage
    },
    {
        path: '/editProfile',
        name: 'editProfile',
        component: EditProfile
    },
    {
        path: '/workersCertification',
        name: 'workersCertification',
        component: WorkersCertification
    },
    {
        path: '/chatPage',
        name: 'chatPage',
        component: ChatPage
    },
    {
        path: '/homePage',
        name: 'homePage',
        component: HomePage
    },
    {
        path: '/',
        name: 'landingPage',
        component: LandingPage
    } // to be removed when done

];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});

export default router;
