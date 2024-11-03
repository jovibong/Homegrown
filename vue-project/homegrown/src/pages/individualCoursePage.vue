<template>
  <div class="individualCoursePage text-start">
    <!--Back Button and Course Title-->
    <section id="Title" class="container py-3 fade-in-top">
      <div class="container mb-4">
        <div class="row align-items-center">
          <!-- Back Button -->
          <div class="col-3">
            <router-link
              to="ongoingCoursesPage"
              class="btn btn-warning text-dark"
              ><i class="bi bi-arrow-left"></i>
              <span class="d-none d-lg-inline">Back to ongoing courses</span>
              <span class="d-inline d-lg-none">Back</span>
            </router-link>
          </div>
          <!-- Title (Centered) -->
          <div class="col-6 text-center">
            <h2 class="text-primary fw-bold mb-0 display-4">Ongoing Courses</h2>
          </div>
          <div class="col-3"></div>
        </div>
        <p class="text-center text-muted mt-3">
          Keep up the great work! You're on your way to mastering new skills.
          Complete your courses to unlock your full potential today!
        </p>
      </div>
    </section>

    <!--Course Info-->
    <section v-if="course" id="course_info" class="container py-2 fade-in-top">
      <div class="card shadow-sm mb-md-2 mb-3">
        <div class="card-body position-relative">
          <div class="row align-items-center">
            <!-- Icon and Course Info -->
            <div class="col-md-3 text-center mb-3 mb-md-0 h-100">
              <a href="#course_reviews" class="text-decoration-none">
                <i class="bi bi-book fs-1 text-primary"></i>
                <div class="d-block">
                  <span
                    class="text-secondary fs-4"
                    v-html="getRatingStars(course.rating)"
                  ></span>
                  <span class="text-muted d-block fs-4"
                    >{{ course.num_reviews }} Reviews</span
                  >
                </div>
              </a>
            </div>

            <div class="col-md-8 mb-0 text-md-start text-center">
              <div class="row my-0 d-flex align-items-center">
                <h5 class="col-md-10 mt-2 fw-bold display-lg-4 display-5">
                  {{ course.name }}
                </h5>
                <div class="text-center col-md-2 my-0 d-md-block d-none">
                  <button
                    class="rounded-circle bg-white border border-0"
                    type="button"
                    @click="toggleAccordion()"
                  >
                    <i class="bi bi-chevron-down display-5" :class="{'text-black-50':lessons_loading}" ref="chevron"></i>
                  </button>
                </div>
              </div>
              <p class="text-muted">{{ course.description }}</p>
            </div>
          </div>

          <!-- Progress and Description -->
          <div class="row">
            <div class="text-center mt-2 mt-md-0">
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
          </div>

          <!--Dropdown Button on small screens-->
          <div class="text-center my-0 d-md-none d-block">
            <button
              class="triangle-btn-bg bg-primary border border-white border-3 shadow-lg"
              type="button"
              @click="toggleAccordion()"
            >
              <i class="triangle-btn" :class="lessons_loading ? 'bg-primary' : 'bg-secondary'" ref="triangle"></i>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!--Mentor-->
    <section v-if="mentor" id="mentor" class="container my-2 fade-in-top">
      <div class="card shadow-sm">
        <div class="card-header bg-primary text-white text-center fw-bold h4">
          My Mentor
        </div>
        <div class="card-body d-flex align-items-center">
          <div class="row">
            <!-- Mentor Image -->
            <div class="col-md-3 d-flex justify-content-center">
              <img
                :src="'img/' + mentor.img"
                alt="Mentor Img"
                class="rounded-circle"
                height="150px"
                width="150px"
              />
            </div>
            <!-- Mentor Information -->
            <div class="col-md-9 text-md-start text-center">
              <h5 class="fw-bold h4">{{ mentor.name }}</h5>
              <p class="text-muted">{{ mentor.description }}</p>
              <!-- Ask for Help Button -->
              <a
                href="#"
                class="btn btn-primary d-inline-flex align-items-center"
              >
                Ask for help <i class="bi bi-arrow-right ms-2"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!--Dropdown items-->
    <div class="content container" ref="lessons">
      <div v-for="(lesson, lessonId) in lessons" :key="lessonId" class="mb-4">
        <div class="card shadow-sm mb-md-2 mb-3">
          <div class="card-body position-relative">
            <h4 class="fw-bold mb-3">{{ lesson.title }}</h4>
            <div class="row">
              <div
                v-for="item in lesson.lesson_items"
                :key="item.id"
                class="col-12"
              >
                <div
                  class="d-flex align-items-center p-3 mb-3 bg-secondary rounded hover-animate hover-less"
                >
                  <div class="me-3">
                    <div
                      class="rounded-circle d-flex align-items-center justify-content-center bg-primary text-secondary"
                      style="width: 60px; height: 60px"
                    >
                      <i :class="item.icon" class="h2 pt-2"></i>
                    </div>
                  </div>
                  <div>
                    <p class="text-primary mb-1">
                      {{ formatType(item.typeof) }}
                    </p>
                    <p class="fw-bold mb-1">{{ item.name }}</p>
                    <p class="text-muted">{{ item.duration }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!--Reviews section-->
    <section v-if="course" id="course_reviews" class="container my-5">
      <!-- Reviews Header -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="mb-1">Reviews</h2>
          <div>
            <span
              class="text-secondary fs-4"
              v-html="getRatingStars(course.rating)"
            ></span>
            <span class="ms-3 fw-bold">{{ course.num_reviews }} Reviews</span>
          </div>
        </div>
      </div>
      <!-- Review List -->
      <loading-animation v-if="loading"></loading-animation>
      <div v-else class="list-group">
        <div
          v-for="(review, review_key) in reviews"
          :key="review_key"
          class="list-group-item list-group-item-action d-flex align-items-start push-in-right"
        >
          <img
            :src="review.img"
            alt="Profile"
            class="rounded-circle me-3"
            height="50px"
            width="50px"
          />
          <div>
            <h5 class="mb-1">
              {{ review.name }}
              <span
                class="text-secondary fs-6"
                v-html="getRatingStars(review.rating)"
              ></span>
            </h5>
            <p class="mb-0">{{ review.comments }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import loadingAnimation from "../components/loadingAnimation.vue";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/initialize";

export default {
  components: {
    loadingAnimation,
  },
  data() {
    return {
      user: "user_00001",
      course: null,
      loading: true,
      reviews: null,
      mentor: {
        name: "Loretta Liew",
        description:
          "Hi there! I'm Loretta Liew, a dedicated mentor passionate about guiding others in their personal and professional growth. With years of experience, I help individuals achieve their fullest potential and goals.",
        img: "lorettaliew.png",
      },
      lessons: [],
      expanded: false,
      lessons_loading: true,
    };
  },
  methods: {
    async fetchLessons() {
      try {
        const lessonsRef = collection(db, `courses/${this.course.id}/lessons`);
        const lessonDocs = await getDocs(lessonsRef);

        const lessonsData = await Promise.all(
          lessonDocs.docs.map(async (lessonDoc) => {
            const lessonData = lessonDoc.data();

            // Fetch lesson items for each lesson
            const lessonItemsRef = collection(lessonDoc.ref, "lesson_items");
            const lessonItemsDocs = await getDocs(lessonItemsRef);

            const lessonItemsData = lessonItemsDocs.docs.map((itemDoc) => {
              const itemData = itemDoc.data();
              return {
                ...itemData,
                id: itemDoc.id,
                icon:
                  itemData.typeof === "quiz" ? "bi-lightbulb" : "bi-play-fill",
              };
            });

            return {
              title: lessonData.title,
              lesson_items: lessonItemsData,
            };
          })
        );

        this.lessons = lessonsData;
      } catch (error) {
        console.error("Error fetching lessons and items:", error);
      } finally {
        this.lessons_loading = false;
      }
    },
    async fetchReviewsWithUserDetails() {
      try {
        const reviewsRef = collection(db, `courses/${this.course.id}/reviews`);
        const reviewDocs = await getDocs(reviewsRef);

        const reviewsData = await Promise.all(
          reviewDocs.docs.map(async (reviewDoc) => {
            const reviewData = reviewDoc.data();
            const userRef = doc(db, "users", reviewData.user);
            const userDoc = await getDoc(userRef);

            if (userDoc.exists()) {
              const userData = userDoc.data();
              return {
                ...reviewData,
                name: userData.name,
                img: userData.profile_picture,
              };
            } else {
              console.warn(`User data not found for user: ${reviewData.user}`);
              return reviewData;
            }
          })
        );

        this.reviews = reviewsData;
      } catch (error) {
        console.error("Error fetching reviews and user details:", error);
      } finally {
        this.loading = false;
        console.log("This page has loaded");
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
    formatType(type) {
      return type.charAt(0).toUpperCase() + type.slice(1);
    },
    toggleAccordion() {
      const triangle = this.$refs["triangle"];
      console.log(triangle);
      const chevron = this.$refs["chevron"];
      console.log(chevron);
      const lessons = this.$refs["lessons"];
      console.log(lessons);

      if (this.expanded) {
        lessons.style.height = "0px";
        chevron.classList.remove("bi-chevron-up");
        chevron.classList.add("bi-chevron-down");
        triangle.classList.remove("rotate");
      } else {
        lessons.style.height = lessons.scrollHeight + "px";
        chevron.classList.remove("bi-chevron-down");
        chevron.classList.add("bi-chevron-up");
        triangle.classList.add("rotate");

        const topOffset = 100; // Adjust for desired space at the top
        const elementPosition =
          lessons.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition - topOffset;

        // Smooth scroll to the position with the offset
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
      this.expanded = !this.expanded;
    },
  },
  async mounted() {
    const storedCourse = sessionStorage.getItem("selectedCourse");
    if (storedCourse) {
      this.course = JSON.parse(storedCourse);
    } else {
      console.log("No course data found in sessionStorage");
      return;
    }

    await this.fetchLessons();
    await this.fetchReviewsWithUserDetails();
  },
};
</script>

<style scoped>
.content {
  height: 0px;
  overflow: hidden;
  transition: height 0.5s ease; /* Adjust duration as needed */
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
</style>
