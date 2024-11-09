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
import QuizMentorPage from '../pages/quizMentorPage.vue'
import VolunteerHomePage from '../pages/volunteerHomePage.vue';
import VolunteerAchievement from '../pages/volunteerAchievement.vue';


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
    },

    {
        path: '/forumPage/:id',
        name: 'forumDetail',
        component: () => import('../components/forumDetail.vue')
    },

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
        component: TestPage // to be removed when done
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
    },
    {
        path: '/quizMentorPage',
        name: 'quizMentorPage',
        component: QuizMentorPage
    },
    {
        path: '/volunteerHomePage',
        name: 'volunteerHomePage',
        component: VolunteerHomePage
    },
    {
        path: '/volunteerAchievement',
        name: 'volunteerAchievement',
        component: VolunteerAchievement
    }

];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
          return savedPosition; // when using browser back/forward buttons, restore scroll position.
        } else {
          return { top: 0 }; // scroll to the top for all new navigations.
        }
      },
});

export default router;
