<template>
  <div class="individualCoursePage text-start">
    <!--Back Button and Course Title-->
    <section id="Title" class="container py-3 fade-in-top">
      <div class="container mb-4">
        <div class="row align-items-center">
          <!-- Back Button -->
          <div class="col-3">
            <router-link to="ongoingCoursesPage" class="btn btn-warning text-dark"><i class="bi bi-arrow-left"></i>
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
                  <span class="text-secondary fs-4" v-html="getRatingStars(course.rating)"></span>
                  <span class="text-muted d-block fs-4">{{ course.num_reviews }} Reviews</span>
                </div>
              </a>
            </div>

            <div class="col-md-8 mb-0 text-md-start text-center">
              <div class="row my-0 d-flex align-items-center">
                <h5 class="col-md-10 mt-2 fw-bold display-lg-4 display-5">
                  {{ course.name }}
                </h5>
                <div class="text-center col-md-2 my-0 d-md-block d-none">
                  <button class="rounded-circle bg-white border border-0" type="button" @click="toggleAccordion()">
                    <i class="bi bi-chevron-down display-5 text-shadow-soft" :class="{ 'text-light': lessons_loading }"
                      ref="chevron"></i>
                  </button>
                </div>
              </div>
              <p class="text-muted">{{ course.description }}</p>
            </div>
          </div>

          <!-- Progress and Description -->
          <div class="row">
            <div class="text-center mt-2 mt-md-0">
              <div class="fw-bold h3" v-if="!percentage_loading">
                <span :ref="'progression' + course.id" class="count-animate"
                  :data-count-limit="percentage_completed">0</span>% complete
              </div>
              <div v-else class="h3">&nbsp;</div>
              <div class="d-flex justify-content-center my-3">
                <div class="progress" style="width: 80%; height: 15px">
                  <div class="progress-bar bg-dark progress-animate" role="progressbar"
                    :ref="'courseProgress' + course.id" :data-progress="percentage_completed + '%'" style="width: 0%">
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!--Dropdown Button on small screens-->
          <div class="text-center my-0 d-md-none d-block">
            <button class="triangle-btn-bg bg-primary border border-white border-3 shadow-lg" type="button"
              @click="toggleAccordion()">
              <i class="triangle-btn" :class="lessons_loading ? 'bg-primary' : 'bg-secondary'" ref="triangle"></i>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!--Mentor-->
    <section v-if="mentor && !mentor_loading" id="mentor" class="container my-2 fade-in-top">
      <div class="card shadow-sm">
        <div class="card-header bg-primary text-white text-center fw-bold h4">
          My Mentor
        </div>
        <div class="card-body d-flex align-items-center">
          <div class="row">
            <!-- Mentor Image -->
            <div class="col-md-3 d-flex justify-content-center">
              <img :src="mentor.img" alt="Mentor Img" class="rounded-circle" height="150px" width="150px" />
            </div>
            <!-- Mentor Information -->
            <div class="col-md-9 text-md-start text-center">
              <h5 class="fw-bold h4">{{ mentor.name }}</h5>
              <p class="text-muted">{{ mentor.description }}</p>
              <!-- Ask for Help Button -->
              <button
                class="btn btn-primary d-inline-flex align-items-center"
                @click.prevent="addChat(mentor.id, user)"
                :disabled="add_chat_button_disabled"
              >
                Ask for help <i class="bi bi-arrow-right ms-2"></i>
              </button>
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
              <div v-for="item in lesson.lesson_items" :key="item.id" class="col-12">
                <router-link :to="item.completed || item.latest ? item.route_link : '#'" class="text-decoration-none"
                  :class="{
                    'pointer-events-none': !item.completed && !item.latest, // Disable click if not completed or latest
                  }" @click.prevent="handleLessonItemClick(item, lessonId)">
                  <div :class="[
                    'd-flex align-items-center p-3 mb-3 rounded',
                    item.completed
                      ? 'bg-secondary hover-animate hover-less'
                      : item.latest
                        ? 'bg-success hover-animate hover-less'
                        : 'bg-white border border-muted',
                  ]">
                    <div class="me-3">
                      <div class="rounded-circle d-flex align-items-center justify-content-center text-secondary"
                        :class="[
                          item.completed || item.latest
                            ? 'bg-primary'
                            : 'bg-light',
                        ]" style="width: 60px; height: 60px">
                        <i :class="item.icon" class="h2 pt-2"></i>
                      </div>
                    </div>
                    <div>
                      <p :class="[
                        'mb-1',
                        item.latest ? 'text-secondary' : 'text-primary',
                      ]">
                        {{ formatType(item.typeof) }}
                      </p>
                      <p class="fw-bold mb-1" :class="[
                        item.latest ? 'text-secondary' : 'text-primary',
                      ]">
                        {{ item.name }}
                      </p>
                    </div>
                    <div class="badge bg-white text-success ms-5 fs-5" v-if="item.latest">
                      Next Up
                    </div>
                  </div>
                </router-link>
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
            <span class="text-secondary fs-4" v-html="getRatingStars(course.rating)"></span>
            <span class="ms-3 fw-bold">{{ course.num_reviews }} Reviews</span>
          </div>
        </div>
      </div>
      <!-- Review List -->
      <loading-animation v-if="loading"></loading-animation>
      <div v-else class="list-group">
        <div v-for="(review, review_key) in reviews" :key="review_key"
          class="list-group-item list-group-item-action d-flex align-items-start push-in-right">
          <img :src="review.img" alt="Profile" class="rounded-circle me-3" height="50px" width="50px" />
          <div>
            <h5 class="mb-1">
              {{ review.name }}
              <span class="text-secondary fs-6" v-html="getRatingStars(review.rating)"></span>
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
import {
  collection,
  doc,
  addDoc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase/initialize";

export default {
  components: {
    loadingAnimation,
  },
  data() {
    return {
      user: "",
      course: null,
      loading: true,
      reviews: null,
      mentor: null,
      lessons: {},
      expanded: false,
      lessons_loading: true,
      mentor_loading: true,
      percentage_loading: true,
      percentage_completed: 0, // Initialize percentage_completed to 0
      add_chat_button_disabled: false,
    };
  },
  methods: {
    async fetchCourseProgress() {
      try {
        const courseDocRef = doc(
          db,
          `users/${this.user}/ongoing_courses/${this.course.id}`
        );
        const courseDoc = await getDoc(courseDocRef);

        if (courseDoc.exists()) {
          this.percentage_completed =
            courseDoc.data().percentage_completed || 0;
          console.log(
            "Fetched percentage completed:",
            this.percentage_completed
          );
        } else {
          console.warn("Course document not found in user's ongoing_courses.");
        }
      } catch (error) {
        console.error("Error fetching course progress:", error);
      } finally {
        this.percentage_loading = false;
      }
    },
    async fetchLessons() {
      try {
        const lessonsRef = collection(db, `courses/${this.course.id}/lessons`);
        const lessonDocs = await getDocs(lessonsRef);

        let latestFound = false; // Flag to indicate if the latest item has been found

        const lessonsData = {}; // Initialize as an object (map) instead of an array

        await Promise.all(
          lessonDocs.docs.map(async (lessonDoc) => {
            const lessonData = lessonDoc.data();
            const lessonId = lessonDoc.id;

            // Fetch lesson items for each lesson
            const lessonItemsRef = collection(lessonDoc.ref, "lesson_items");
            const lessonItemsDocs = await getDocs(lessonItemsRef);

            // Reference to user's progress for the specific lesson in ongoing_courses
            const userLessonProgressRef = collection(
              db,
              `users/${this.user}/ongoing_courses/${this.course.id}/progress/${lessonId}/lesson_items`
            );
            const userLessonProgressDocs = await getDocs(userLessonProgressRef);

            // Map progress data to easily check if lesson items are completed
            const progressData = userLessonProgressDocs.docs.reduce(
              (acc, doc) => {
                acc[doc.id] = doc.data().completed || false; // Default to false if completed field is missing
                return acc;
              },
              {}
            );

            const lessonItemsData = lessonItemsDocs.docs.map((itemDoc) => {
              const itemData = itemDoc.data();
              const completed = progressData[itemDoc.id] || false;

              // Set the `latest` flag on the first non-completed item if it hasn't been set yet
              const latest = !completed && !latestFound;
              if (latest) latestFound = true; // Mark that we've found the latest item

              return {
                ...itemData,
                id: itemDoc.id,
                icon:
                  itemData.typeof === "quiz" ? "bi-lightbulb" : "bi-play-fill",
                route_link:
                  itemData.typeof === "quiz" ? "quizPage" : "videoPage",
                completed: completed,
                latest: latest,
              };
            });

            // Store each lesson using lessonId as the key in lessonsData
            lessonsData[lessonId] = {
              title: lessonData.title,
              lesson_items: lessonItemsData,
            };
          })
        );

        this.lessons = lessonsData; // Assign lessonsData (map) to this.lessons
      } catch (error) {
        console.error("Error fetching lessons and items:", error);
      } finally {
        this.lessons_loading = false;
        console.log("These lessons", this.lessons);
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
      const chevron = this.$refs["chevron"];
      const lessons = this.$refs["lessons"];

      if (!this.lessons_loading) {
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
      }
    },
    async fetchMentor() {
      try {
        const courseDocRef = doc(
          db,
          `users/${this.user}/ongoing_courses/${this.course.id}`
        );
        const courseSnap = await getDoc(courseDocRef);

        if (courseSnap.exists()) {
          const mentorId = courseSnap.data().mentor;

          if (mentorId) {
            const mentorDocRef = doc(db, `mentors/${mentorId}`);
            const mentorSnap = await getDoc(mentorDocRef);

            if (mentorSnap.exists()) {
              this.mentor = { id: mentorId, ...mentorSnap.data() };
              console.log("Mentor Details:", this.mentor);
            } else {
              console.warn("Mentor not found in the mentors collection.");
            }
          } else {
            console.warn(
              "No mentor ID found for this course in ongoing_courses."
            );
          }
        } else {
          console.warn("Course document not found in user's ongoing_courses.");
        }
      } catch (error) {
        console.error("Error fetching mentor details:", error);
      } finally {
        this.mentor_loading = false;
      }
    },
    handleLessonItemClick(item, lessonId) {
      sessionStorage.setItem("selectedLessonItem", JSON.stringify(item));
      sessionStorage.setItem("selectedLessonId", JSON.stringify(lessonId));

      if (item.completed || item.latest) {
        this.$router.push(item.route_link);
      }
    },
    async checkAndCreateuser(userId, userName, profilePicture) {
      try {
        // Reference to the user document in the users collection
        const userDocRef = doc(db, "chatters", userId);

        // Check if the document exists
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          console.log("User document exists:", userDocSnap.data());
        } else {
          // If user document doesn't exist, create a new one
          console.log("Creating new user");
          const newUser = {
            id: userId,
            name: userName || "New User", // Default name, adjust as needed
            profile_picture:
              profilePicture || "https://thispersondoesnotexist.com/",
          };

          // Set the new document in Firestore
          await setDoc(userDocRef, newUser);
          console.log("User document created successfully:", newUser);
        }
      } catch (error) {
        console.error("Error checking or creating user document:", error);
      }
    },
    async getUserDocument(userId) {
      const collections = ["profiles", "users", "mentors"];

      for (const collectionName of collections) {
        try {
          const docRef = doc(db, collectionName, userId);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            return { data: docSnap.data(), collection: collectionName };
          }
        } catch (error) {
          console.error(
            `Error retrieving document from ${collectionName}:`,
            error
          );
        }
      }

      return {
        message: "User not found in profiles, users, or mentors collections",
      };
    },
    async addChat(chatterId1, chatterId2) {
      try {
        const user1 = await this.getUserDocument(chatterId1);
        await this.checkAndCreateuser(user1);

        const user2 = await this.getUserDocument(chatterId2);
        await this.checkAndCreateuser(user2);

        this.add_chat_button_disabled = true;
        // Step 1: Check if a chat with both users already exists
        const chatsCollection = collection(db, "chats");
        const chatQuery = query(
          chatsCollection,
          where("chat_type", "==", "contact")
        );
        const chatSnapshot = await getDocs(chatQuery);

        let existingChat = null;
        chatSnapshot.forEach((doc) => {
          const data = doc.data();
          if (
            data.group_members &&
            data.group_members.length === 2 &&
            data.group_members.includes(chatterId1) &&
            data.group_members.includes(chatterId2)
          ) {
            existingChat = { id: doc.id, ...data };
          }
        });

        // If an existing chat is found, navigate to it and return
        if (existingChat) {
          console.log("Chat already exists with ID:", existingChat.id);
          this.$router.push({
            name: "chatPage",
            params: { chatId: existingChat.id },
          });
          return;
        }

        // Step 2: Create a new chat document if no existing chat was found
        const newChatRef = await addDoc(collection(db, "chats"), {
          chat_type: "contact",
          chat_name: "contact",
          chat_img: "default_image_url",
          group_members: [chatterId1, chatterId2],
        });

        const chatId = newChatRef.id;
        console.log("New chat created with ID:", chatId);

        // Step 3: Add chat ID to each chatter's `chats` array
        for (const chatterId of [chatterId1, chatterId2]) {
          const chatterRef = doc(db, "chatters", chatterId);
          const chatterDoc = await getDoc(chatterRef);

          if (chatterDoc.exists()) {
            await updateDoc(chatterRef, {
              chats: arrayUnion(chatId),
            });
          } else {
            await setDoc(chatterRef, {
              chats: [chatId],
            });
          }
          console.log(`Chat ID ${chatId} added to chatter ${chatterId}`);
        }

    console.log("Chat successfully created and added to both chatters.");
    this.$router.push({ name: "chatPage", params: { chatId } });
  } catch (error) {
    console.error("Error creating chat:", error);
  }
}
  },
  async mounted() {
    const userObject =
      JSON.parse(sessionStorage.getItem("user")) ||
      JSON.parse(localStorage.getItem("user"));
    if (userObject) {
      this.user = userObject.uid;
    }
    const storedCourse = sessionStorage.getItem("selectedCourse");
    if (storedCourse) {
      this.course = JSON.parse(storedCourse);
      await this.fetchCourseProgress(); // Fetch percentage_completed when page loads
    } else {
      console.log("No course data found in sessionStorage");
      return;
    }
    await this.fetchMentor();
    await this.fetchLessons();
    await this.fetchReviewsWithUserDetails();
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

.pointer-events-none {
  cursor: default;
}

.text-shadow-soft {
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
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
