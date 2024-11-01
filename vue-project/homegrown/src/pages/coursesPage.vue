<template>
  <div class="coursePage">
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
      <div class="row">
        <div v-if="loading">
          <loading-animation></loading-animation>
        </div>
        <!-- Ongoing Course Card -->
          <div v-else
          v-for="course in ongoing_courses"
          :key="course.id"
          class="col-md-4 mb-4 card-flip fade-in-top"
        >
          <div class="card shadow-sm position-relative h-100 card-inner">
            <div class="card-front">
              <div v-if="course.mentor" class="mentor-badge bg-primary">
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
                  class="rounded-pill bg-primary text-center text-secondary w-50 p-2 mt-3 fs-4 fw-bold mx-auto"
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
        <a href="#" class="btn btn-outline-primary d-flex align-items-center">
          View All <i class="bi bi-play-circle ms-2"></i>
        </a>
      </div>
      <div class="row">
        <div v-if="loading">
          <loading-animation></loading-animation>
        </div>
        <!-- New Course Card -->
        <div v-else
          v-for="course in new_courses"
          :key="course.id"
          class="col-md-4 mb-4 card-flip fade-in-top"
        >
          <div class="card shadow-sm position-relative h-100 card-inner">
            <div class="card-front">
              <div v-if="course.mentor" class="mentor-badge bg-primary">
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
                  class="rounded-pill bg-primary text-center text-secondary w-50 p-2 mt-3 fs-4 fw-bold mx-auto"
                >
                  Go to course
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
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/initialize";
import loadingAnimation from "../components/loadingAnimation.vue";

export default {
  components:{
    loadingAnimation,
  },
  data() {
    return {
      user: "user_00001", // Target user ID
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
    preloadImage(url) {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = url;
        img.onload = () => resolve(url);
        img.onerror = () => resolve(this.placeholderImage); // Use placeholder on error
      });
    },
    async fetchCourses() {
      try {
        // Fetch user data to get ongoing course IDs
        const userDocRef = doc(db, "users", this.user);
        const userSnap = await getDoc(userDocRef);

        // Check if user data exists and retrieve ongoing courses array
        const userOngoingCourseIds = userSnap.exists()
          ? userSnap.data().ongoing_courses || []
          : [];
        console.log("User Ongoing Courses IDs:", userOngoingCourseIds);

        // Fetch all courses from Firestore
        const coursesSnap = await getDocs(collection(db, "courses"));
        const allCourses = coursesSnap.docs.map((doc) => ({
          id: doc.id, // Document ID (e.g., course_00101)
          ...doc.data(),
        }));

        console.log("All Courses Fetched from Firestore:", allCourses);

        // Separate ongoing and new courses by matching document ID
        const ongoing = allCourses
          .filter((course) => userOngoingCourseIds.includes(course.id))
          .slice(0, 6);

        const newCourses = allCourses
          .filter((course) => !userOngoingCourseIds.includes(course.id))
          .slice(0, 6);

        console.log("Filtered Ongoing Courses:", ongoing);
        console.log("Filtered New Courses:", newCourses);

        this.ongoing_courses = ongoing;
        this.new_courses = newCourses;

        // Preload images for each course and populate course_images
        await Promise.all(
          ongoing.concat(newCourses).map(async (course, index) => {
            const imageUrl = `https://random.imagecdn.app/500/300?random=${Date.now() + index}`;
            const loadedImage = await this.preloadImage(imageUrl);
            this.course_images[course.id] = loadedImage; // Directly assign the image URL to course_images
          })
        );

        console.log("Course Images:", this.course_images);

        // Set loading to false after all images are loaded
        this.loading = false;
      } catch (error) {
        console.error("Error fetching courses:", error);
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



</style>