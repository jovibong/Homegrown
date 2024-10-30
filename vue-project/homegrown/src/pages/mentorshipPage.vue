<template>
    <div>
        <section id="ongoing_app" class="container py-3">
            <h2 class="text-primary fw-bold text-center mb-3 display-4">Ongoing Mentorships</h2>
            <p class="text-center text-muted mb-0 h5 pb-5">
                You're doing an incredible job as a mentor! Keep supporting and guiding your mentees, helping them
                unlock
                their full potential with every step they take.
            </p>
            <div class="row">
                <!-- Mentorship Cards -->
                <div v-for="course in ongoingMentorships" :key="course.id" class="col-md-4 mb-4">
                    <div class="card shadow-sm position-relative hover-animate">
                        <a href="mentorshipCourse.vue" class="text-decoration-none">
                            <span v-if="course.notificationCount > 0"
                                class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger badge_notifiction">
                                {{ course.notificationCount }}
                            </span>
                            <div class="card-body">
                                <div class="text-center mb-3">
                                    <i class="bi bi-book fs-2 text-primary"></i>
                                </div>
                                <h5 class="card-title fw-bold text-center">{{ course.name }}</h5>
                                <h6 class="text-secondary card-text text-center fst-italic enter-text">click to enter
                                </h6>
                                <!-- Updated here -->
                                <p class="card-text text-muted">
                                    {{ course.description }}
                                </p>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </section>
        <!-- Available Mentorships Section -->
        <section id="new_app">
            <div class="container py-5">
                <h2 class="text-primary fw-bold text-center mb-3 display-4">Available Mentorships</h2>
                <p class="text-center text-muted mb-0 h5 pb-5">
                    Make a lasting impact by becoming a mentor! Share your knowledge, guide others to success, and help
                    them
                    unlock their full potential while growing alongside them.
                </p>
                <div class="row g-4">
                    <!-- Card Loop -->
                    <div v-for="course in availableMentorships" :key="course.id" class="col-md-6">
                        <div class="card d-flex flex-column h-100">
                            <img :src="getImageUrl(course)" class="card-img-top" :alt="course.name">
                            <div class="card-body flex-grow-1">
                                <h5 class="card-title">{{ course.name }}</h5>
                                <p class="card-text">{{ course.description }}</p>
                            </div>
                            <div class="m-3">
                                <p class="fw-semibold">Requirements:</p>
                                <ul class="list-unstyled">
                                    <li v-for="requirement in course.requirements" :key="requirement"
                                        class="text-muted">
                                        • {{ requirement }}
                                    </li>
                                </ul>
                                <h4 class="fw-semibold"><span class="badge bg-primary"> Mentors Required: {{
                                    course.mentors_required }} </span></h4>
                            </div>
                            <button class="btn btn-view-info btn-position m-15" @click="openModal(course)">Be a
                                Mentor</button>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Document Submission Pop-up-->
        <div class="modal fade" id="mentorModal" tabindex="-1" aria-labelledby="mentorModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="mentorModalLabel">Submit Supporting Documents</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form @submit.prevent="submitDocuments">
                            <div class="mb-3">
                                <label for="document" class="form-label">Upload Document</label>
                                <input type="file" class="form-control" id="document" required
                                    @change="handleFileChange">
                            </div>
                            <div class="mb-3">
                                <label for="comments" class="form-label">Additional Comments (Optional)</label>
                                <textarea class="form-control" id="comments" v-model="comments" rows="3"></textarea>
                            </div>
                            <input type="hidden" v-model="selectedCourseId">
                            <button type="submit" class="btn btn-primary">Submit</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    data() {
        return {
            mentorships: [
                {
                    id: 101,
                    name: "Introduction to Python",
                    description: "Learn the basics of Python programming, including syntax, data types, and how to create simple applications. This course is perfect for beginners with no prior coding experience.",
                    mentoring: true,
                    mentees: 2,
                    mentors_required: 2,
                    requirements: ["Basic Python", "Patience with Beginners"],
                    notificationCount: 2
                },
                {
                    id: 102,
                    name: "Web Development with HTML & CSS",
                    description: "Master the fundamentals of web development by learning HTML and CSS. Build and style your own websites from scratch in this hands-on, beginner-friendly course.",
                    mentoring: false,
                    mentees: 2,
                    mentors_required: 1,
                    requirements: ["Basic HTML & CSS"],
                    notificationCount: 0
                },
                {
                    id: 103,
                    name: "Data Analysis with Excel",
                    description: "This course covers essential data analysis techniques using Microsoft Excel. Learn how to manage data, use formulas, and create powerful visualizations to analyze information effectively.",
                    mentoring: true,
                    mentors_required: 2,
                    requirements: ["Microsoft Excel Proficiency", "Analytical Skills"],
                    notificationCount: 0
                },
                {
                    id: 104,
                    name: "JavaScript for Beginners",
                    description: "This course introduces JavaScript, one of the most popular programming languages for web development. Learn how to make your websites interactive and dynamic through hands-on projects and examples.",
                    mentoring: false,
                    mentors_required: 3,
                    requirements: ["Basic JavaScript", "Problem-Solving Skills", "Familiarity with Web Development"],
                    notificationCount: 0
                },
                {
                    id: 104,
                    name: "Mandarin Language for Beginners",
                    description: "Learn the basics of Mandarin, including pronunciation, simple phrases, and everyday vocabulary. Perfect for travelers and language enthusiasts.",
                    mentoring: true,
                    mentors_required: 3,
                    requirements: ["Basic Mandarin", "Good Pronunciation", "Patience with Language Learners"],
                    notificationCount: 1
                },
                {
                    id: 105,
                    name: "Cyber Security Basics",
                    description: "Understand the fundamentals of cyber security, including how to protect your data and recognize common threats. Ideal for beginners.",
                    mentoring: false,
                    mentors_required: 2,
                    requirements: ["Interest in Cyber Security"],
                    notificationCount: 0
                },
                {
                    id: 106,
                    name: "Introduction to JavaScript",
                    description: "Dive into JavaScript programming, one of the core languages for web development. Learn syntax, basic functions, and how to build interactive websites.",
                    mentoring: true,
                    mentors_required: 2,
                    requirements: ["Basic JavaScript", "Logical Thinking", "Experience in Web Development"],
                    notificationCount: 0
                },
                {
                    id: 107,
                    name: "Project Management Essentials",
                    description: "Master the essentials of project management, including planning, execution, and risk management. This course is great for aspiring project managers.",
                    mentoring: true,
                    mentors_required: 1,
                    requirements: ["Interest in Project Management", "Strong Communication Skills", "Ability to Multitask"],
                    notificationCount: 0
                },
                {
                    id: 108,
                    name: "Graphic Design with Adobe Illustrator",
                    description: "Learn the fundamentals of graphic design using Adobe Illustrator. Perfect for anyone looking to enhance their design skills for professional or personal projects.",
                    mentoring: false,
                    mentors_required: 2,
                    requirements: ["Basic Adobe Illustrator Skills", "Eye For Design"],
                    notificationCount: 0,
                    img: "Graphic Design with Adobe Illustrator.png"
                }
            ],
            selectedCourseId: null
        };
    },
    computed: {
        ongoingMentorships() {
            return this.mentorships.filter(course => course.mentoring);
        },
        availableMentorships() {
            return this.mentorships.filter(course => !course.mentoring);
        }
    },
    methods: {
        getImageUrl(course) {
            const extension = course.name.includes("Illustrator") || course.name.includes("JavaScript") ? 'png' : 'jpeg';
            return require(`../img/${course.name}.${extension}`);
        },
        openModal(course) {
            this.selectedCourseId = course.id;
            this.mentorModal.show(); // Open the modal
        },
        submitDocuments() {
            if (!this.selectedFile) {
                alert('Please select a document to submit.');
                return;
            }

            alert(`Documents submitted for course ID: ${this.selectedCourseId}`);
            this.submitToast.show();  // Show toast notification
            this.mentorModal.hide();  // Close the modal after submission

            // Reset form fields
            this.comments = '';
            this.selectedFile = null;
        },
        handleFileChange(event) {
            this.selectedFile = event.target.files[0]; // Capture the file selected
        }
    }
}
</script>


<style scoped>
@import '../css/animation.css';
body {
    background-color: #f8f9fa;
}
.card-img-top {
    height: 200px;
    object-fit: cover;
}

.btn-view-info {
    background-color: #ffd700;
    color: black;
    font-weight: bold;
    font-size: large;
}

.card {
    position: relative;
    padding-bottom: 20px;
    display: flex;
    flex-direction: column;
    height: 100%;
    /* Space for the button */
}

.card-body {
    height: 100%;
    flex-grow: 1;
}

.btn-position {
    display: block;
    margin-top: auto;
    margin: 15px;
    text-align: center;
}

.row {
    align-items: stretch;
}

.badge_notifiction {
    padding: 0.5em 0.75em;
    font-size: 1.2em;
}

.progress {
    height: 30px;
    border-radius: 15px;
}
.btn-primary {
    background-color: #4e73df;
    border-color: #4e73df;
}
.btn-primary{
    background-color: #2e59d9;
    border-color: #2e59d9;
}
</style>