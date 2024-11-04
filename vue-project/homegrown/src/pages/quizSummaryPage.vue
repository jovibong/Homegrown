<template>
  <div>
    <!--Back Button and Course Title-->
    <section id="Title" class="container pt-3 pb-0 fade-in-top">
      <div class="container mx-auto mb-4 text-center">
        <h2 class="text-primary fw-bold mb-0 display-5">{{ course_name }}</h2>
      </div>
      <!-- Lesson Name -->
      <h3 class="text-black display-5 mt-3 text-center">{{ lesson.name }}</h3>
    </section>
    <section id="data">
      <div class="container mt-5">
        <div class="row mx-auto mb-5 d-flex align-items-stretch">
          <div class="col-4">
            <div class="card text-center shadow-sm h-100">
              <div class="card-body">
                <h6 class="card-title fw-bold text-muted text-start text-muted">
                  Summary
                </h6>
                <div class="row container-fluid" style="height: 120px">
                  <div class="col-6 h-100 d-flex justify-content-center">
                    <canvas id="myChart"></canvas>
                  </div>
                  <div
                    class="col-6 d-flex align-items-center justify-content-center"
                  >
                    <div>
                      <p class="mb-1">
                        <span class="dot correct-dot"></span> Correct
                        <span class="fw-bold">{{ score }}</span>
                      </p>
                      <p class="mb-1">
                        <span class="dot missed-dot"></span> Missed
                        <span class="fw-bold">{{ num_wrong }}</span>
                      </p>
                    </div>
                  </div>
                </div>
                <hr />
                <button class="btn btn-link text-warning fw-bold">SHARE</button>
              </div>
            </div>
          </div>
          <div class="col-4">
            <div class="card text-center shadow-sm h-100">
              <div class="card-body h-100">
                <h6 class="card-title fw-bold text-muted text-start text-muted">
                  Score
                </h6>
                <div class="display-4 text-primary fw-bold">
                  {{ score_in_percentage }}%
                </div>
                <div class="text-muted fw-bold text-center">
                  from {{ questions.length }} questions correct
                </div>

                <div class="container-fluid row mt-5">
                  <div class="col-6 text-center">
                    <div class="fw-bold fs-4">
                      {{ previous_quiz_score * 100 }}%
                    </div>
                    <div class="text-muted">Previous score</div>
                  </div>
                  <div class="col-6 text-center">
                    <div v-if="improvement > 0">
                      <div class="text-success fw-bold fs-4">
                        +{{ improvement }}%
                      </div>
                      <div class="text-muted">Improvement</div>
                    </div>
                    <div v-else>
                      <div class="text-danger fw-bold fs-4">
                        {{ improvement }}%
                      </div>
                      <div class="text-muted">Deprovement</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-4">
            <div class="card shadow-sm h-100">
              <div class="card-body h-100">
                <h6 class="card-title fw-bold text-muted text-start">
                  Leaderboard
                </h6>
                <ul>
                  <li class="mb-4">
                    You are ahead of <br />
                    <span class="display-5 text-primary fw-bold text-center">
                      {{ ranking[0] }}
                    </span>
                    of users.
                  </li>
                  <li>
                    You rank at the
                    <span class="h4 fw-bold text-primary d-inline-block"
                      >{{ ranking[1] }}th</span
                    >
                    of all users who have completed this quiz.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="question_review" class="container p-0 accordion">
      <div class="h2 mx-0 mb-3">
        <b>Questions Review </b>
        <span class="h3 text-muted">({{ questions.length }})</span>
      </div>
      <div
        v-for="(question, key) in questions"
        class="fade-in-bottom my-3 accordion-item border border-0"
        :ref="key"
        type="button"
        data-bs-toggle="collapse"
        :data-bs-target="'#collapse' + key"
        aria-expanded="true"
        :aria-controls="'collapse' + key"
        :key="key"
      >
        <div
          class="card shadow-sm container-fluid p-0 m-0 hover-animate hover-less"
        >
          <div class="card-body align-items-center">
            <div class="d-none d-md-inline-flex row container-fluid">
              <div class="col-1 d-flex align-items-center">
                <div
                  class="d-md-inline-flex d-none circle bg-secondary d-flex align-items-center text-center justify-content-center p-4 fs-4"
                >
                  {{ key + 1 }}
                </div>
              </div>
              <div class="col-9 d-flex align-items-center p-0">
                {{ question.question }}
              </div>
              <div class="col-2 d-flex justify-content-end">
                <div v-if="question.correct_answer == answers[key]">
                  <i class="bi bi-check-circle text-success fs-3"></i>
                </div>
                <div v-else>
                  <i class="bi bi-x-circle text-danger fs-3"></i>
                </div>
              </div>
            </div>
            <div
              class="d-inline-flex d-md-none align-items-center row container-fluid"
            >
              <div class="col-10 p-0">
                <h4 class="m-0 p-0">
                  Question {{ key + 1 }}:
                  <span
                    v-if="question.correct_answer == answers[key]"
                    class="text-success ms-2"
                  >
                    Correct
                  </span>
                  <span v-else class="text-danger ms-2"> Wrong </span>
                </h4>
              </div>
              <div class="col-2">
                <i class="bi bi-chevron-down fs-3"></i>
              </div>
            </div>
            <div
              :id="'collapse' + key"
              class="row container-fluid accordion-collapse collapse"
              data-bs-parent="#question_review"
            >
              <div class="accordion-body p-0">
                <div class="d-md-none d-inline py-3">
                  {{ question.question }}
                </div>
                <div class="row container-fluid px-0 mx-0 d-flex">
                  <div class="col-1 p-0"></div>
                  <div class="col-md-6 col-11 ps-0">
                    <div
                      v-for="(option, option_key) in question.options"
                      :key="option_key"
                    >
                      <div
                        class="row container-fluid rounded-pill d-flex align-items-center my-2 ps-0 pe-3"
                        :class="getClass(question, option_key, key)"
                      >
                        <div
                          class="col-3 circle d-flex align-items-center justify-content-center bg-secondary p-4 fs-4 m-0"
                        >
                          {{ option_key }}
                        </div>
                        <div class="col-9">
                          {{ option }}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="col-md-5 col-11">
                    <div class="text-muted fw-bold fs-4 row mb-3 ms-2">
                      Question Review
                    </div>
                    <div class="ms-2">{{ question.review }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>

  <div class="container-fluid row mx-auto my-5 d-flex justify-content-center">
    <div class="col-lg-2 col-md-1"></div>
    <a
      href="individual_course.html"
      class="btn btn-warning text-dark d-flex align-items-center justify-content-center col-lg-3 col-md-4 hover-animate py-3 my-2"
    >
      <i class="bi bi-arrow-left me-2"></i>
      <span class="d-none d-md-inline">Back to course overview</span>
      <span class="d-inline d-md-none">Course Overview</span>
    </a>
    <div class="col-md-2"></div>
    <a
      href="video_1.html"
      class="btn btn-warning text-dark d-flex align-items-center col-lg-3 col-md-4 justify-content-center hover-animate py-3 my-2"
    >
      <span class="d-none d-md-inline text-end">Continue to next lesson</span>
      <span class="d-inline d-md-none text-end">Next Lesson</span>
      <i class="bi bi-arrow-right ms-2"></i>
    </a>
    <div class="col-lg-2 col-md-1"></div>
  </div>
</template>

<script>
// import { Chart } from 'chart.js' // need to run npm install chart
export default {
  data() {
    return {
      questions: [
        {
          id: 101,
          question_number: 1,
          type: "multiple_choice",
          question:
            "Which version of Python is recommended for new users to install?",
          options: {
            A: "Python 2.7",
            B: "Python 3.x",
            C: "Python 1.5",
            D: "Python 4.0",
          },
          correct_answer: "B",
          review:
            "Python 3.x is the recommended version for new users to install because it is the latest major release with ongoing support and development. Python 2.7, though popular in the past, reached its end-of-life in January 2020, meaning it no longer receives updates or security patches. This shift encourages developers to use Python 3 for new projects and migrate older projects as well. Python 3.x includes numerous improvements and new features such as better Unicode support, new syntax for type hints, and enhanced libraries that make it more efficient and versatile. Consequently, beginners and professionals alike are advised to start with Python 3.x to benefit from the latest advancements in the language.",
        },
        {
          id: 102,
          question_number: 2,
          type: "multiple_choice",
          question:
            "What is the best way to verify that Python is correctly installed on your system?",
          options: {
            A: "python --install",
            B: "verify-python",
            C: "python --version",
            D: "python --check",
          },
          correct_answer: "C",
          review:
            "The most reliable way to confirm that Python is correctly installed is by running the command `python --version` in the terminal or command prompt. This command tells Python to display its version number, ensuring it’s installed and accessible from the command line. If Python is not installed or not properly configured in the system's PATH, this command will return an error, indicating that further installation steps may be necessary. The alternatives provided, such as `python --install` and `verify-python`, are not valid commands for this purpose, so using `python --version` is the most straightforward method to verify a successful Python installation.",
        },
        {
          id: 103,
          question_number: 3,
          type: "multiple_choice",
          question:
            "Which package manager is commonly used on macOS to install Python?",
          options: {
            A: "apt-get",
            B: "Homebrew",
            C: "yum",
            D: "Chocolatey",
          },
          correct_answer: "B",
          review:
            "On macOS, Homebrew is the preferred package manager for installing software, including Python. Homebrew simplifies the process of downloading, installing, and managing software packages by handling dependencies and ensuring the latest versions are available. macOS does not come with a built-in package manager, so users often install Homebrew to manage software installations easily. Unlike package managers like `apt-get` (typically used on Debian-based Linux distributions) or `yum` (used on Red Hat-based systems), Homebrew was designed specifically for macOS, making it the go-to option for macOS users needing a streamlined installation process for Python and other software.",
        },
        {
          id: 104,
          question_number: 4,
          type: "multiple_choice",
          question:
            "What option should you select during Python installation to make it accessible from the command line?",
          options: {
            A: "Install Python for All Users",
            B: "Add Python to PATH",
            C: "Install Documentation",
            D: "Install PIP",
          },
          correct_answer: "B",
          review:
            "When installing Python on your system, selecting the 'Add Python to PATH' option is crucial if you want to access Python from the command line easily. Adding Python to the PATH environment variable allows your system to recognize Python commands from any directory, streamlining the process of running Python scripts or launching the Python interpreter. Without adding Python to PATH, you would need to specify the full path to the Python executable every time you want to use it, which can be cumbersome. Including Python in PATH improves accessibility and ease of use, particularly for those who frequently work with Python from the command line.",
        },
        {
          id: 105,
          question_number: 5,
          type: "multiple_choice",
          question:
            "Which command is used to create a virtual environment in Python?",
          options: {
            A: "python -m venv [environment-name]",
            B: "python create-env [environment-name]",
            C: "python --virtual [environment-name]",
            D: "python make-env [environment-name]",
          },
          correct_answer: "A",
          review:
            "To create a virtual environment in Python, the `python -m venv [environment-name]` command is used. This command sets up an isolated Python environment, allowing you to install packages and dependencies specific to a project without affecting other projects or the global Python environment. Virtual environments are especially useful in larger projects where different dependencies or versions of libraries are needed. By running `python -m venv` followed by the environment name, Python generates a separate directory with its own copy of the Python interpreter and a site-packages directory for project-specific dependencies. This method helps maintain a clean, organized development setup, making it an essential tool for Python developers.",
        },
      ],
      lesson: {
        id: "Q001",
        name: "Lesson 1: Quiz",
        title: "Installing Python",
        description: `  
                Feel free to go back to the lesson if you are unable to answer the questions.
            `,
        typeof: "quiz",
        next_name: "Lesson 1: Quiz",
        rating: 84,
      },
      course_name: "Introduction to Python",
      answers: [],
      score: 0,
      ranking: ["86%", 1435],
      previous_quiz_score: 0.75,
    };
  },
  methods: {
    getClass(question, option_key, key) {
      if (option_key == question.correct_answer) {
        return "bg-success text-white";
      } else if (option_key == this.answers[key]) {
        return "bg-danger text-white";
      } else {
        return "bg-white text-black";
      }
    },
  },
  computed: {
    num_wrong() {
      return this.questions.length - this.score;
    },
    improvement() {
      return Math.round(
        (this.score / this.questions.length / this.previous_quiz_score) * 100 -
          100,
        0
      );
    },
    score_in_percentage() {
      return Math.round((this.score / this.questions.length) * 100, 0);
    },
  },
  mounted() {
    // Load answers from localStorage when Vue instance is mounted
    this.answers = JSON.parse(localStorage.getItem("user_answers"));
    this.score = JSON.parse(localStorage.getItem("user_score"));

    // Create Chart
    // const ctx = document.getElementById("myChart");
    // new Chart(ctx, {
    //   type: "doughnut",
    //   data: {
    //     datasets: [
    //       {
    //         data: [this.score, this.questions.length - this.score],
    //         backgroundColor: ["rgb(76, 175, 80)", "rgb(244, 67, 54)"],
    //         hoverOffset: 4,
    //       },
    //     ],
    //   },
    //   options: {
    //     cutout: "65%",
    //   },
    // });
  },
};
</script>