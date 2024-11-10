<template>
  <div class="coursesPage">
    <!--Ongoing Courses Section-->
    <section id="app_ongoing" class="container py-3 fade-in-top">
      <h2 class="text-primary fw-bold text-center mb-3 display-4">
        Ongoing Courses
      </h2>
      <p class="text-center text-muted mb-4 h5">
        Keep up the great work! You're on your way to mastering new skills.
        Complete your courses to unlock your full potential today.
      </p>
      <div class="d-flex justify-content-end mb-4">
        <router-link
          to="/ongoingCoursesPage"
          class="btn btn-outline-primary d-flex align-items-center"
        >
          View All <i class="bi bi-play-circle ms-2"></i>
        </router-link>
      </div>

      <div v-if="loading">
        <loading-animation></loading-animation>
      </div>
      <div v-if="!loading && !has_ongoing" class="text-center fs-4 text-muted">
        Looks like you have no ongoing course. Click on a course below to start
        learning!
      </div>
      <!-- Ongoing Course Card -->
      <div v-if="!loading && has_ongoing" class="row">
        <div
          v-for="course in ongoing_courses"
          :key="course.id"
          class="col-lg-4 col-md-6 mb-4 card-flip fade-in-top d-inline-block"
        >
          <div class="card shadow-sm position-relative h-100 card-inner">
            <div class="card-front">
              <div
                v-if="mentor_available(course)"
                class="mentor-badge bg-primary"
              >
                <span class="text-black">Mentor Included</span>
              </div>
              <img
                :src="course_images[course.id]"
                :alt="course.name + ' img'"
                class="card-img h-100"
              />

              <div
                class="card-body h-50 position-absolute bottom-0 mb-2 bg-white bg-opacity-75 w-100"
              >
                <div class="container-fluid">
                  <div class="row text-center">
                    <i
                      class="bi bi-code-slash text-primary text-center h1 fw-bold text-shadow"
                    ></i>
                  </div>
                  <div class="row text-center">
                    <h5 class="card-title fw-bold text-center px-2">
                      {{ course.name }}
                    </h5>
                  </div>
                </div>
              </div>
            </div>
            <div class="card-back">
              <div class="card-body h-100">
                <h5 class="card-title fw-bold text-center px-2">
                  {{ course.name }}
                </h5>
                <div class="text-center mb-2">
                  <span
                    v-html="getRatingStars(course.rating)"
                    class="text-warning"
                  ></span>
                  <small class="text-muted d-block">
                    {{ course.num_reviews }} Reviews
                  </small>
                </div>
                <div class="card-text text-center">
                  <p class="card-text text-muted">
                    {{ course.description }}
                  </p>
                </div>
                <div
                  class="clickable rounded-pill bg-primary text-center text-secondary w-50 p-2 mt-3 fs-4 fw-bold mx-auto"
                  @click="goToCoursePage(course)"
                >
                  Go to course
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Start a New Course Section -->
    <section id="app_new" class="container py-5 fade-in-top">
      <h2 class="text-primary fw-bold text-center mb-3 display-4">
        Start a New Course Today!
      </h2>
      <p class="text-center text-muted mb-4 h5">
        Ready to learn something new? Start a new course today and take the
        first step toward expanding your skills and knowledge!
      </p>
      <div class="d-flex justify-content-end mb-4">
        <router-link
          to="allNewCoursesPage"
          class="btn btn-outline-primary d-flex align-items-center"
        >
          View All <i class="bi bi-play-circle ms-2"></i>
        </router-link>
      </div>
      <div class="row">
        <div v-if="loading">
          <loading-animation></loading-animation>
        </div>
        <!-- New Course Card -->
        <div
          v-else
          v-for="course in new_courses"
          :key="course.id"
          class="col-lg-4 col-md-6 mb-4 card-flip fade-in-top"
        >
          <div class="card shadow-sm position-relative h-100 card-inner">
            <div class="card-front">
              <div
                v-if="mentor_available(course)"
                class="mentor-badge bg-primary"
              >
                <span class="text-black">Mentor Included</span>
              </div>
              <img
                :src="course_images[course.id]"
                :alt="course.name + ' img'"
                class="card-img h-100"
              />
              <div
                class="card-body h-50 position-absolute bottom-0 mb-2 bg-white bg-opacity-75 w-100"
              >
                <div class="container-fluid">
                  <div class="row text-center">
                    <i
                      class="bi bi-code-slash text-primary text-center h1 fw-bold text-shadow"
                    ></i>
                  </div>
                  <div class="row text-center">
                    <h5 class="card-title fw-bold text-center px-2">
                      {{ course.name }}
                    </h5>
                  </div>
                </div>
              </div>
            </div>
            <div class="card-back">
              <div class="card-body h-100">
                <h5 class="card-title fw-bold text-center px-2">
                  {{ course.name }}
                </h5>
                <div class="text-center mb-2">
                  <span
                    v-html="getRatingStars(course.rating)"
                    class="text-warning"
                  ></span>
                  <small class="text-muted d-block">
                    {{ course.num_reviews }} Reviews
                  </small>
                </div>
                <div class="card-text text-center">
                  <p class="card-text text-muted">
                    {{ course.description }}
                  </p>
                </div>
                <div
                  class="clickable rounded-pill bg-primary text-center text-secondary w-50 p-2 mt-3 fs-4 fw-bold mx-auto"
                  @click="goToNewCoursePage(course)"
                >
                  View details
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Learn New Skills Section -->
    <section class="container py-5 text-center fade-in-top">
      <h3 class="text-primary fw-bold mb-3 display-4">
        Learn New Skills on the Go
      </h3>
      <p class="text-muted h5">
        Study on your mobile device, at your own pace, and master new skills no
        matter where you are.
      </p>
    </section>

    <!-- Effortless Enrollment Section -->
    <section id="enrollment" class="pt-5 bg-secondary">
      <div class="container">
        <div class="row align-items-center py-0 fade-in-top">
          <!-- Image Column -->
          <img
            src="../img/friendly-confident-woman-writing-her-organizer-isolated-white-wall 1.png"
            alt="Student"
            class="img-fluid position-relative col-lg-5 text-center d-none d-md-inline"
          />
          <!-- Text and List Column -->
          <div id="app_steps" class="col-lg-7">
            <h2 class="fw-bold mb-3 display-5">Effortless Enrollment</h2>
            <p class="lead text-dark mb-4">
              Follow these simple steps to learn something new!
            </p>
            <ul class="list-unstyled">
              <li
                v-for="(step, key) in steps"
                :key="key"
                class="d-flex align-items-center mb-3 p-3 bg-white rounded shadow-sm push-in-right"
              >
                <span
                  class="fw-bold h4 d-flex align-items-center justify-content-center me-3 rounded-circle bg-secondary mb-0"
                  style="width: 40px; height: 40px"
                  >{{ key + 1 }}</span
                >
                <span class="h6 mb-0">{{ step }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>


<script>
import { collection, getDocs, setDoc, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/initialize";
import loadingAnimation from "../components/loadingAnimation.vue";

export default {
  components: {
    loadingAnimation,
  },
  data() {
    return {
      user: "", // Target user ID
      ongoing_courses: [],
      new_courses: [],
      steps: [
        "Sign Up",
        "Choose a Program",
        "Get a personal mentor",
        "Finish videos and quizzes",
        "Claim your certification!",
      ],
      course_images: {}, // Object to hold images for courses
      loading: true, // Loading state
      placeholderImage: "https://via.placeholder.com/500", // Placeholder image URL
      has_ongoing: false,
    };
  },
  methods: {
    getRatingStars(rating) {
      const roundedRating = Math.round(rating * 2) / 2;
      let stars = "";

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
    goToCoursePage(course) {
      // Save the course data to sessionStorage
      sessionStorage.setItem("selectedCourse", JSON.stringify(course));
      // Navigate to the individual course page without passing parameters
      this.$router.push({ name: "individualCoursePage" });
    },
    goToNewCoursePage(course) {
      sessionStorage.setItem("selectedCourse", JSON.stringify(course));
      this.$router.push({ name: "newCoursePage" });
      return course;
    },
    mentor_available(course) {
      return course.available_mentors.length > 0;
    },

    async fetchCourses() {
      try {
        // Fetch ongoing course IDs from the user's ongoing_courses subcollection
        const ongoingCoursesRef = collection(
          db,
          `users/${this.user}/ongoing_courses`
        );
        const ongoingCoursesSnap = await getDocs(ongoingCoursesRef);

        // Extract ongoing course IDs from the subcollection documents
        const userOngoingCourseIds = ongoingCoursesSnap.docs.map(
          (doc) => doc.id
        );
        console.log("User Ongoing Courses IDs:", userOngoingCourseIds);

        // Fetch all courses from Firestore
        const coursesSnap = await getDocs(collection(db, "courses"));
        const allCourses = coursesSnap.docs.map((doc) => ({
          id: doc.id, // Document ID (e.g., course_00101)
          ...doc.data(),
        }));

        console.log("All Courses Fetched from Firestore:", allCourses);

        // Separate ongoing and new courses by matching document IDs
        const ongoing = allCourses
          .filter((course) => userOngoingCourseIds.includes(course.id))
          .slice(0, 6);

        const newCourses = allCourses
          .filter((course) => !userOngoingCourseIds.includes(course.id))
          .slice(0, 6);

        console.log("Filtered Ongoing Courses:", ongoing);
        console.log("Filtered New Courses:", newCourses);

        // Update the ongoing_courses and new_courses data properties
        this.ongoing_courses = ongoing;
        this.new_courses = newCourses;

        // Populate the course_images object with the imageUrl field from each course
        ongoing.concat(newCourses).forEach((course) => {
          this.course_images[course.id] =
            course.imageUrl || this.placeholderImage;
        });

        console.log("Course Images:", this.course_images);

        // Set loading to false after images are loaded
        this.loading = false;
        this.has_ongoing = this.ongoing_courses.length > 0;
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    },
    async checkAndCreateuser(userId, userName) {
      try {
        // Reference to the user document in the users collection
        const userDocRef = doc(db, "users", userId);

        // Check if the document exists
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          console.log("User document exists:", userDocSnap.data());
        } else {
          // If user document doesn't exist, create a new one
          const newUser = {
            id: userId,
            name: userName || "New User", // Default name, adjust as needed
          };

          // Set the new document in Firestore
          await setDoc(userDocRef, newUser);
          console.log("User document created successfully:", newUser);
        }
      } catch (error) {
        console.error("Error checking or creating user document:", error);
      }
    },
  },
  mounted() {
    // Uncomment below once profile login is settled.
    const userObject =
      JSON.parse(sessionStorage.getItem("user")) ||
      JSON.parse(localStorage.getItem("user"));
    if (userObject) {
      this.checkAndCreateuser(userObject.uid, userObject.name);
      this.user = userObject.uid;
    }
    // Check if user exists before calling fetchCourses
    if (this.user) {
      this.fetchCourses();
    } else {
      console.error("User not found in sessionStorage or localStorage.");
    }
  },
};
</script>




<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.mentor-badge {
  position: absolute;
  top: 23px;
  right: 23px;
  width: 120px;
  height: 120px;
  background-color: #7b4fdf; /* Purple color for the badge */
  clip-path: polygon(100% 0, 0 0, 100% 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translate(20%, -20%);
  z-index: 1;
  border-radius: 0 5% 0 0;
  overflow: hidden;
}

.mentor-badge span {
  position: absolute;
  top: 18%;
  left: 43%;
  color: white;
  font-size: 1rem;
  font-weight: bold;
  transform: rotate(45deg);
  text-align: center;
  white-space: wrap;
  line-height: 1.2;
  max-width: 90px; /* Ensure the text fits within the badge */
}
</style>