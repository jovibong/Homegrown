<template>
  <div>
    <!--Back Button and Course Title-->
    <section id="Title" class="container pt-3 pb-0 fade-in-top">
      <div class="container mx-auto mb-4 text-center">
        <h2 class="text-primary fw-bold mb-0 display-5">{{ course_name }}</h2>
      </div>
      <!-- Lesson Name -->
      <h3 class="text-black display-5 mt-3 text-center">
        {{ lesson_item.name }}
      </h3>
    </section>

    <section id="question_review" class="container p-0 accordion">
      <div class="h2 mx-0 mb-3">
        <b>Questions Review </b>
        <span class="h3 text-muted">({{ num_questions }})</span>
      </div>
      <div
        v-for="(question, key) in questions"
        class="fade-in-bottom my-3 border border-0"
        :ref="key"
        type="button"
        :key="key"
        @click="toggleAccordion(key)"
      >
        <div
          class="card shadow-sm container-fluid p-0 m-0 hover-animate hover-less"
        >
          <div class="card-body align-items-center">
            <div class="d-none d-md-inline-flex row container-fluid">
              <div class="col-1 d-flex align-items-center">
                <div
                  class="d-md-inline-flex d-none rounded-circle bg-secondary d-flex align-items-center text-center justify-content-center p-4 fs-4"
                  style="height: 45px; width: 45px"
                >
                  {{ key + 1 }}
                </div>
              </div>
              <div class="col-11 d-flex align-items-center p-0">
                {{ question.question }}
              </div>
            </div>
            <div
              class="d-inline-flex d-md-none align-items-center row container-fluid"
            >
              <div class="col-10 p-0">
                <h4 class="m-0 p-0">Question {{ key + 1 }}:</h4>
              </div>
              <div class="col-2">
                <i class="bi bi-chevron-down fs-3"></i>
              </div>
            </div>
            <div
              :ref="'collapse' + key"
              class="row container-fluid content"
              data-bs-parent="#question_review"
            >
              <div class="p-0">
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
                          class="col-3 rounded-circle d-flex align-items-center justify-content-center bg-secondary p-4 fs-4 m-0"
                          style="height: 45px; width: 45px"
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
    <router-link
      to="individualCoursePage"
      class="btn btn-warning text-dark d-flex align-items-center justify-content-center col-lg-3 col-md-4 hover-animate py-3 my-2"
    >
      <i class="bi bi-arrow-left me-2"></i>
      <span class="d-none d-md-inline">Back to course overview</span>
      <span class="d-inline d-md-none">Course Overview</span>
    </router-link>
  </div>
</template>


<script>
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/initialize"; // Adjust path if necessary

export default {
  data() {
    return {
      questions: null,
      lesson_item: {},
      course: null,
      storedLessonId: "",
      course_name: "",
      num_questions: 0,
    };
  },
  methods: {
    getClass(question, option_key) {
      if (option_key == question.correct_answer) {
        return "bg-success text-white";
      } else {
        return "bg-white text-black";
      }
    },
    toggleAccordion(key) {
      const collapse_item = this.$refs[`collapse${key}`][0];
      if (collapse_item.style.height === collapse_item.scrollHeight + "px") {
        collapse_item.style.height = "0px";
      } else {
        collapse_item.style.height = collapse_item.scrollHeight + "px";
      }
    },
    async fetchQuestions(storedLessonId) {
      try {
        const questionsRef = collection(
          db,
          `courses/${this.course.id}/lessons/${storedLessonId}/lesson_items/${this.lesson_item.id}/questions`
        );
        const questionsSnap = await getDocs(questionsRef);
        this.questions = questionsSnap.docs.map((doc) => {
          const questionData = doc.data();
          const sortedOptions = Object.keys(questionData.options)
            .sort()
            .reduce((acc, key) => {
              acc[key] = questionData.options[key];
              return acc;
            }, {});

          return {
            ...questionData,
            options: sortedOptions,
            id: doc.id,
          };
        });
        console.log("Questions fetched 123:", this.questions);
    
      } catch (error) {
        console.error("Error fetching questions:", error);
      } finally {
        this.num_questions = this.questions.length;
      }
    },
  },
  async mounted() {
    this.course = JSON.parse(sessionStorage.getItem("selectedCourse"));
    console.log("course:", this.course);

    if (this.course) {
      this.course_name = this.course.name;
      console.log("course_name:", this.course_name);
    } else {
      console.log("course_name: Course not found in sessionStorage");
    }

    this.storedLessonId = JSON.parse(
      sessionStorage.getItem("selectedLessonId")
    );
    console.log("storedLessonId:", this.storedLessonId);

    this.lesson_item = JSON.parse(sessionStorage.getItem("selectedLessonItem"));
    console.log("lesson_item:", this.lesson_item.id);

    await this.fetchQuestions(this.storedLessonId);
    console.log("questions:", this.questions);
  },
};
</script>




<style scoped>
.content {
  height: 0px;
  overflow: hidden;
  transition: height 0.5s ease; /* Adjust duration as needed */
}
.dot {
  height: 10px;
  width: 10px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 8px;
}

.correct-dot {
  background-color: #4caf50;
  /* Green for Correct */
}

.missed-dot {
  background-color: #f44336;
  /* Red for Missed */
}
</style>