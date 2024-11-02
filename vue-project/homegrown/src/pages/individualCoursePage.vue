<template>
  <div class="individualCoursePage">
    <loading-animation></loading-animation>
    <!--Back Button and Course Title-->
    <section id="Title" class="container py-3 fade-in-top">
      <div class="container mb-4">
        <div class="row align-items-center">
          <!-- Back Button -->
          <div class="col-3">
            <a href="ongoing_courses.html" class="btn btn-warning text-dark"
              ><i class="bi bi-arrow-left"></i>
              <span class="d-none d-lg-inline">Back to ongoing courses</span>
              <span class="d-inline d-lg-none">Back</span>
            </a>
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
                  <a :href="expanded ? '#lessons_expanded' : '#'">
                    <button
                      class="rounded-circle bg-white border border-0"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#lessons_expanded"
                      aria-expanded="false"
                      aria-controls="lessons_expanded"
                      @click="toggleChevron"
                    >
                      <i class="bi bi-chevron-down display-5"></i>
                    </button>
                  </a>
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
            <a :href="expanded ? '#lessons_expanded' : '#app'">
              <button
                class="triangle-btn-bg bg-primary border border-white border-3 shadow-lg"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#lessons_expanded"
                aria-expanded="false"
                aria-controls="lessons_expanded"
                @click="toggleTriangle"
              >
                <i class="triangle-btn bg-secondary"></i>
              </button>
            </a>
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
    <div id="lessons_expanded" class="collapse container">
      <div v-for="(lesson, lessonId) in lessons" :key="lessonId" class="mb-4">
        <a href="video_1.html" class="text-decoration-none">
          <div class="card shadow-sm mb-md-2 mb-3">
            <div class="card-body position-relative">
              <h4 class="fw-bold mb-3">{{ lesson.name }}</h4>
              <div class="row">
                <div
                  v-for="item in lesson.content"
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
                        <i :class="'bi ' + item.icon + ' h2 pt-2'"></i>
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
        </a>
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

      <!-- Tabs -->
      <div class="d-flex justify-content-between align-items-center mb-3">
        <ul class="nav nav-tabs">
          <li class="nav-item">
            <a class="nav-link active font-weight-bold" href="#">New</a>
          </li>
          <li class="nav-item">
            <a class="nav-link font-weight-bold" href="#">Negative</a>
          </li>
          <li class="nav-item">
            <a class="nav-link font-weight-bold" href="#">Positive</a>
          </li>
        </ul>
        <!-- Separate "View All" Button -->
        <a href="#" class="btn btn-outline-primary d-flex align-items-center">
          View All <i class="bi bi-play-circle ms-2"></i>
        </a>
      </div>

      <!-- Reviews List -->
      <div class="list-group">
        <!-- Review Card -->
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

export default {
  components: {
    loadingAnimation,
  },
  data() {
    return {
      user: "user_00001", // Target user ID
      course: null,
      loading: true, // Loading state
      reviews: [
        {
          name: "Johnny Jon",
          img: "https://via.placeholder.com/50",
          rating: 4,
          comments:
            "This is the best course ever! The instructor was very engaging, and the examples provided were practical and easy to follow. I learned a lot and feel more confident in my skills now.",
        },
        {
          name: "Sara Smith",
          img: "https://via.placeholder.com/50",
          rating: 5,
          comments:
            "Absolutely amazing experience. Highly recommend this course to everyone. The pacing was perfect, and the materials were well-organized. It really helped me understand the complex topics, and the projects were fun and challenging!",
        },
        {
          name: "Michael Brown",
          img: "https://via.placeholder.com/50",
          rating: 3,
          comments:
            "The course was good, but I expected more depth in some areas. Some of the lessons were a bit too basic, and I would have liked more advanced content. However, the instructor did a great job of explaining things clearly.",
        },
        {
          name: "Emily Johnson",
          img: "https://via.placeholder.com/50",
          rating: 5,
          comments:
            "Great instructor and very well-structured content. I learned a lot! The hands-on exercises were particularly helpful, and the community support was fantastic. This course gave me the confidence to start applying my new skills right away.",
        },
        {
          name: "Chris Lee",
          img: "https://via.placeholder.com/50",
          rating: 2,
          comments:
            "Not what I expected. The material was too basic for me, and I didn’t feel like I got much value from it. It might be good for beginners, but for someone with experience, it felt like a repeat of things I already knew.",
        },
        {
          name: "Alex Martinez",
          img: "https://via.placeholder.com/50",
          rating: 4,
          comments:
            "Very informative, but could use more real-life examples. While the content was solid, I felt that applying the concepts to real-world scenarios would have enhanced my learning experience. Still, it’s a good course overall.",
        },
      ],
      mentor1: {
        name: "Loretta Liew",
        description:
          "Hi there! I'm Loretta Liew, a dedicated mentor passionate about guiding others in their personal and professional growth. With years of experience, I help individuals achieve their fullest potential and goals.",
        img: "lorettaliew.png",
      },
      lessons: {
        L101: {
          name: "Lesson 1",
          content: [
            {
              id: "vid1_1",
              typeof: "video",
              duration: "10min",
              name: "Video 1: Introduction",
              icon: "bi-play-fill",
            },
            {
              id: "q_1_1",
              typeof: "quiz",
              duration: "10min",
              name: "Quiz 1: Introduction",
              icon: "bi-lightbulb",
            },
          ],
        },
        L102: {
          name: "Lesson 2",
          content: [
            {
              id: "vid2_1",
              typeof: "video",
              duration: "10min",
              name: "Video 2: Variables",
              icon: "bi-play-fill",
            },
            {
              id: "q_2_1",
              typeof: "quiz",
              duration: "10min",
              name: "Quiz 2: Variables",
              icon: "bi-lightbulb",
            },
          ],
        },
      },
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
    formatType(type) {
      return type.charAt(0).toUpperCase() + type.slice(1);
    },
  },
  mounted() {
    console.log("This page has loaded");
    const storedCourse = sessionStorage.getItem("selectedCourse");
    if (storedCourse) {
      this.course = JSON.parse(storedCourse);
      console.log(this.course);
    } else {
      console.log("No course data found in sessionStorage");
    }
  },
};
</script>




<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>