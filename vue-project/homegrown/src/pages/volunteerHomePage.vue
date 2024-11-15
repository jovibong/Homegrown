<template>
  <div id="main-container">
    <!-- Navbar -->
    <div id="navbar"></div>

    <section id="intro" class="container pt-5 pb-0 fade-in">
        <div class="row align-items-center">
          <div class="col-lg-6 text-start"> <!-- Adjust padding here -->
            <h1 class="display-4 fw-bold home">Welcome!</h1>
            <p class="lead text-muted">
              Thank you for joining our vibrant community! Step into the rewarding role of a mentor and make a real impact
              by guiding foreign workers through various courses. Engage with them at enriching events across Singapore,
              fostering connections and making a difference. Ready to embark on this meaningful journey? Let’s get
              started!
            </p>
            <div class="mt-4">
              <router-link to='/mentorshipPage' class="btn btn-warning btn-secondary btn-lg me-3 text-dark">MENTOR
                NOW</router-link>
              <a href="https://www.youtube.com/embed/cdiq_QcHF8I" class="ms-3 text-primary d-inline-flex align-items-center">
                <i class="bi bi-play-circle-fill me-2 fs-3"></i>
                See how it works?
              </a>
            </div>
          </div>
          <div class="col-lg-6 d-flex justify-content-center">
            <img src="../img/smiling-happy-indian.png" alt="Smiling Happy Worker" class="img-fluid centered-img" />
          </div>
        </div>
      </section>
    <!-- Stats Section -->
    <section id="stats" class="bg-primary py-3 section-decor fade-in">
      <div class="container">
        <div class="row text-white text-center">
          <div class="col-md-4 d-flex flex-column align-items-center">
            <h1 class="fw-bold display-2">50+</h1>
            <p class="mb-0">Total Courses</p>
          </div>
          <div class="col-md-4 d-flex flex-column align-items-center">
            <h1 class="fw-bold display-2">100</h1>
            <p class="mb-0">Volunteers</p>
          </div>
          <div class="col-md-4 d-flex flex-column align-items-center">
            <h1 class="fw-bold display-2">5K+</h1>
            <p class="mb-0">Workers helped</p>
          </div>
        </div>
      </div>
    </section>

    <!-- About Section -->
    <section id="about-section" class="py-5 fade-in">
      <div class="container">
        <div class="row">
          <div class="col-lg-12 text-center">
            <h1 class="text-primary fw-bold py-2">About <span class="text-dark">HomeGrown</span></h1>
            <h3 class="text-primary fw-bold">Upskilling Competencies | <span class="text-dark">Managing Finances</span>
              | Building Communities</h3>
            <p class="lead text-muted">
              Homegrown is a web-based platform designed to empower foreign workers in Singapore through upskilling,
              financial management, and community support. Our goal is to provide workers with tailored educational
              resources, easy-to-use budgeting tools, and opportunities to connect with mentors and fellow workers. By
              fostering a sense of community and offering practical solutions, Homegrown aims to make life in Singapore
              smoother and more fulfilling for foreign workers.
            </p>
          </div>
        </div>
        <div class="row mt-4">
          <div class="col-2"></div>
          <div class="col-lg-8">
            <div class="position-relative d-flex justify-content-center">
              <iframe width="640" height="360" src="https://www.youtube.com/embed/XBUkvOCcaHY"
                title="YouTube video player" frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen class="rounded-5 mx-auto">
              </iframe>
            </div>
          </div>
          <div class="col-2"></div>
        </div>
      </div>
    </section>

    <!-- Effortless Enrollment Section -->
    <section id="enrollment" class="pt-5 bg-secondary">
      <div class="container">
        <div class="row align-items-center py-0 fade-in-top">
          <!-- Image Column -->
          <img src="../img/friendly-confident-woman-writing-her-organizer-isolated-white-wall 1.png" alt="Student"
            class="img-fluid position-relative col-lg-5 text-center d-none d-md-inline" />
          <!-- Text and List Column -->
          <div id="app_steps" class="col-lg-7">
            <h2 class="fw-bold mb-3 display-5">Effortless Enrollment</h2>
            <p class="lead text-dark mb-4">
              Follow these simple steps to start your journey!
            </p>
            <ul class="list-unstyled">
              <li v-for="(step, key) in steps" :key="key"
                class="d-flex align-items-center mb-3 p-3 bg-white rounded shadow-sm push-in-right">
                <span
                  class="fw-bold h4 d-flex align-items-center justify-content-center me-3 rounded-circle bg-secondary mb-0"
                  style="width: 40px; height: 40px">{{ key + 1 }}</span>
                <span class="h6 mb-0">{{ step }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Events Section -->
    <section class="events-section fade-in">
      <div class="container">
        <h2 class="text-center fw-bold">
          Popular Past Events</h2>
        <div class="row">
          <div class="col-12 col-lg-4 mb-4">
            <div class="card h-100">
              <img src="../img/cultural.jpg" class="card-img-top" alt="Event 1" />
              <div class="card-body">
                <h5 class="card-title">Cultural Exchange</h5>
                <p class="card-text">Learn and immerse yourself in the various cultures of migrant workers.</p>
              </div>
            </div>
          </div>
          <div class="col-12 col-lg-4 mb-4">
            <div class="card h-100">
              <img src="../img/heritagewalk.jpg" class="card-img-top" alt="Event 2" />
              <div class="card-body">
                <h5 class="card-title">Heritage Walk</h5>
                <p class="card-text">Explore Singapore's historical landmarks with workers.</p>
              </div>
            </div>
          </div>
          <div class="col-12 col-lg-4 mb-4">
            <div class="card h-100">
              <img src="../img/volunteering.jpeg" class="card-img-top" alt="Event 3" />
              <div class="card-body">
                <h5 class="card-title">Volunteering Fair</h5>
                <p class="card-text">Discover opportunities to give back to the community.</p>
              </div>
            </div>
          </div>
          <div class="mt-3 text-end">
            <button class="btn btn-secondary">
            <router-link to="/eventPage" class="text-primary text-decoration-none">
              See more events
            </router-link>
          </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonial Section -->
    <section class="testimonial-section py-5 fade-in">
      <div class="container text-center">
        <h2 class="fw-bold">
          <span class="text-primary">What</span> Fellow Volunteers Say
        </h2>
        <p class="mb-4"></p>

        <div class="testimonial-box position-relative p-4 mx-auto mb-5">
          <div class="quote-icon position-absolute top-0 start-0" style="font-size: 3rem; margin-right: 10px;">
            <i class="bi bi-quote text-dark"></i>
          </div>
          <p class="text-white fs-5" style="padding-left: 2.5rem;"> <!-- Adjust padding-left as needed -->
            Homegrown has truly changed my outlook on Migrant Workers in Singapore. I’ve been able to use my skills to
            mentor some of the workers, connect with them and understand their stories. Beyond the hours accumulated,
            I'm glad that I got to make a difference in their lives.
          </p>
        </div>

        <div class="profile-box d-flex flex-column align-items-center">
          <div class="text-center">
            <img src="../img/student_male.jpeg" alt="James Thomas" class="rounded-circle profile-picture mb-3" />
            <h5 class="fw-bold mt-3">Tan Hong Wen</h5>
            <p class="text-muted">SMU Student</p>
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
      steps: [
        'Sign up for an account on Homegrown.',
        'Browse through the available courses and select one that interests you.',
        'Become a mentor.',
        'Track your hours.',
        'Go for events and impact the lives of the migrant workers!',
      ]
    };
  },
  name: 'HomegrownApp',
  mounted() {
    const faders = document.querySelectorAll(".fade-in");

    const appearOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px"
    };

    const appearOnScroll = new IntersectionObserver(function (entries, appearOnScroll) {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("show");
        appearOnScroll.unobserve(entry.target);
      });
    }, appearOptions);

    faders.forEach(fader => {
      appearOnScroll.observe(fader);
    });
  }
};
</script>

<style scoped>
.home {
  color: #525FE1;
  ;
}

.fade-in {
  opacity: 0;
  transform: translateY(50px);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}

.fade-in.show {
  opacity: 1;
  transform: translateY(0);
}

.profile-picture {
  width: 150px;
  /* Adjust as needed */
  height: 150px;
  /* Adjust as needed */
  border-radius: 50%;
  /* Makes the image circular */
  object-fit: cover;
  /* Resizes the image to fit within the container */
  object-position: center;
  /* Centers the image within the container */
  border: 2px solid #000;
  /* Optional: add a border */
}






/* Navbar */
#navbar {
  width: 100%;
}

/* Specific sections */
.intro,
.events-section,
.testimonial-section,
.enrollment {
  width: 100%;
  margin: 0 auto;
}

.decorative-element {
  position: absolute;
  top: 50%;
  /* Adjust based on where you want it vertically */
  left: 50%;
  /* Center horizontally */
  transform: translate(-50%, -50%);
  /* Center the element perfectly */
  max-width: 100%;
  /* Prevents the element from overflowing */
  overflow: hidden;
}

/* Ensure no decorative elements are causing overflow */
.container,
#main-container {
  position: relative;
  /* Allows positioning relative to this container */
  overflow: hidden;
  /* Clipping ensures no overflow */
}

.profile-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  /* Ensures text is centered */
}

.testimonial-box {
  background-color: #525FE1;
  /* Matches theme */
  border-radius: 15px;
  max-width: 800px;
  /* Center and prevent overflow */
  margin: 0 auto;
  /* Center the testimonial */
}
</style>