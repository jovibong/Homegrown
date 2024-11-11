<template>
  <div>
    <!--Back Button and Course Title-->
    <section id="Title" class="container py-3 fade-in-top">
      <div class="container mb-4">
        <div class="row align-items-center">
          <!-- Back Button -->
          <div class="col-3">
            <router-link to="/mentorshipPage" class="btn btn-warning text-dark">
              <i class="bi bi-arrow-left"></i>
              <span class="d-none d-lg-inline">Back to Mentorship</span>
              <span class="d-inline d-lg-none">Back</span>
            </router-link>
          </div>
          <!-- Title (Centered) -->
          <div class="col-6 text-center">
            <h2 class="text-primary fw-bold mb-0 display-4">Course Mentees</h2>
          </div>
          <!-- Empty column for spacing/flexibility -->
          <div class="col-3"></div>
        </div>
        <!-- Subtitle -->
        <p class="text-center text-muted mt-3">
          You're doing an incredible job as a mentor! Keep supporting and
          guiding your mentees, helping them unlock their full potential with
          every step they take.
        </p>
      </div>
    </section>

    <loading-animation v-if="mentees_loading || lessons_loading"></loading-animation>
    <div v-else>
      <section v-if="course" id="course_info" class="container py-2 fade-in-top">
        <div class="card shadow-sm mb-md-2 mb-3">
          <div class="card-body position-relative">
            <!-- Icon -->
            <div class="row my-0 d-flex align-items-center">
              <h5 class="col-md-10 mt-2 fw-bold display-lg-4 display-5">
                {{ course.name }}
              </h5>
              <div class="text-center col-md-2 my-0 d-md-block d-none">
                <button class="rounded-circle bg-white border border-0" type="button" @click="toggleAccordion()">
                  <i class="bi bi-chevron-down display-5" :class="{ 'text-black-50': lessons_loading }"
                    ref="chevron"></i>
                </button>
              </div>

              <p class="text-muted">{{ course.description }}</p>
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

    <section id="Mentee" class="container my-2 fade-in-top">
      <div class="row">
        <div v-for="mentee in mentees" :key="mentee.name" class="col-md-6 mb-4">
          <div class="card shadow-sm">
            <div class="card-header bg-primary text-white text-center fw-bold h4">
              {{ mentee.name }}
              <!-- Notification Badge -->
              <span v-if="mentee.noti_count > 0"
                class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                style="transform: translate(-50%, -50%)">
                {{ mentee.noti_count }}
              </span>
            </div>
            <div class="card-body d-flex align-items-center">
              <div class="row">
                <!-- Mentor Image -->
                <div class="col-md-4 d-flex justify-content-center">
                  <img :src="mentee.profile_picture" alt="Mentee Img" class="rounded-circle" height="100px"
                    width="100px" style="object-fit: cover" />
                </div>
                <!-- Mentor Information -->
                <div class="col-md-8 text-md-start text-center">
                  <p class="text-muted">{{ mentee.description }}</p>
                  <!-- Ask for Help Button -->
                  <button class="btn btn-primary d-inline-flex align-items-center" :disabled="add_chat_button_disabled"
                    @click="addChat(mentee.id, uid)">
                    Chat <i class="bi bi-arrow-right ms-2"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div class="content container" ref="lessons">
      <div v-for="(lesson, lessonId) in lessons" :key="lessonId" class="mb-4">
        <div class="card shadow-sm mb-md-2 mb-3">
          <div class="card-body position-relative">
            <h4 class="fw-bold mb-3">{{ lesson.title }}</h4>
            <div class="row">
              <div v-for="item in lesson.lesson_items" :key="item.id" class="col-12">
                <router-link :to="`/${item.link}`" class="text-decoration-none"
                  @click.prevent="handleLessonItemClick(item, lesson.id)">
                  <div class="d-flex align-items-center p-3 mb-3 bg-secondary rounded hover-animate hover-less">
                    <div class="me-3">
                      <div
                        class="rounded-circle d-flex align-items-center justify-content-center bg-primary text-secondary"
                        style="width: 60px; height: 60px">
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
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { collection, getDocs, doc, getDoc, updateDoc, addDoc, arrayUnion, setDoc, query, where } from "firebase/firestore";
import { db } from "../firebase/initialize";
import loadingAnimation from "../components/loadingAnimation.vue";

export default {
  components: {
    loadingAnimation,
  },
  data() {
    return {
      expanded: false,
      add_chat_button_disabled: false,

      uid: null,
      course: null,
      lessons: [],
      lessons_loading: true,

      mentees: [],
      menteesList: [],
      mentees_loading: true,
    };
  },
  methods: {
    fetchLessons: async function () {
      try {
        // If the id does not exist in the route parameters, pull it from sessionStorage
        const selectedCourse = sessionStorage.getItem("selectedCourseId");
        const id = JSON.parse(selectedCourse);

        if (selectedCourse) {
          console.log("Course retrieved from sessionStorage:", id);
          sessionStorage.setItem("selectedCourseId", JSON.stringify(id));
        } else {
          console.log("No course data found in sessionStorage");
        }

        const courseRef = doc(db, "courses", id);
        const courseSnap = await getDoc(courseRef);
        const course = courseSnap.data();

        // Add the id field to the course object
        this.course = {
          ...course,
          id: id, // Add the id here
        };

        const lessonsRef = collection(db, `courses/${id}/lessons`);
        const lessonDocs = await getDocs(lessonsRef);

        const lessonsData = await Promise.all(
          lessonDocs.docs.map(async (lessonDoc) => {
            const lessonData = lessonDoc.data();
            const lessonId = lessonDoc.id; // Retrieve the lesson ID here

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
                link:
                  itemData.typeof === "quiz" ? "quizMentorPage" : "videoPage",
              };
            });

            return {
              id: lessonId, // Include the lesson ID here
              title: lessonData.title,
              lesson_items: lessonItemsData,
            };
          })
        );

        this.lessons = lessonsData;
        console.log(lessonsData);
      } catch (error) {
        console.error("Error fetching lesson:", error);
      } finally {
        this.lessons_loading = false;
      }
    },
    handleLessonItemClick(item, lessonId) {
      console.log("this course_id", this.course);
      sessionStorage.setItem("selectedLessonItem", JSON.stringify(item));
      sessionStorage.setItem("selectedLessonId", JSON.stringify(lessonId));
      sessionStorage.setItem("selectedCourse", JSON.stringify(this.course));

      if (item.completed || item.latest) {
        this.$router.push(item.route_link);
      }
    },
    fetchMentees: async function () {
      try {
        const user =
          JSON.parse(sessionStorage.getItem("user")) ||
          JSON.parse(localStorage.getItem("user"));
        const uid = user.uid;
        this.uid = uid;
        // console.log(uid)


        // If the id does not exist in the route parameters, pull it from sessionStorage
        const selectedCourse = sessionStorage.getItem("selectedCourseId");
        const courseID = JSON.parse(selectedCourse);
        // console.log(courseID)

        const menteeRef = doc(db, "mentors", uid, "mentorship", courseID);
        const menteeDoc = await getDoc(menteeRef);
        const menteesList = menteeDoc.data().mentees;
        this.mentees = menteesList;
        console.log(menteesList)
        this.menteesList = menteesList

        const menteePromises = menteesList.map(async (userId) => {
          const userRef = doc(db, "users", userId);
          const userSnap = await getDoc(userRef);

          return { ...userSnap.data(), id: userId };
        });

        this.mentees = await Promise.all(menteePromises);
        console.log(await Promise.all(menteePromises))
      } catch (error) {
        console.error("Error fetching mentees:", error);
      } finally {
        this.mentees_loading = false;
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
      // console.log(triangle);
      const chevron = this.$refs["chevron"];
      // console.log(chevron);
      const lessons = this.$refs["lessons"];
      // console.log(lessons);

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
    async checkAndCreateuser(userId, userName, profilePicture) {
      try {
        const userDocRef = doc(db, "chatters", userId);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          console.log("User document exists:", userDocSnap.data());
        } else {
          console.log("Creating new user");
          const newUser = {
            id: userId,
            name: userName || "New User",
            profile_picture: profilePicture || "https://thispersondoesnotexist.com/",
          };
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
          console.error(`Error retrieving document from ${collectionName}:`, error);
        }
      }
      return { message: "User not found in profiles, users, or mentors collections" };
    },

    async addChat(chatterId1, chatterId2) {
      try {
        for (const uid of this.menteesList) {
          console.log(uid)
          console.log(uid);
          const docRef = doc(db, "users", uid);
          try {
            await updateDoc(docRef, { noti_count: 0 });
          } catch (error) {
            console.error(`Failed to update notification count for ${uid}:`, error);
          }
        }
        this.add_chat_button_disabled = true;

        // Step 1: Ensure both chatters exist by checking each ID in the relevant collections
        for (const chatterId of [chatterId1, chatterId2]) {
          const userDoc = await this.getUserDocument(chatterId);

          if (!userDoc.data) {
            console.log(`User ${chatterId} not found in profiles, users, or mentors, creating a new one.`);
            await this.checkAndCreateuser(chatterId, "New User", "https://thispersondoesnotexist.com/");
          } else {
            console.log(`User ${chatterId} found in ${userDoc.collection} collection.`);
          }
        }

        // Step 2: Check if a chat with both users already exists
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
          this.$router.push({ name: "chatPage", params: { chatId: existingChat.id } });
          return;
        }

        // Step 3: Create a new chat document if no existing chat was found
        const newChatRef = await addDoc(collection(db, "chats"), {
          chat_type: "contact",
          chat_name: "contact",
          chat_img: "default_image_url",
          group_members: [chatterId1, chatterId2],
        });

        const chatId = newChatRef.id;
        console.log("New chat created with ID:", chatId);

        // Step 4: Add chat ID to each chatter's `chats` array
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
      } finally {
        this.add_chat_button_disabled = false;
      }
    },
  },
  async mounted() {
    await this.fetchLessons();
    await this.fetchMentees();
  },

};
</script>

<style scoped>
body {
  background-color: #f8f9fa;
}

.card-img-top {
  height: 200px;
  object-fit: cover;
}

.btn-view-info {
  background-color: #ffd700;
  color: black;
  font-weight: bold;
  font-size: large;
}

.card {
  position: relative;
  padding-bottom: 20px;
  display: flex;
  flex-direction: column;
  height: 100%;
  /* Space for the button */
}

.card-body {
  height: 100%;
  flex-grow: 1;
}

.btn-position {
  display: block;
  margin-top: auto;
  margin: 15px;
  text-align: center;
}

.row {
  align-items: stretch;
}

.badge_notifiction {
  padding: 0.5em 0.75em;
  font-size: 1.2em;
}

.progress {
  height: 30px;
  border-radius: 15px;
}

.content {
  height: 0px;
  overflow: hidden;
  transition: height 0.5s ease;
  /* Adjust duration as needed */
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