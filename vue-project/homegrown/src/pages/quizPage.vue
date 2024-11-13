<template>
<div>
  <loading-animation v-if="questions_loading" class="mt-5"></loading-animation>
  <div v-else>
    <section id="Title" class="container pt-3 pb-0 fade-in-top">
      <div class="container mb-4">
        <div class="row">
          <!-- Back Button -->
          <div class="col-2 d-flex align-items-center">
            <router-link to="individualCoursePage"
              class="btn btn-warning text-dark d-flex align-items-center"
            >
              <i class="bi bi-arrow-left me-1"></i>
              <span class="d-none d-lg-inline">Back to course overview</span>
              <span class="d-inline d-lg-none">Back</span>
            </router-link>
          </div>
          <!-- Course Title Large (Centered) -->
          <div class="col-8 text-center">
            <h2 class="text-primary fw-bold mb-0 display-5">
              {{ course_name }}
            </h2>
          </div>
          <!-- Empty column for spacing/flexibility -->
          <div class="col-2"></div>
        </div>
        <!-- Lesson Name -->
        <h3 class="text-black display-5 mt-3 text-center">{{ lesson.name }}</h3>
      </div>
    </section>

    <section id="content" class="container mb-4">
      <div class="fade-in-top">
        <!--Lesson Title -->
        <h3 class="text-black my-2">{{ lesson.title }}</h3>
        <!--Lesson Description-->
        <p v-html="lesson.description"></p>
      </div>
    </section>

    <section id="question" v-if="has_questions()">
      <p class="text-center text-muted display-6 mt-5 fade-in-top">
        Question {{ current_question }}/{{ num_questions }}
      </p>
      <h2
        class="text-center fade-in-top"
        v-if="questions[current_question - 1]"
      >
        {{ questions[current_question - 1].question }}
      </h2>
      <div class="container mt-5 mb-3" v-if="questions[current_question - 1]">
        <ul class="list-unstyled push-in-right">
          <li
            v-for="(option, key) in questions[current_question - 1].options"
            :class="[
              'd-flex align-items-center mb-3 p-3 rounded hover-animate hover-less border border-1',
              { 'bg-primary text-white': selected_option === key },
            ]"
            @click="select_option(key)"
            :key="key"
          >
            <span
              class="fw-bold h4 d-flex align-items-center justify-content-center me-3 rounded-circle bg-secondary mb-0"
              style="width: 40px; height: 40px"
              >{{ key }}</span
            >
            <span class="h6 mb-0">{{ option }}</span>
          </li>
        </ul>
      </div>
      <div class="container w-50 d-flex justify-content-center mb-3">
        <button
          v-if="selected_option && !submitted"
          class="btn btn-primary btn-lg rounded-pill d-inline-flex align-items-center m-2 text-secondary fw-bold justify-content-center fade-in-bottom hover-animate"
          @click="submit_option"
        >
          Submit Answer <i class="bi bi-arrow-right ms-2"></i>
        </button>
      </div>
    </section>

    <section
      v-if="submitted"
      id="answer-review"
      class="fade-in-bottom text-center"
    >
      <div v-if="is_correct">
        <h4 class="text-center">You are Correct! Keep up the good work!</h4>
      </div>
      <div v-else>
        <h4 class="text-center">
          Oh no! Looks like there was some mistake in your work. The correct
          answer is {{ questions[current_question - 1].correct_answer }}.
        </h4>
      </div>
      <div
        class="container w-50 d-flex justify-content-center text-center mt-3 fade-in-top"
      >
        <div class="card p-4">
          <h5 class="mb-3">Rate your experience</h5>
          <div class="d-flex justify-content-center row">
            <div class="col-5">
              <button
                class="btn btn-md"
                :class="
                  selected_vote === 'up' ? 'btn-success' : 'btn-outline-success'
                "
                @click="submit_vote('up')"
              >
                <i class="bi bi-hand-thumbs-up"></i> Good
              </button>
            </div>
            <div class="col-2"></div>
            <div class="col-5">
              <button
                class="btn btn-md"
                :class="
                  selected_vote === 'down' ? 'btn-danger' : 'btn-outline-danger'
                "
                @click="submit_vote('down')"
              >
                <i class="bi bi-hand-thumbs-down"></i> Bad
              </button>
            </div>
          </div>
        </div>
      </div>
      <router-link
        to="quizSummaryPage"
        v-if="current_question == last_question"
        class="btn btn-primary btn-lg rounded-pill d-inline-flex align-items-center m-3 text-secondary fw-bold justify-content-center hover-animate"
        @click="submit_quiz"
      >
        Go to Quiz Summary <i class="bi bi-arrow-right ms-2"></i>
      </router-link>

      <button
        v-else
        class="btn btn-primary btn-lg rounded-pill d-inline-flex align-items-center m-3 text-secondary fw-bold justify-content-center hover-animate"
        @click="go_to_next"
      >
        Continue to next question <i class="bi bi-arrow-right ms-2"></i>
      </button>
    </section>
  </div>
  </div>
</template>

<script>
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/initialize"; // Adjust the path as needed
import loadingAnimation from "../components/loadingAnimation.vue";

export default {
   components: {
    loadingAnimation,
  },
  data() {
    return {
      questions: [],
      lesson: {},
      course_name: "",
      course: null,
      current_question: 1,
      num_questions: 0,
      score: 0,
      selected_vote: null,
      selected_option: null,
      submitted: false,
      is_correct: false,
      answers: [],
      userType: "",
      questions_loading: true,
    };
  },
  methods: {
    has_questions() {
      return this.questions.length > 0;
    },
    submit_vote(vote) {
      this.selected_vote = vote;
    },
    select_option(key) {
      this.selected_option = this.selected_option === key ? null : key;
    },
    submit_option() {
      let correct_ans = this.questions[this.current_question - 1].correct_answer;
      if (correct_ans === this.selected_option) {
        this.is_correct = true;
        this.score += 1;
      }
      this.submitted = true;
      this.answers.push(this.selected_option);
    },
    go_to_next() {
      this.is_correct = false;
      this.submitted = false;
      this.selected_option = null;
      this.current_question++;
      this.selected_vote = null;
    },
    submit_quiz() {
      sessionStorage.setItem("user_answers", JSON.stringify(this.answers));
      sessionStorage.setItem("user_score", JSON.stringify(this.score));
      sessionStorage.setItem("selected_questions", JSON.stringify(this.questions));
    },
    async fetchQuestions(storedLessonId) {
      try {

        const questionsRef = collection(
          db,
          `courses/${this.course.id}/lessons/${storedLessonId}/lesson_items/${this.lesson.id}/questions`
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
       // console.log("Questions fetched:", this.questions);
      } catch (error) {
       // console.error("Error fetching questions:", error);
      } finally {
        this.num_questions = this.questions.length;
        this.questions_loading = false;
      }
    },
    async waitForLessonData() {
      return new Promise((resolve) => {
        const interval = setInterval(() => {
          const storedLessonItem = sessionStorage.getItem("selectedLessonItem");
          
          const storedCourse = sessionStorage.getItem("selectedCourse");
          const storedLessonId = sessionStorage.getItem("selectedLessonId");

          if (storedLessonItem && storedCourse && storedLessonId) {
            const lesson = JSON.parse(storedLessonItem);

            if (lesson.typeof === "quiz") {
              clearInterval(interval);
              this.lesson = lesson;
              
              this.course = JSON.parse(storedCourse);
              this.course_name = this.course.name;
              resolve(JSON.parse(storedLessonId));
            }
          }
        }, 100); // Check every 100ms
      });
    },
  },
  computed: {
    last_question() {
      return this.questions.length;
    },
  },
  async mounted() {
    const storedLessonId = await this.waitForLessonData();
    await this.fetchQuestions(storedLessonId);
  },
};
</script>
