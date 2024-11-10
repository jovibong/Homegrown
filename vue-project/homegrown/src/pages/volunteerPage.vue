<template>
    <div id="app" class="container py-5">
        <h1 class="text-center mb-5 display-4 fw-bold text-primary">Volunteer Progress</h1>
        <loading-animation v-if="eventLoading || goalLoading || mentorshipLoading"></loading-animation>
        <div v-else>

            <!-- Volunteer Hour Goals -->
            <section class="mb-5">
                <h2 class="mb-4 text-primary text-start"><i class="bi bi-flag-fill me-2"></i>Set Your Volunteer Hour
                    Goals
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
                            <div class="progress-bar bg-info" role="progressbar"
                                :style="{ width: futurePercentage + '%' }" v-if="futureHours != 0">
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
                <h2 class="mb-4 text-primary text-start"><i class="bi bi-book-fill me-2"></i>Current Mentored Course
                </h2>
                <div class="row row-cols-1 row-cols-md-2 g-4">
                    <div v-for="course in currentMentorships" :key="course.id" class="col">
                        <div class="card h-100 hover-animate">
                            <div class="card-body">
                                <h3 class="card-title">{{ course.name }}</h3>
                                <p class="card-text">{{ course.description }}</p>
                                <div class="d-flex justify-content-between">
                                    <span class="badge bg-info text-dark"><i class="bi bi-people-fill me-2"></i>Mentees:
                                        {{ course.menteeCount }}</span>
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
                                    <span class="badge bg-info text-dark"><i class="bi bi-people-fill me-2"></i>Mentees:
                                        {{
                                            course.menteeCount }}</span>
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
                                        event.hours }}</span>
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
                                    <span class="badge bg-secondary"><i class="bi bi-calendar-date me-2"></i>{{
                                        event.date
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
                            <input v-model="newGoal" type="number" class="form-control"
                                placeholder="Enter your new goal" />
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" class="btn btn-primary" @click="updateGoal()">Save</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
import { Modal } from 'bootstrap';
import { updateDoc, collection, getDocs, doc, getDoc } from "firebase/firestore";
import loadingAnimation from "../components/loadingAnimation.vue";
import { db } from "../firebase/initialize";

export default {
    components: {
        loadingAnimation,
    },
    data() {
        return {
            yearlyGoal: null,
            newGoal: null,
            currentMentorships: [],
            pastMentorships: [],
            upcomingEvents: [],
            pastEvents: [],
            eventLoading: true,
            goalLoading: true,
            mentorshipLoading: true,
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
            return this.upcomingEvents.reduce((total, event) => total + Number(event.hours), 0);
        },
        progressPercentage() {
            return Math.min(Math.round((this.totalHours / this.yearlyGoal) * 100), 100);
        },
        futurePercentage() {
            if (this.yearlyGoal > 0) {
                if (this.totalHours > this.yearlyGoal) {
                    return 0;
                }
                if (this.totalHours + this.futureHours > this.yearlyGoal) {
                    return Math.min(Math.round(((this.yearlyGoal - this.totalHours) / this.yearlyGoal) * 100), 100);
                } else {
                    return Math.min(Math.round((this.futureHours / this.yearlyGoal) * 100), 100);
                }
            }
            else {
                return 0;
            }

        },
    },
    methods: {
        fetchEventsData: async function () {
            try {
                const user = JSON.parse(sessionStorage.getItem('user')) || JSON.parse(localStorage.getItem('user'));
                const uid = await user.uid;
                console.log(uid)

                const querySnapshot = await getDocs(collection(db, 'events'));
                const currentDate = new Date();

                querySnapshot.docs
                    .filter(doc => doc.data().joined && doc.data().joined.includes(uid))
                    .forEach(doc => {
                        const eventData = doc.data();
                        const eventDate = new Date(eventData.date.seconds * 1000); // Convert Firestore timestamp to Date object

                        // Format the date to a readable string
                        const readableDate = eventDate.toLocaleString();

                        // Create the event object
                        const event = {
                            id: doc.id,
                            name: eventData.name,
                            description: eventData.description,
                            hours: eventData.hours,
                            date: readableDate, // Store formatted date string
                        };

                        // Separate past and upcoming events based on current date
                        if (eventDate < currentDate) {
                            this.pastEvents.push(event);
                        } else {
                            this.upcomingEvents.push(event);
                        }
                    });
            } catch (error) {
                console.error("Error fetching Events:", error);
            } finally {
                this.eventLoading = false;
            }
        },
        fetchYearlyGoal: async function () {
            try {
                // Replace "mentorId" with the actual mentor document ID you want to fetch
                const user = JSON.parse(sessionStorage.getItem('user')) || JSON.parse(localStorage.getItem('user'));
                const uid = user.uid;

                const mentorDocRef = doc(db, 'mentors', uid);
                const docSnap = await getDoc(mentorDocRef);
                console
                if (docSnap.exists()) {
                    // Check if 'hourGoal' field exists in the document
                    if ('hourGoal' in docSnap.data()) {
                        console.log('hourGoal exists:', docSnap.data().hourGoal);
                        this.yearlyGoal = parseInt(docSnap.data().hourGoal)
                    } else {
                        console.log('hourGoal does not exist.');
                        await updateDoc(mentorDocRef, {
                            hourGoal: null
                        });
                    }
                }
            }
            catch (error) {
                console.error("Error fetching Events:", error);
            } finally {
                this.goalLoading = false;
            }
        },
        fetchMentorships: async function () {
            try {
                const user = JSON.parse(sessionStorage.getItem('user')) || JSON.parse(localStorage.getItem('user'));
                const uid = user.uid;
                const subcollectionRef = collection(db, "mentors", uid, "mentorship")
                const mentorSnap = await getDocs(subcollectionRef);
                // console.log(mentorSnap)

                let ongoing = []
                let past = []
                for (const docSnapshot of mentorSnap.docs) {
                    const data = docSnapshot.data();
                    const id = docSnapshot.id;
                    if (data.active) { // Check if the 'active' field is true
                        let mentorData = {
                            id: docSnapshot.id,
                            hours: data.hours,
                            menteeCount: data.mentees ? data.mentees.length : 0
                        }

                        const courseRef = doc(db, "courses", id);
                        const courseSnap = await getDoc(courseRef);
                        if (courseSnap.exists()) {
                            const courseData = courseSnap.data();
                            mentorData.name = courseData.name; // Course name
                            mentorData.description = courseData.description;
                        }
                        ongoing.push(mentorData)

                    }
                    else {
                        let mentorData = {
                            id: docSnapshot.id,
                            hours: data.hours,
                            menteeCount: data.mentees ? data.mentees.length : 0
                        }

                        const courseRef = doc(db, "courses", id);
                        const courseSnap = await getDoc(courseRef);
                        if (courseSnap.exists()) {
                            const courseData = courseSnap.data();
                            mentorData.name = courseData.name; // Course name
                            mentorData.description = courseData.description;
                        }
                        past.push(mentorData)
                    }
                }

                this.pastMentorships = past;
                this.currentMentorships = ongoing;
                console.log(ongoing)
                console.log(past)
            }
            catch (error) {
                console.error("Error fetching Mentorships:", error);
            } finally {
                this.mentorshipLoading = false;
            }
        },

        updateGoal: async function () {
            const user = JSON.parse(sessionStorage.getItem('user')) || JSON.parse(localStorage.getItem('user'));
            const uid = user.uid;
            const mentorRef = doc(db, 'mentors', uid);

            try {
                // Update the 'hourGoal' in the Firestore document
                await updateDoc(mentorRef, {
                    hourGoal: this.newGoal
                });
                console.log('Goal updated successfully');
                this.yearlyGoal = parseInt(this.newGoal);
                this.newGoal = null;
                const modal = Modal.getInstance(document.getElementById('goalModal'));
                modal.hide();

            } catch (error) {
                console.error('Error updating goal:', error);
            }
        },

        showModal() {
            const modal = new Modal(document.getElementById('goalModal'));
            modal.show();
        },
        // updateGoal() {
        //     if (this.newGoal && !isNaN(this.newGoal)) {
        //         this.yearlyGoal = parseInt(this.newGoal);
        //         this.newGoal = null; // Reset the input
        //         const modal = Modal.getInstance(document.getElementById('goalModal'));
        //         modal.hide();
        //     }
        // }
    },
    async mounted() {
        await this.fetchEventsData();
        await this.fetchYearlyGoal();
        await this.fetchMentorships();
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
