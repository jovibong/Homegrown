<template>
  <div class="ongoingCoursePage">
    <!--Back Button and Course Title-->
    <section id="Title" class="container py-4 fade-in-top">
      <div class="container mb-4">
        <div class="row align-items-center">
          <!-- Back Button -->
          <div class="col-3">
            <router-link to="/coursesPage" class="btn btn-warning text-dark">
              <i class="bi bi-arrow-left"></i>
              <span class="d-none d-lg-inline">Back to all courses</span>
              <span class="d-inline d-lg-none">Back</span>
            </router-link>
          </div>
          <!-- Title (Centered) -->
          <div class="col-6 text-center">
            <h2 class="text-primary fw-bold mb-0 display-4">Ongoing Courses</h2>
          </div>
          <!-- Empty column for spacing/flexibility -->
          <div class="col-3"></div>
        </div>
        <!-- Subtitle -->
        <p class="text-center text-muted mt-3">
          Keep up the great work! You're on your way to mastering new skills.
          Complete your courses to unlock your full potential today!
        </p>
      </div>
    </section>

    <loading-animation v-if="loading"></loading-animation>
    <div v-if="!loading && !has_ongoing" class="text-center">
      <div class="d-flex flex-column align-items-center mb-5">
        <img
          src="../img/404 Courses Not Found.png"
          alt="Courses Not Found"
          class="img-fluid"
          style="max-width: 50%; height: auto"
        />
        <div class="text-primary display-5 fw-bold text-center mb-5">
          Go to new courses below to start learning!
        </div>
        <router-link to="newCoursePage" class="d-flex align-items-center btn btn-primary rounded-pill text-secondary">
          <span class="fw-bold">View new course</span>
          <i class="bi bi-caret-right-fill fs-4 ms-3"></i>
        </router-link>
      </div>
    </div>
    <section v-if="!loading && has_ongoing" id="app" class="container py-4">
      <div v-for="(course, key) in ongoing_courses" :key="key">
        <div class="card shadow-sm mb-4 push-in-right">
          <div class="card-body position-relative">
            <!-- Mentor Badge -->
            <div
              v-if="mentor_available(course)"
              class="mentor-badge bg-primary"
            >
              <span class="text-black">Mentor Included</span>
            </div>
            <div class="row align-items-center">
              <!-- Icon and Course Info -->
              <div class="col-md-3 text-center mb-3 mb-md-0">
                <i class="bi bi-book fs-1 text-primary"></i>
                <h5 class="mt-2 fw-bold">{{ course.name }}</h5>
                <div>
                  <span
                    class="text-secondary"
                    v-html="getRatingStars(course.rating)"
                  ></span>
                  <small class="text-muted d-block"
                    >{{ course.num_reviews }} Reviews</small
                  >
                </div>
              </div>
              <!-- Progress and Description -->
              <div class="col-md-9">
                <div class="text-center my-2">
                  <div class="fw-bold h3">
                    <span
                      :ref="'progression' + course.id"
                      class="count-animate"
                      :data-count-limit="course.percentageCompleted"
                      >0</span
                    >% complete
                  </div>
                  <div class="d-flex justify-content-center my-3">
                    <div class="progress" style="width: 80%; height: 15px">
                      <div
                        class="progress-bar bg-dark progress-animate"
                        role="progressbar"
                        :ref="'courseProgress' + course.id"
                        :data-progress="course.percentageCompleted + '%'"
                        style="width: 0%"
                      ></div>
                    </div>
                  </div>
                </div>
                <p class="text-muted">{{ course.description }}</p>
              </div>
              <!-- Collapsible Content -->
              <div
                class="content mt-3"
                :id="'courseDetails' + course.id"
                :ref="'courseDetails' + course.id"
              >
                <!-- Lesson Timeline Start -->
                <div class="timeline-container mt-4">
                  <div class="timeline-line d-none d-md-inline"></div>
                  <div class="row justify-content-center">
                    <!-- Lesson 1 -->
                    <div class="col-auto lesson d-none d-lg-inline">
                      <div class="lesson-content text-center">
                        <h6 class="fw-bold">Lesson 1</h6>
                        <div class="lesson-item mx-2">
                          <p>Video 1</p>
                          <div class="circle"></div>
                        </div>
                        <div class="lesson-item mx-2">
                          <p>Quiz 1</p>
                          <div class="circle"></div>
                        </div>
                      </div>
                    </div>
                    <!-- Lesson 2 -->
                    <div class="col-auto lesson">
                      <div class="lesson-content text-center">
                        <h6 class="fw-bold">Lesson 2</h6>
                        <div class="lesson-item mx-2">
                          <p>Video 2</p>
                          <div class="circle"></div>
                        </div>
                        <div class="lesson-item mx-2">
                          <p>Quiz 2</p>
                          <div class="circle"></div>
                        </div>
                      </div>
                    </div>
                    <!-- Lesson 3 -->
                    <div class="col-auto lesson">
                      <div class="lesson-content text-center">
                        <h6 class="fw-bold">Lesson 3</h6>
                        <div class="lesson-item mx-2">
                          <p>Video 3</p>
                          <div class="circle active"></div>
                        </div>
                        <div class="lesson-item mx-2">
                          <p>Quiz 3</p>
                          <div class="circle active"></div>
                        </div>
                        <div class="you-are-here text-center mt-2">
                          <span class="badge bg-primary mb-2"
                            >You are here</span
                          >
                        </div>
                      </div>
                    </div>
                    <!-- Review -->
                    <div class="col-auto lesson">
                      <div class="lesson-content text-center">
                        <h6 class="fw-bold">Review</h6>
                        <div class="lesson-item mx-2">
                          <p>Review 1</p>
                          <div class="circle"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- Lesson Timeline End -->
              </div>
              <!--Dropdown Button-->
              <div class="text-center mt-3">
                <button
                  class="triangle-btn-bg bg-primary border border-white border-3 shadow-lg hover-animate hover-less"
                  type="button"
                  @click="toggleAccordion($event.currentTarget, course.id)"
                >
                  <i class="triangle-btn bg-secondary"></i>
                </button>
              </div>

              <button
                @click="goToCoursePage(course)"
                class="btn btn-primary rounded-pill d-inline-flex align-items-center col-3 m-4 position-absolute bottom-0 end-0 m-2 text-secondary fw-bold justify-content-center"
              >
                <span class="d-md-inline d-none"> Go to course </span>
                <i class="bi bi-arrow-right ms-md-2 d-none d-md-inline"></i>
                <i class="bi bi-arrow-right d-inline d-md-none display-4"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>


<script>
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/initialize";
import loadingAnimation from "../components/loadingAnimation.vue";

export default {
  components: {
    loadingAnimation,
  },
  data() {
    return {
      user: "user_00001", // Target user ID
      ongoing_courses: [],
      loading: true,
      selected_course: null,
      has_ongoing: false,
    };
  },
  methods: {
    toggleAccordion(event, courseId) {
      const triangle = event.querySelector(".triangle-btn");
      triangle.classList.toggle("rotate");
      const courseDetails = this.$refs[`courseDetails${courseId}`][0];

      if (courseDetails.style.height === courseDetails.scrollHeight + "px") {
        courseDetails.style.height = "0px";
      } else {
        courseDetails.style.height = courseDetails.scrollHeight + "px";
      }
    },

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
    mentor_available(course) {
      return course.available_mentors.length > 0;
    },
    goToCoursePage(course) {
      // Save the course data to sessionStorage
      sessionStorage.setItem("selectedCourse", JSON.stringify(course));
      // Navigate to the individual course page without passing parameters
      this.$router.push({ name: "individualCoursePage" });
    },
    async fetchCourses() {
      try {
        // Fetch ongoing course IDs from the user's ongoing_courses collection
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

        // Filter courses to get only the ongoing ones
        const ongoing = allCourses.filter((course) =>
          userOngoingCourseIds.includes(course.id)
        );

        console.log("Filtered Ongoing Courses:", ongoing);

        this.ongoing_courses = ongoing;
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        this.loading = false;
        this.has_ongoing = this.ongoing_courses.length > 0;
      }
    },
  },
  mounted() {
    this.fetchCourses();
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.content {
  height: 0px;
  overflow: hidden;
  transition: height 0.5s ease; /* Adjust duration as needed */
}

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

/*Triangle button CSS*/
.triangle-btn {
  margin: auto;
  width: 25px;
  height: 25px;
  cursor: pointer;
  display: inline-block;
  clip-path: polygon(50% 100%, 0 33%, 100% 33%);
  border: none;
}

.triangle-btn.rotate {
  transform: rotate(180deg);
  margin-top: 5px;
}

.triangle-btn-bg {
  padding-top: 5px;
  position: relative;
  bottom: -40px;
  width: 50px;
  height: 50px;
  text-align: center;
  border-radius: 50%;
}

/*Timeline CSS*/
.timeline-container {
  position: relative;
  padding: 1rem 0;
  width: 80%;
  margin: auto;
}

.timeline-line {
  position: absolute;
  top: 54%;
  left: 0;
  right: 0;
  height: 2px;
  background-color: #ddd;
  z-index: 0; /* Ensures the line stays behind the circles */
}

.lesson {
  position: relative;
  z-index: 1;
  padding: 1 rem;
  border: 2px solid #ffcf59; /* Secondary color border */
  border-radius: 15px;
  background-color: transparent;
  margin: 20px;
}

.lesson-content {
  max-width: 150px;
  margin: auto;
}

.lesson-item {
  position: relative;
  margin-top: 0rem;
  display: inline-block;
}

.lesson-item p {
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.circle {
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background-color: #ddd;
  margin: 0 auto;
  position: relative;
  z-index: 2; /* Ensures circles are above the line */
}

.circle.active {
  background-color: #7b4fdf; /* Highlighted circle */
}

.you-are-here {
  margin-top: 0.5rem;
}

@media (max-width: 768px) {
  .timeline-container {
    padding: 1rem 0;
  }
  .lesson {
    max-width: 100%;
  }
}
</style>