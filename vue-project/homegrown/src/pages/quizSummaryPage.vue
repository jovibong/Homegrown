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
    <section id="data">
      <div class="container mt-5">
        <div class="row mx-auto mb-5 d-flex align-items-stretch">
          <div class="col-md-4 mb-md-0 mb-3">
            <div class="card text-center shadow-sm h-100">
              <div class="card-body">
                <h6 class="card-title fw-bold text-muted text-start text-muted">
                  Summary
                </h6>
                <div class="row container-fluid" style="height: 120px">
                  <div class="col-6 h-100 d-flex justify-content-center">
                    <canvas id="myChart"></canvas>
                  </div>
                  <div class="col-6 d-flex align-items-center justify-content-center">
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
          <div class="col-md-4 mb-md-0 mb-3">
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
          <div class="col-md-4 mb-md-0 mb-3">
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
                    <span class="h4 fw-bold text-primary d-inline-block">{{ ranking[1] }}th</span>
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
      <div v-for="(question, key) in questions" class="fade-in-bottom my-3 border border-0" :ref="key" type="button"
        :key="key" @click="toggleAccordion(key)">
        <div class="card shadow-sm container-fluid p-0 m-0 hover-animate hover-less">
          <div class="card-body align-items-center">
            <div class="d-none d-md-inline-flex row container-fluid">
              <div class="col-1 d-flex align-items-center">
                <div
                  class="d-md-inline-flex d-none rounded-circle bg-secondary d-flex align-items-center text-center justify-content-center p-4 fs-4"
                  style="height: 45px; width: 45px">
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
            <div class="d-inline-flex d-md-none align-items-center row container-fluid">
              <div class="col-10 p-0">
                <h4 class="m-0 p-0">
                  Question {{ key + 1 }}:
                  <span v-if="question.correct_answer == answers[key]" class="text-success ms-2">
                    Correct
                  </span>
                  <span v-else class="text-danger ms-2"> Wrong </span>
                </h4>
              </div>
              <div class="col-2">
                <i class="bi bi-chevron-down fs-3"></i>
              </div>
            </div>
            <div :ref="'collapse' + key" class="row container-fluid content" data-bs-parent="#question_review">
              <div class="p-0">
                <div class="d-md-none d-inline py-3">
                  {{ question.question }}
                </div>
                <div class="row container-fluid px-0 mx-0 d-flex">
                  <div class="col-1 p-0"></div>
                  <div class="col-md-6 col-11 ps-0">
                    <div v-for="(option, option_key) in question.options" :key="option_key">
                      <div class="row container-fluid rounded-pill d-flex align-items-center my-2 ps-0 pe-3"
                        :class="getClass(question, option_key, key)">
                        <div
                          class="col-3 rounded-circle d-flex align-items-center justify-content-center bg-secondary p-4 fs-4 m-0"
                          style="height: 45px; width: 45px">
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
    <router-link to="individualCoursePage"
      class="btn btn-warning text-dark d-flex align-items-center justify-content-center col-lg-3 col-md-4 hover-animate py-3 my-2"
      @click="submit_quiz()">
      <i class="bi bi-arrow-left me-2"></i>
      <span class="d-none d-md-inline">Back to course overview</span>
      <span class="d-inline d-md-none">Course Overview</span>
    </router-link>

    <div class="col-md-2"></div>
    <router-link to="videoPage"
      class="btn btn-warning text-dark d-flex align-items-center col-lg-3 col-md-4 justify-content-center hover-animate py-3 my-2"
      @click="submit_quiz()">
      <span class="d-none d-md-inline text-end">Continue to next lesson</span>
      <span class="d-inline d-md-none text-end">Next Lesson</span>
      <i class="bi bi-arrow-right ms-2"></i>
    </router-link>

    <div class="col-lg-2 col-md-1"></div>
  </div>
</template>


<script>
import Chart from "chart.js/auto";
import { doc, updateDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/initialize"; // Adjust path if necessary

export default {
  data() {
    return {
      questions: {},
      lesson_item: {},
      course: null,
      answers: [],
      score: 0,
      user: "",
      storedLessonId: "",
      course_name: "",
      is_last_quiz: false, // Initialize is_last_quiz to false
    };
  },
  methods: {
    async submit_quiz() {
      try {
        const lessonItemRef = doc(
          db,
          `users/${this.user}/ongoing_courses/${this.course.id}/progress/${this.storedLessonId}/lesson_items/${this.lesson_item.id}`
        );

        // Mark the lesson item as completed
        await updateDoc(lessonItemRef, {
          answers: this.answers,
          completed: true,
        });

       // console.log("Quiz answers submitted successfully and marked as completed.");

        // Calculate and update percentage completed
        await this.updatePercentageCompleted();

        if (!this.is_last_quiz) {
          await this.loadNextLesson();
        } else {
         // console.log("This was the last quiz in the course.");
        }
      } catch (error) {
      //  console.error("Error submitting quiz answers:", error);
      }
    },
    async loadNextLesson() {
      try {
        const lessonsRef = collection(db, `courses/${this.course.id}/lessons`);
        const lessonsSnap = await getDocs(lessonsRef);
        const lessons = lessonsSnap.docs.sort((a, b) => a.id.localeCompare(b.id));
        const currentIndex = lessons.findIndex((lesson) => lesson.id === this.storedLessonId);

        if (currentIndex !== -1 && currentIndex + 1 < lessons.length) {
          const nextLessonDoc = lessons[currentIndex + 1];
          sessionStorage.setItem("selectedLessonId", JSON.stringify(nextLessonDoc.id));

          const lessonItemsRef = collection(nextLessonDoc.ref, "lesson_items");
          const lessonItemsSnap = await getDocs(lessonItemsRef);
          const sortedItems = lessonItemsSnap.docs.sort((a, b) => a.id.localeCompare(b.id));
          const firstLessonItem = sortedItems[0].data();

          sessionStorage.setItem("selectedLessonItem", JSON.stringify({
            id: sortedItems[0].id,
            ...firstLessonItem,
          }));
         // console.log("Updated to next lesson and first lesson item.");
        } else {
        //  console.log("No more lessons available.");
        }
      } catch (error) {
      //  console.error("Error loading next lesson:", error);
      }
    },
   async updatePercentageCompleted() {
  try {
    // Reference to the lessons collection within the user's ongoing course
    const lessonsRef = collection(
      db,
      `users/${this.user}/ongoing_courses/${this.course.id}/progress`
    );

    const lessonsSnap = await getDocs(lessonsRef);

    let totalItems = 0;
    let completedItems = 0;

    // Loop through each lesson and aggregate progress
    for (const lessonDoc of lessonsSnap.docs) {
      const lessonId = lessonDoc.id;

      // Reference to the lesson items collection within each lesson
      const lessonItemsRef = collection(
        db,
        `users/${this.user}/ongoing_courses/${this.course.id}/progress/${lessonId}/lesson_items`
      );

      const lessonItemsSnap = await getDocs(lessonItemsRef);
      totalItems += lessonItemsSnap.size;
      completedItems += lessonItemsSnap.docs.filter((doc) => doc.data().completed === true).length;
    }

    // Calculate the percentage completed
    const percentageCompleted = totalItems > 0 
      ? Math.round((completedItems / totalItems) * 100)
      : 0;

    // Update the course document with the new percentage completed
    const courseRef = doc(
      db,
      `users/${this.user}/ongoing_courses/${this.course.id}`
    );
    await updateDoc(courseRef, { percentage_completed: percentageCompleted });

    //console.log(`Updated percentage completed: ${percentageCompleted}%`);
  } catch (error) {
    //console.error("Error updating percentage completed:", error);
  }
},

    async checkIfLastQuiz() {
      try {
        const lessonsRef = collection(db, `courses/${this.course.id}/lessons`);
        const lessonsSnap = await getDocs(lessonsRef);
        const lessons = lessonsSnap.docs.sort((a, b) => a.id.localeCompare(b.id));
        const lessonIds = lessons.map((doc) => doc.id);

        const isLastLesson = this.storedLessonId === lessonIds[lessonIds.length - 1];

        if (isLastLesson) {
          const lessonItemsRef = collection(
            db,
            `courses/${this.course.id}/lessons/${this.storedLessonId}/lesson_items`
          );
          const lessonItemsSnap = await getDocs(lessonItemsRef);
          const lessonItems = lessonItemsSnap.docs.sort((a, b) => a.id.localeCompare(b.id));
          const lessonItemIds = lessonItems.map((doc) => doc.id);

          const isLastItem = this.lesson_item.id === lessonItemIds[lessonItemIds.length - 1];
          this.is_last_quiz = isLastItem;
        }
      } catch (error) {
       // console.error("Error checking if last quiz:", error);
      }
    },
    getClass(question, option_key, key) {
      if (option_key == question.correct_answer) {
        return "bg-success text-white";
      } else if (option_key == this.answers[key]) {
        return "bg-danger text-white";
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
  },
  computed: {
    num_wrong() {
      return this.questions.length - this.score;
    },
    improvement() {
      return Math.round(
        (this.score / this.questions.length / this.previous_quiz_score) * 100 - 100,
        0
      );
    },
    score_in_percentage() {
      return Math.round((this.score / this.questions.length) * 100, 0);
    },
    previous_quiz_score() {
      const numbers = [0.1, 0.2, 0.25, 0.5, 0.6, 0.7, 0.75, 0.8, 0.9, 1];
      const randomIndex = Math.floor(Math.random() * numbers.length);
      return numbers[randomIndex];
    },
    ranking() {
      const percentageBeaten = Math.floor(Math.random() * (95 - 50 + 1)) + 50;
      const rank = Math.round((1 - (percentageBeaten - 50) / 45) * 2000);
      const percentageString = `${percentageBeaten}%`;

      return [percentageString, rank];
    },
  },
  async mounted() {
    const userObject = JSON.parse(sessionStorage.getItem("user")) ||
      JSON.parse(localStorage.getItem("user"));
    if (userObject) {
      this.user = userObject.uid;
    }
    this.answers = JSON.parse(sessionStorage.getItem("user_answers"));
    this.score = JSON.parse(sessionStorage.getItem("user_score"));
    this.questions = JSON.parse(sessionStorage.getItem("selected_questions"));
    this.lesson_item = JSON.parse(sessionStorage.getItem("selectedLessonItem"));
    this.course = JSON.parse(sessionStorage.getItem("selectedCourse"));
    this.course_name = this.course.name;
    this.storedLessonId = JSON.parse(sessionStorage.getItem("selectedLessonId"));

    await this.checkIfLastQuiz();

    const ctx = document.getElementById("myChart");
    const checkChartLoaded = () => {
      if (typeof Chart !== "undefined") {
        new Chart(ctx, {
          type: "doughnut",
          data: {
            datasets: [
              {
                data: [this.score, this.questions.length - this.score],
                backgroundColor: ["rgb(76, 175, 80)", "rgb(244, 67, 54)"],
                hoverOffset: 4,
              },
            ],
          },
          options: {
            cutout: "65%",
          },
        });
      } else {
        setTimeout(checkChartLoaded, 100);
      }
    };

    checkChartLoaded();
  },
};
</script>




<style scoped>
.content {
  height: 0px;
  overflow: hidden;
  transition: height 0.5s ease;
  /* Adjust duration as needed */
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