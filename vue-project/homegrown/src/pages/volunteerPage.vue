<template>
    <div id="app" class="container py-5">
        <h1 class="text-center mb-5 display-4 fw-bold text-primary">Volunteer Progress</h1>

        <!-- Volunteer Hour Goals -->
        <section class="mb-5">
            <h2 class="mb-4 text-primary text-start"><i class="bi bi-flag-fill me-2"></i>Set Your Volunteer Hour Goals
            </h2>
            <div class="card">
                <div class="card-body">
                    <h3 class="card-title">Current Goal: {{ yearlyGoal }} hours</h3>
                    <div class="progress mb-3">
                        <div class="progress-bar bg-success" role="progressbar"
                            :style="{ width: progressPercentage + '%' }" :aria-valuenow="progressPercentage"
                            aria-valuemin="0" aria-valuemax="100" v-if="totalHours != 0">
                            {{ progressPercentage }}%
                        </div>
                        <div class="progress-bar bg-info" role="progressbar" :style="{ width: futurePercentage + '%' }"
                            v-if="futureHours != 0">
                            {{ futurePercentage }}%
                        </div>
                    </div>
                    <div class="row">
                        <div class="col text-start">
                            <button @click="showModal" class="btn btn-secondary"><i
                                    class="bi bi-pencil-fill me-2"></i>Set New
                                Goal</button>
                        </div>
                        <div class="col">
                            <h6 class="card-text text-end text-success fst-italic">You've completed {{ totalHours }}
                                out of {{ yearlyGoal }} hours.</h6>
                            <h6 class="card-text text-end text-info fst-italic">You're on track to complete {{
                                futureHours }} more hours.</h6>

                        </div>
                    </div>

                </div>
            </div>
        </section>

        <!-- Current Mentored Course -->
        <section class="mb-5" v-if="currentMentorships.length > 0">
            <h2 class="mb-4 text-primary text-start"><i class="bi bi-book-fill me-2"></i>Current Mentored Course</h2>
            <div class="row row-cols-1 row-cols-md-2 g-4">
                <div v-for="course in currentMentorships" :key="course.id" class="col">
                    <div class="card h-100 hover-animate">
                        <div class="card-body">
                            <h3 class="card-title">{{ course.name }}</h3>
                            <p class="card-text">{{ course.description }}</p>
                            <div class="d-flex justify-content-between">
                                <span class="badge bg-info text-dark"><i class="bi bi-people-fill me-2"></i>Mentees: {{
                                    course.mentees }}</span>
                                <span class="badge bg-success"><i class="bi bi-clock-fill me-2"></i>Hours: {{
                                    course.hours }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Past Mentorships -->
        <section class="mb-5" v-if="pastMentorships.length > 0">
            <h2 class="mb-4 text-primary text-start"><i class="bi bi-journal-check me-2"></i>Past Mentorships</h2>
            <div class="row row-cols-1 row-cols-md-2 g-4">
                <div v-for="course in pastMentorships" :key="course.id" class="col">
                    <div class="card h-100  hover-animate">
                        <div class="card-body">
                            <h3 class="card-title">{{ course.name }}</h3>
                            <p class="card-text">{{ course.description }}</p>
                            <div class="d-flex justify-content-between">
                                <span class="badge bg-info text-dark"><i class="bi bi-people-fill me-2"></i>Mentees: {{
                                    course.mentees }}</span>
                                <span class="badge bg-success"><i class="bi bi-clock-fill me-2"></i>Hours: {{
                                    course.hours }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Upcoming Events -->
        <section class="mb-5" v-if="upcomingEvents.length > 0">
            <h2 class="mb-4 text-primary text-start"><i class="bi bi-calendar-event me-2"></i>Upcoming Events</h2>
            <div class="row row-cols-1 row-cols-md-2 g-4">
                <div v-for="event in upcomingEvents" :key="event.id" class="col">
                    <div class="card h-100 hover-animate">
                        <div class="card-body">
                            <h3 class="card-title">{{ event.name }}</h3>
                            <p class="card-text">{{ event.description }}</p>
                            <div class="d-flex justify-content-between align-items-center">
                                <span class="badge bg-warning text-dark"><i class="bi bi-calendar-date me-2"></i>{{
                                    event.date }}</span>
                                <span class="badge bg-info"><i class="bi bi-clock me-2"></i>Expected Hours: {{
                                    event.expectedHours }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Past Events -->
        <section class="mb-5" v-if="pastEvents.length > 0">
            <h2 class="mb-4 text-primary text-start"><i class="bi bi-calendar-check me-2"></i>Past Events</h2>
            <div class="row row-cols-1 row-cols-md-2 g-4">
                <div v-for="event in pastEvents" :key="event.id" class="col">
                    <div class="card h-100 hover-animate">
                        <div class="card-body">
                            <h3 class="card-title">{{ event.name }}</h3>
                            <p class="card-text">{{ event.description }}</p>
                            <div class="d-flex justify-content-between align-items-center">
                                <span class="badge bg-secondary"><i class="bi bi-calendar-date me-2"></i>{{ event.date
                                    }}</span>
                                <span class="badge bg-success"><i class="bi bi-clock-fill me-2"></i>Hours: {{
                                    event.hours }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Modal -->
        <div class="modal fade" id="goalModal" tabindex="-1" aria-labelledby="goalModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="goalModalLabel">Set New Yearly Goal</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <input v-model="newGoal" type="number" class="form-control" placeholder="Enter your new goal" />
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" @click="updateGoal">Save</button>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import { Modal } from 'bootstrap';
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/initialize";

export default {
    data() {
        return {
            yearlyGoal: 0,
            currentMentorships: [],
            pastMentorships: [],
            upcomingEvents: [],
            pastEvents: []
        };
    },
    computed: {
        totalHours() {
            let total = 0;
            this.pastMentorships.forEach(mentorship => {
                total += mentorship.hours;
            });
            this.pastEvents.forEach(event => {
                total += event.hours;
            });
            this.currentMentorships.forEach(mentorship => {
                total += mentorship.hours;
            });
            return total;
        },
        futureHours() {
            return this.upcomingEvents.reduce((total, event) => total + event.expectedHours, 0);
        },
        progressPercentage() {
            return Math.min(Math.round((this.totalHours / this.yearlyGoal) * 100), 100);
        },
        futurePercentage() {
            if (this.totalHours > this.yearlyGoal) {
                return 0;
            }
            if (this.totalHours + this.futureHours > this.yearlyGoal) {
                return Math.min(Math.round(((this.yearlyGoal - this.totalHours) / this.yearlyGoal) * 100), 100);
            } else {
                return Math.min(Math.round((this.futureHours / this.yearlyGoal) * 100), 100);
            }
        },
    },
    methods: {
        fetchVolunteerData: async function () {
            try {
                const user = JSON.parse(sessionStorage.getItem('user')) || JSON.parse(localStorage.getItem('user'));
                const uid = user.uid;
                // console.log(user)
                const docRef = doc(db, "profiles", uid);
                const docSnap = await getDoc(docRef);
                const mentorID = docSnap.data().mentor;
                console.log(mentorID)

                // if (mentorID == "mentor_00001")

            } catch (error) {
                console.error("Error fetching volunteer:", error);
            } finally {
                this.lessons_loading = false;
            }
        },
        showModal() {
            const modal = new Modal(document.getElementById('goalModal'));
            modal.show();
        },
        updateGoal() {
            if (this.newGoal && !isNaN(this.newGoal)) {
                this.yearlyGoal = parseInt(this.newGoal);
                this.newGoal = null; // Reset the input
                const modal = Modal.getInstance(document.getElementById('goalModal'));
                modal.hide();
            }
        }
    },
    async mounted() {
    await this.fetchVolunteerData();
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
