<template>
    <div>
        <div v-if="mentorships_loading">Loading...</div>
        <div v-else>
            <section id="ongoing_app" class="container py-3">
                <h2 class="text-primary fw-bold text-center mb-3 display-4">Ongoing Mentorships</h2>
                <p class="text-center text-muted mb-0 h5 pb-5">
                    You're doing an incredible job as a mentor! Keep supporting and guiding your mentees, helping them
                    unlock
                    their full potential with every step they take.
                </p>
                <div class="row">
                    <!-- Mentorship Cards -->
                    <div v-for="course in courses" :key="course.id" class="col-md-4 mb-4">
                        <div class="card shadow-sm position-relative hover-animate">
                            <router-link to="/mentorshipCourse" class="text-decoration-none">
                                <span v-if="course.noti_count > 0"
                                    class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger badge_notifiction">
                                    {{ course.noti_count }}
                                </span>
                                <div class="card-body">
                                    <div class="text-center mb-3">
                                        <i class="bi bi-book fs-2 text-primary"></i>
                                    </div>
                                    <h5 class="card-title fw-bold text-center">{{ course.name }}</h5>
                                    <h6 class="text-secondary card-text text-center fst-italic enter-text">click to
                                        enter
                                    </h6>
                                    <!-- Updated here -->
                                    <p class="card-text text-muted">
                                        {{ course.description }}
                                    </p>
                                </div>

                            </router-link>
                        </div>
                    </div>
                </div>
            </section>
        </div>


        <section id="new_app">
            <div class="container py-5">
                <h2 class="text-primary fw-bold text-center mb-3 display-4">Available Mentorships</h2>
                <p class="text-center text-muted mb-0 h5 pb-5">
                    Make a lasting impact by becoming a mentor! Share your knowledge, guide others to success, and help
                    them
                    unlock their full potential while growing alongside them.
                </p>
                <div class="row g-4">

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


        <div class="toast-container position-fixed bottom-0 end-0 p-3">
            <div class="toast" role="alert" aria-live="assertive" aria-atomic="true" ref="toast">
                <div class="toast-header">
                    <strong class="me-auto">Submission Successful</strong>
                    <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
                <div class="toast-body">
                    {{ feedbackMessage }}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { Modal, Toast } from 'bootstrap';
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/initialize";


export default {
    data() {
        return {
            mentorships: [],
            courses: [],
            mentorships_loading: true,
            availableMentorships: [],
            availableLoading: true,

            selectedCourseId: null,
            selectedCourseName: '', // Store course name for feedback
            comments: '',
            selectedFile: null,
            mentorModal: null, // Modal instance
            feedbackMessage: '', // Toast message

        };
    },
    methods: {
        fetchLessons: async function () {
            const user = JSON.parse(localStorage.getItem("auth"))
            const uid = user.uid;
            try {
                const docRef = doc(db, "profiles", uid);
                const docSnap = await getDoc(docRef);
                const mentorID = docSnap.data().mentor;

                // const mentorRef = doc(db, "mentors", mentorID);
                const subcollectionRef = collection(db, "mentors", mentorID, "mentorships")
                const mentorSnap = await getDocs(subcollectionRef);
                // console.log(mentorSnap)

                let mentorships = []
                mentorSnap.forEach((doc) => {
                    mentorships.push({ ...doc.data(), id: doc.id })
                });
                let coursesPromises = mentorships.map(async (item) => {
                    const courseRef = doc(db, "courses", item.id);
                    const courseSnap = await getDoc(courseRef);
                    return { ...courseSnap.data(), id: courseSnap.id }; // Return course data with id
                });

                // Wait for all course data to be fetched
                const coursesName = await Promise.all(coursesPromises);

                // Now set the courses after all are fetched
                console.log(coursesName)
                this.courses = coursesName;
                // console.log("Courses:", this.courses);


            } catch (error) {
                console.error("Error fetching Current Mentorships:", error);
            } finally {
                this.mentorships_loading = false;
            }
        },
        async fetchAvailableMentorship() {

            try {
                const coursesRef = collection(db, "courses");  // Reference to the "courses" collection
                const querySnapshot = await getDocs(coursesRef);  // Get all documents in the collection

                let mentorships = [];
                querySnapshot.forEach((doc) => {
                    mentorships.push({ ...doc.data(), id: doc.id });
                });

                console.log(mentorships);


            } catch (error) {
                console.error("Error fetching lessons and items:", error);
            } finally {
                this.availableLoading = false;
            }
        },
        getImageUrl(course) {
            const extension = course.name.includes("Illustrator") || course.name.includes("JavaScript") ? 'png' : 'jpeg';
            return require(`../img/${course.name}.${extension}`);
        },
        openModal(course) {
            this.selectedCourseId = course.id;
            this.selectedCourseName = course.name; // Store the course name
            this.mentorModal = new Modal(document.getElementById('mentorModal'), {});
            this.mentorModal.show();
        },
        submitDocuments() {
            if (!this.selectedFile) {
                this.feedbackMessage = 'Please select a document to submit.';
                this.showToast();
                return;
            }

            // Set feedback message with the course name
            this.feedbackMessage = `Mentorship documents submitted successfully for course: ${this.selectedCourseName}.We will get back to you shortly`;
            this.showToast();

            if (this.mentorModal) {
                this.mentorModal.hide();
            }

            // Reset form fields
            this.comments = '';
            this.selectedFile = null;
        },
        handleFileChange(event) {
            this.selectedFile = event.target.files[0];
        },
        showToast() {
            const toastEl = this.$refs.toast;
            const toast = new Toast(toastEl);
            toast.show();
        }
    },
    async mounted() {
        // const storedCourse = sessionStorage.getItem("selectedCourse");
        // if (storedCourse) {
        //     this.course = JSON.parse(storedCourse);
        // } else {
        //     console.log("No course data found in sessionStorage");
        //     return;
        // }
        // const uid = auth.currentUser.uid;
        const user = JSON.parse(localStorage.getItem("auth"))
        console.log(user.uid)
        await this.fetchLessons();
        await this.fetchAvailableMentorship()
        // await this.fetchReviewsWithUserDetails();
    },
}
</script>


<style scoped>
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

.btn-primary {
    background-color: #2e59d9;
    border-color: #2e59d9;
}
</style>