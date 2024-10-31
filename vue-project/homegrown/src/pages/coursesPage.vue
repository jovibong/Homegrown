<template>
  <div class="coursePage">
    <!--Ongoing Courses Section-->
    <section id="app_ongoing" class="container py-3 fade-in-top">
      <h2 class="text-primary fw-bold text-center mb-3 display-4">
        Ongoing Courses
      </h2>
      <p class="text-center text-muted mb-0 h5">
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
        <!-- Ongoing Course Card -->
        <div
          v-for="course in ongoing_courses"
          :key="course.id"
          class="col-md-4 mb-4"
        >
          <div class="card shadow-sm position-relative h-100 hover-animate">
            <div v-if="course.mentor" class="mentor-badge bg-primary">
              <span class="text-black">Mentor Included</span>
            </div>
            <div class="card-body">
              <div class="text-center mb-3">
                <i class="bi bi-book fs-2 text-primary"></i>
              </div>
              <h5 class="card-title fw-bold text-center px-2">
                {{ course.name }}
              </h5>
              <div class="text-center mb-2">
                <span
                  v-html="getRatingStars(course.rating)"
                  class="text-warning"
                ></span>
                <small class="text-muted d-block"
                  >{{ course.num_reviews }} Reviews</small
                >
              </div>
              <p class="card-text text-muted">
                {{ course.description }}
              </p>
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
        <!-- New Course Card -->
        <div
          v-for="course in new_courses"
          :key="course.id"
          class="col-md-4 mb-4 card-flip"
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
                <div class="rounded-pill bg-primary text-center text-secondary w-50 p-2 mt-3 fs-4 fw-bold mx-auto">
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
export default {
  data() {
    return {
      ongoing_courses: [
        {
          id: 101,
          name: "Introduction to Python",
          percentageCompleted: 60,
          rating: 3.6,
          num_reviews: 238,
          description:
            "Learn the basics of Python programming, including syntax, data types, and how to create simple applications. This course is perfect for beginners with no prior coding experience.",
          mentor: true,
        },
        {
          id: 102,
          name: "Web Development with HTML & CSS",
          percentageCompleted: 45,
          rating: 4.9,
          num_reviews: 150,
          description:
            "Master the fundamentals of web development by learning HTML and CSS. Build and style your own websites from scratch in this hands-on, beginner-friendly course.",
          mentor: false,
        },
        {
          id: 103,
          name: "Data Analysis with Excel",
          percentageCompleted: 80,
          rating: 4.3,
          num_reviews: 180,
          description:
            "This course covers essential data analysis techniques using Microsoft Excel. Learn how to manage data, use formulas, and create powerful visualizations to analyze information effectively.",
          mentor: true,
        },
        {
          id: 104,
          name: "JavaScript for Beginners",
          percentageCompleted: 25,
          rating: 4.8,
          num_reviews: 200,
          description:
            "This course introduces JavaScript, one of the most popular programming languages for web development. Learn how to make your websites interactive and dynamic through hands-on projects and examples.",
          mentor: false,
        },
      ],
      new_courses: [
        {
          id: 104,
          name: "Mandarin Language for Beginners",
          percentageCompleted: 50,
          rating: 4.8,
          num_reviews: 205,
          description:
            "Learn the basics of Mandarin, including pronunciation, simple phrases, and everyday vocabulary. Perfect for travelers and language enthusiasts.",
          mentor: true,
        },
        {
          id: 105,
          name: "Cyber Security Basics",
          percentageCompleted: 20,
          rating: 4.6,
          num_reviews: 120,
          description:
            "Understand the fundamentals of cyber security, including how to protect your data and recognize common threats. Ideal for beginners.",
          mentor: false,
        },
        {
          id: 106,
          name: "Introduction to JavaScript",
          percentageCompleted: 30,
          rating: 4.7,
          num_reviews: 150,
          description:
            "Dive into JavaScript programming, one of the core languages for web development. Learn syntax, basic functions, and how to build interactive websites.",
          mentor: true,
        },
        {
          id: 107,
          name: "Project Management Essentials",
          percentageCompleted: 65,
          rating: 4.9,
          num_reviews: 98,
          description:
            "Master the essentials of project management, including planning, execution, and risk management. This course is great for aspiring project managers.",
          mentor: true,
        },
        {
          id: 108,
          name: "Graphic Design with Adobe Illustrator",
          percentageCompleted: 40,
          rating: 4.4,
          num_reviews: 175,
          description:
            "Learn the fundamentals of graphic design using Adobe Illustrator. Perfect for anyone looking to enhance their design skills for professional or personal projects.",
          mentor: false,
        },
      ],
      steps: [
        "Sign Up",
        "Choose a Program",
        "Get a personal mentor",
        "Finish videos and quizzes",
        "Claim your certification!",
      ],
      course_images: {},
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
  },
  mounted() {
    var image_counter = 100;
    this.new_courses.forEach((course) => {
      this.course_images[
        course.id
      ] = `https://random.imagecdn.app/500/${image_counter}`;
      image_counter += 1;
    });
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

/*Hover effect*/
.course-card .card {
  transition: transform 0.3s, box-shadow 0.3s;
}

.course-card .card.hovered {
  transform: translateY(-15px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}
</style>