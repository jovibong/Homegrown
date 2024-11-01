<template>
    <div>
        <!--Back Button and Course Title-->
        <section id="Title" class="container py-3 fade-in-top">
            <div class="container mb-4">
                <div class="row align-items-center">
                    <!-- Back Button -->
                    <div class="col-3">
                        <router-link to="/mentorshipPage" class="nav-link text-light">
                        <a href="Mentorship.html" class="btn btn-warning text-dark"><i class="bi bi-arrow-left"></i>
                            <span class="d-none d-lg-inline">Back to Mentorship</span>
                            <span class="d-inline d-lg-none">Back</span>
                        </a>
                    </router-link>
                    </div>
                    <!-- Title (Centered) -->
                    <div class="col-6 text-center">
                        <h2 class="text-primary fw-bold mb-0 display-4">Course Mentees</h2>
                    </div>
                    <!-- Empty column for spacing/flexibility -->
                    <div class="col-3"></div>
                </div>
                <!-- Subtitle -->
                <p class="text-center text-muted mt-3">You're doing an incredible job as a mentor! Keep supporting and
                    guiding your mentees, helping them unlock
                    their full potential with every step they take.</p>
            </div>

        </section>

        <!--Course Info-->
        <div id="app">
            <section id="course_info" class="container py-2 fade-in-top">
                <div class="card shadow-sm mb-md-2 mb-3">
                    <div class="card-body position-relative">

                        <!-- Icon and Course Info -->
                        <div class="row my-0 d-flex align-items-center">
                            <h5 class=" col-md-10 mt-2 fw-bold display-lg-4 display-5">{{ course.name }}</h5>
                            <div class="text-center col-md-2 my-0 d-md-block d-none">
                                <a :href="expanded ? '#lessons_expanded' : '#'">
                                    <button class="rounded-circle bg-white border border-0" type="button"
                                        data-bs-toggle="collapse" data-bs-target="#lessons_expanded"
                                        aria-expanded="false" aria-controls="lessons_expanded" @click="toggleChevron">
                                        <i class="bi bi-chevron-down display-5"></i>
                                    </button>
                                </a>
                            </div>
                        </div>
                        <p class="text-muted">{{ course.description }}</p>


                        <!--Dropdown Button on small screens-->
                        <div class="text-center my-0 d-md-none d-block">
                            <a :href="expanded ? '#lessons_expanded' : '#app'">
                                <button class="triangle-btn-bg bg-primary border border-white border-3 shadow-lg"
                                    type="button" data-bs-toggle="collapse" data-bs-target="#lessons_expanded"
                                    aria-expanded="false" aria-controls="lessons_expanded" @click="toggleTriangle">
                                    <i class="triangle-btn bg-secondary"></i>
                                </button>
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            <!--Mentor-->
            <section id="Mentee" class="container my-2 fade-in-top">
                <div class="row">
                    <div v-for="mentee in mentees" :key="mentee.name" class="col-md-6 mb-4">
                        <div class="card shadow-sm">
                            <div class="card-header bg-primary text-white text-center fw-bold h4">
                                {{ mentee.name }}
                                <!-- Notification Badge -->
                                <span v-if="mentee.notificationCount > 0"
                                    class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                                    style="transform: translate(-50%, -50%);">
                                    {{ mentee.notificationCount }}
                                </span>
                            </div>
                            <div class="card-body d-flex align-items-center">
                                <div class="row">
                                    <!-- Mentor Image -->
                                    <div class="col-md-3 d-flex justify-content-center">
                                        <img :src="'../img/' + mentee.img" alt="Mentee Img" class="rounded-circle"
                                            height="150px" width="150px">
                                    </div>
                                    <!-- Mentor Information -->
                                    <div class="col-md-9 text-md-start text-center">
                                        <p class="text-muted">{{ mentee.description }}</p>
                                        <!-- Ask for Help Button -->
                                        <a href="#" class="btn btn-primary d-inline-flex align-items-center">
                                            Chat <i class="bi bi-arrow-right ms-2"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!--Dropdown items-->
            <div id="lessons_expanded" class="collapse container">
                <div v-for="(lesson, lessonId) in lessons" :key="lessonId" class="mb-4">
                    <a href="video_1.html" class="text-decoration-none">
                        <div class="card shadow-sm mb-md-2 mb-3">
                            <div class="card-body position-relative">
                                <h4 class="fw-bold mb-3">{{ lesson.name }}</h4>
                                <div class="row">
                                    <div v-for="item in lesson.content" :key="item.id" class="col-12">
                                        <div
                                            class="d-flex align-items-center p-3 mb-3 bg-secondary rounded hover-animate hover-less">
                                            <div class="me-3">
                                                <div class="rounded-circle d-flex align-items-center justify-content-center bg-primary text-secondary"
                                                    style="width: 60px; height: 60px;">
                                                    <i :class="'bi ' + item.icon + ' h2 pt-2'"></i>
                                                </div>
                                            </div>
                                            <div>
                                                <p class="text-primary mb-1">{{ formatType(item.typeof) }}</p>
                                                <p class="fw-bold mb-1">{{ item.name }}</p>
                                                <p class="text-muted">{{ item.duration }}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </a>
                </div>
            </div>


        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            course: {
                id: 101,
                name: "Introduction to Python",
                rating: 3.6,
                description: "Learn the basics of Python programming, including syntax, data types, and how to create simple applications. This course is perfect for beginners with no prior coding experience.",
                mentees: [
                {
                    name: "Ravi Kumar",
                    description: "Hello! I'm Ravi Kumar from India, currently working in construction. I’m eager to learn new skills and improve my career prospects, and I enjoy sharing my experiences with others.",
                    img: "ravikumar.png",
                    notificationCount: 1,
                },
                {
                    name: "Maria Gomez",
                    description: "Hi! I'm Maria Gomez, originally from the Philippines, working as a domestic helper. I’m passionate about cooking, learning about personal finance, and helping others in my community.",
                    img: "mariagomez.png",
                    notificationCount: 0,
                },
                {
                    name: "Ahmed Hossain",
                    description: "Hello! I'm Ahmed Hossain from Bangladesh, currently working in manufacturing. I’m focused on upskilling and connecting with others to learn new skills that can help me and my family.",
                    img: "ahmedhossain.png",
                    notificationCount: 0,
                },
                {
                    name: "Lina Wijaya",
                    description: "Hi! I'm Lina Wijaya from Indonesia, working in the hospitality sector. I am passionate about professional development and helping my peers grow in their careers.",
                    img: "linawijaya.png",
                    notificationCount: 1,
                }
            ],
                lessons: {
                "L101": {
                    name: "Lesson 1",
                    content: [
                        { id: "vid1_1", typeof: "video", duration: "10min", name: "Video 1: Introduction", icon: "bi-play-fill" },
                        { id: "q_1_1", typeof: "quiz", duration: "10min", name: "Quiz 1: Introduction", icon: "bi-lightbulb" }
                    ]
                },
                "L102": {
                    name: "Lesson 2",
                    content: [
                        { id: "vid2_1", typeof: "video", duration: "10min", name: "Video 2: Variables", icon: "bi-play-fill" },
                        { id: "q_2_1", typeof: "quiz", duration: "10min", name: "Quiz 2: Variables", icon: "bi-lightbulb" }
                    ]
                }
            },
            },
            expanded: false,
        };
    },
    methods: {
        getRatingStars(rating) {
            const roundedRating = Math.round(rating * 2) / 2;
            let stars = '';

            for (let i = 1; i <= 5; i++) {
                if (i <= Math.floor(roundedRating)) {
                    stars += '<i class="bi bi-star-fill text-warning"></i>';
                } else if (i === Math.ceil(roundedRating) && roundedRating % 1 !== 0) {
                    stars += '<i class="bi bi-star-half text-warning"></i>';
                } else {
                    stars += '<i class="bi bi-star text-warning"></i>';
                }
            }
            return stars;
        },
        formatType(type) {
            return type.charAt(0).toUpperCase() + type.slice(1);
        },
        toggleChevron(event) {
            const button = event.currentTarget;
            if (!this.expanded) {
                const chevron = button.querySelector('.bi-chevron-down');
                chevron.classList.replace('bi-chevron-down', 'bi-chevron-up');
            } else {
                const chevron = button.querySelector('.bi-chevron-up');
                chevron.classList.replace('bi-chevron-up', 'bi-chevron-down');
            }
            this.expanded = !this.expanded;

        },
        toggleTriangle(event) {
            const button = event.currentTarget;
            const triangle = button.querySelector('.triangle-btn');

            if (!this.expanded) {
                triangle.classList.add('rotate');
            }
            else {
                triangle.classList.remove('rotate')
            }
            this.expanded = !this.expanded;
        },


    }
}


</script>

<style scoped></style>