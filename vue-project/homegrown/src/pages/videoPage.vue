<template>
  <div>
    <section id="Title" class="container py-3 fade-in-top">
      <div class="container mb-4">
        <div class="row">
          <!-- Back Button -->
          <div class="col-2 d-flex align-items-center">
            <router-link
              :to="
                userType === 'volunteer'
                  ? `mentorshipCourse`
                  : 'individualCoursePage'
              "
              class="btn btn-warning text-dark d-flex align-items-center"
            >
              <i class="bi bi-arrow-bar-left me-1"></i>
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
        <h3 class="text-black my-3">{{ lesson.title }}</h3>
        <!--Lesson Description-->
        <p v-html="lesson.description"></p>
      </div>
      <div
        v-if="lesson.link"
        class="container-fluid d-flex justify-content-center fade-in-bottom"
      >
        <img
          :src="getThumbnailUrl(lesson.link)"
          width="640"
          height="340"
          class="rounded-5"
        />
        <a
          :href="lesson.link"
          target="_blank"
          class="position-absolute top-50 start-50 translate-middle text-white"
          @click="watchvideo"
        >
          <i class="bi bi-play-circle-fill display-2"></i>
        </a>
      </div>
      <div
        v-if="video_watched"
        class="container w-50 d-flex justify-content-center text-center mt-3 fade-in-top"
      >
        <div class="card p-4">
          <h5 class="mb-3">Was this lesson useful?</h5>
          <div class="d-flex justify-content-center row">
            <div class="col-5">
              <button
                class="btn btn-md"
                :class="
                  selected_vote === 'up' ? 'btn-success' : 'btn-outline-success'
                "
                @click="submit_vote('up')"
              >
                <i class="bi bi-hand-thumbs-up"></i> Yes
              </button>
              <p v-if="selected_vote" class="mt-2 mb-0 fade-in-bottom">
                <span class="count-animate" :data-count-limit="lesson.rating"
                  >0</span
                >%
              </p>
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
                <i class="bi bi-hand-thumbs-down"></i> No
              </button>
              <p v-if="selected_vote" class="mt-2 mb-0 fade-in-bottom">
                <span
                  class="count-animate"
                  :data-count-limit="100 - lesson.rating"
                  >0</span
                >%
              </p>
            </div>
          </div>
        </div>
      </div>
      <div
        class="container w-50 d-flex justify-content-center mt-2 fade-in-bottom"
      >
        <router-link
          v-if="video_watched"
          to="quizPage"
          class="btn btn-primary btn-lg rounded-pill d-inline-flex align-items-center m-2 text-secondary fw-bold justify-content-center"
          @click="markCompleted()"
        >
          Go to quiz <i class="bi bi-arrow-right ms-2"></i>
        </router-link>
      </div>
    </section>
  </div>
</template>

<script>
import {
  doc,
  updateDoc,
  getDoc,
  collection,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase/initialize"; // Adjust the path as necessary

export default {
  data() {
    return {
      lesson: {},
      course_name: "",
      video_watched: false,
      selected_vote: null,
      image:
        "https://plus.unsplash.com/premium_photo-1661964187664-e26f70e1a224?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y29kaW5nJTIwYmFja2dyb3VuZHxlbnwwfHwwfHx8MA%3D%3D",
      course: null,
      storedLessonId: "",
      user: "",
      userType: "",
    };
  },
  async mounted() {
    const userObject =
      JSON.parse(sessionStorage.getItem("user")) ||
      JSON.parse(localStorage.getItem("user"));
    if (userObject) {
      this.user = userObject.uid;

      const docRef = doc(db, "profiles", this.user);
      const docSnap = await getDoc(docRef);
      const userType = docSnap.data().userType;
      this.userType = userType;
    }
    await this.waitForLessonData();

    // Retrieve the course name from sessionStorage
    const storedCourse = sessionStorage.getItem("selectedCourse");
    if (storedCourse) {
      const course = JSON.parse(storedCourse);
      this.course_name = course.name;
      this.course = course;
    } else {
      console.warn("No selected course found in sessionStorage.");
    }
  },
  methods: {
    getThumbnailUrl(url) {
      // Use URL and URLSearchParams to reliably extract the video ID
      const urlObj = new URL(url);
      const videoId = urlObj.searchParams.get("v");

      // Return the YouTube thumbnail URL
      return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    },
    waitForLessonData() {
      return new Promise((resolve) => {
        const interval = setInterval(() => {
          const storedLessonItem = sessionStorage.getItem("selectedLessonItem");
          if (storedLessonItem) {
            const lessonData = JSON.parse(storedLessonItem);
            if (lessonData.typeof === "video") {
              this.lesson = lessonData;
              this.storedLessonId = JSON.parse(
                sessionStorage.getItem("selectedLessonId")
              );
              clearInterval(interval);
              resolve(this.storedLessonId);
            }
          } else {
            console.warn("No selected lesson item found in sessionStorage.");
          }
        }, 500); // Check every 500 ms
      });
    },
    watchvideo() {
      this.video_watched = true;
    },
    submit_vote(vote) {
      this.selected_vote = vote;
    },
    async markCompleted() {
      try {
        // Reference to the current lesson item document
        const lessonItemRef = doc(
          db,
          `users/${this.user}/ongoing_courses/${this.course.id}/progress/${this.storedLessonId}/lesson_items/${this.lesson.id}`
        );

        // Update `completed` field to true
        await updateDoc(lessonItemRef, {
          completed: true,
        });
       // console.log("Lesson item marked as completed.");

        // Calculate and update percentage completed
        await this.updatePercentageCompleted();

        // Determine the next item (quiz) if the current item is the video
        if (this.lesson.typeof === "video") {
          const nextLessonItemRef = doc(
            db,
            `courses/${this.course.id}/lessons/${this.storedLessonId}/lesson_items/lesson_item_002`
          );
          const nextLessonItemSnap = await getDoc(nextLessonItemRef);

          if (nextLessonItemSnap.exists()) {
            const nextLessonItem = {
              id: nextLessonItemSnap.id,
              ...nextLessonItemSnap.data(),
            };
            sessionStorage.setItem(
              "selectedLessonItem",
              JSON.stringify(nextLessonItem)
            );
            // console.log(
            //   "Next lesson item (quiz) stored in sessionStorage:",
            //   nextLessonItem
            // );
          } else {
            console.warn("Quiz lesson item not found.");
          }
        }
      } catch (error) {
        console.error(
          "Error marking lesson item as completed or finding the next item:",
          error
        );
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
          completedItems += lessonItemsSnap.docs.filter(
            (doc) => doc.data().completed === true
          ).length;
        }

        // Calculate the percentage completed
        const percentageCompleted =
          totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

        // Update the course document with the new percentage completed
        const courseRef = doc(
          db,
          `users/${this.user}/ongoing_courses/${this.course.id}`
        );
        await updateDoc(courseRef, {
          percentage_completed: percentageCompleted,
        });

       // console.log(`Updated percentage completed: ${percentageCompleted}%`);
      } catch (error) {
        console.error("Error updating percentage completed:", error);
      }
    },
  },
};
</script>


