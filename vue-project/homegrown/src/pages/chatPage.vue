<template>
  <div>
    <div class="row container-fluid px-0 mx-0 h-100">
      <section
        id="chats"
        class="col-lg-4 bg-white"
        :class="{ 'full-width': isMobileView && showChats }"
        v-show="showChats || !isMobileView"
      >
        <div class="container-fluid mt-2 fade-in-top p-1 rounded-pill">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Search"
            class="form-control border border-2 rounded-pill"
          />
        </div>
        <nav class="navbar navbar-expand">
          <div class="container-fluid">
            <div id="navbarNav">
              <ul class="navbar-nav">
                <li class="nav-item me-2">
                  <a
                    class="nav-link"
                    :class="{ active: currentFilter === 'all' }"
                    href="#"
                    @click.prevent="setFilter('all')"
                    >All Chats</a
                  >
                </li>
                <li class="nav-item">
                  <a
                    class="nav-link"
                    :class="{ active: currentFilter === 'contact' }"
                    href="#"
                    @click.prevent="setFilter('contact')"
                    >Contacts</a
                  >
                </li>
              </ul>
            </div>
          </div>
        </nav>
        <!-- Chat List -->
        <div style="height: 75vh; overflow-y: auto">
          <loading-animation
            v-if="chats_loading"
            class="mt-5"
          ></loading-animation>
          <div v-else class="fade-in-top">
            <div v-if="filteredChats.length > 0">
              <div
                v-for="(chat, index) in filteredChats"
                :key="index"
                class="row container-fluid d-flex align-items-center mb-3 py-2 fade-in-left"
                @click="goToChat(index)"
                style="cursor: pointer"
              >
                <div class="col-lg-2 col-1">
                  <div
                    class="overflow-hidden rounded-circle border border-black"
                    style="width: 40px; height: 40px"
                  >
                    <img
                      :src="chat.chat_img"
                      alt="Chat Image"
                      height="40"
                      width="40"
                    />
                  </div>
                </div>
                <div class="col-10 overflow-hidden">
                  <div class="fw-bold">{{ chat.chat_name }}</div>
                  <div class="text-nowrap">
                    <span
                      v-if="chat.chat_type == 'group'"
                      class="d-inline-block me-1"
                    >
                      {{ getUserName(getLastConvo(chat)) }}:
                    </span>
                    <span class="text-muted text-nowrap d-inline">
                      {{ getLastConvo(chat).message }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="text-center text-muted fst-italic mt-3">
              No chats found.
            </div>
          </div>
          <!-- End Chat List -->
        </div>
      </section>

      <!-- Conversation Section -->
      <section
        id="conversation"
        :class="{ 'full-width': isMobileView && !showChats }"
        class="col-lg-8 bg-secondary px-0"
        v-show="selected_chat_obj && (!showChats || !isMobileView)"
        style="height: 90vh"
      >
        <div v-if="selected_chat_obj" class="fade-in-top">
          <div class="row p-2 bg-primary container-fluid mx-0">
            <div v-if="isMobileView" class="col-1">
              <button
                class="btn btn-secondary btn-sm m-2"
                @click="showChats = true"
              >
                Back
              </button>
            </div>
            <div class="col-1 me-2 d-flex align-items-center">
              <div
                class="overflow-hidden rounded-circle border border-black clickable"
                style="width: 40px; height: 40px"
                @click="openImagePopup(selected_chat_obj.chat_img)"
              >
                <img
                  :src="selected_chat_obj.chat_img"
                  alt="Selected Chat Image"
                  height="40"
                  width="40"
                />
              </div>
            </div>
            <div class="col-auto d-flex align-items-center text-white">
              <div>
                <div class="row fw-bold">{{ selected_chat_obj.chat_name }}</div>
                <div v-if="selected_chat_obj.chat_type == 'group'" class="row">
                  {{ getNumMembers(selected_chat_obj) }} members
                </div>
              </div>
            </div>
          </div>
          <div style="height: 70vh; overflow-y: auto">
            <div
              v-for="(conversation, index) in selected_chat_obj.conversations"
              :key="index"
            >
              <div
                v-if="
                  isNewDay(
                    conversation,
                    selected_chat_obj.conversations[index - 1]
                  )
                "
                class="container-fluid d-flex justify-content-center p-0"
              >
                <span class="badge bg-white text-secondary text-center mt-2">
                  <!-- Check if `timestamp` has a `toDate` method -->
                  {{
                    conversation.timestamp.toDate
                      ? conversation.timestamp.toDate().toLocaleDateString()
                      : new Date(conversation.timestamp).toLocaleDateString()
                  }}
                </span>
              </div>
              <div
                v-if="conversation.user == user"
                class="container-fluid w-100 d-flex justify-content-end"
              >
                <span
                  class="bg-white rounded text-end px-3 py-2 d-inline-block"
                >
                  {{ conversation.message }}
                  <div class="mt-2 text-end">
                    <!-- Display timestamp with loading indicator for each message -->
                    {{ getTime(conversation) }}
                    <span
                      v-if="conversation.isLoading"
                      class="loading-spinner ms-2"
                      >⏳</span
                    >
                  </div>
                </span>
              </div>

              <div
                v-else
                class="container-fluid w-100 d-flex justify-content-start align-items-center my-4"
              >
                <span
                  class="overflow-hidden rounded-circle d-inline-block border border-black me-3 clickable"
                  style="width: 40px; height: 40px"
                  @click="openImagePopup(getProfilePic(conversation))"
                >
                  <img
                    :src="getProfilePic(conversation)"
                    alt="User Image"
                    height="40"
                    width="40"
                  />
                </span>
                <span class="bg-white rounded px-3 py-2 d-inline-block">
                  <b>{{ getUserName(conversation) }}</b
                  ><br />{{ conversation.message }}
                  <div class="mt-2 text-end">{{ getTime(conversation) }}</div>
                </span>
              </div>
            </div>
          </div>

          <!-- Image Popup and Overlay -->
          <div
            v-if="showImagePopup"
            class="popup-overlay"
            @click="closeImagePopup"
          >
            <div class="popup-image-container" @click.stop>
              <img :src="popupImageUrl" alt="Popup Image" class="popup-image" />
              <button class="close-button" @click="closeImagePopup">×</button>
            </div>
          </div>

          <div
            class="row container-fluid p-0 m-0 mt-2 d-flex justify-content-center align-items-center"
          >
            <div
              class="rounded-pill col-7 py-2 bg-white d-flex align-items-center pe-0"
            >
              <div class="row container-fluid d-flex align-items-center p-0">
                <div class="col-1">
                  <i class="bi bi-emoji-smile me-2 fs-3"></i>
                </div>
                <div class="col-11 p-0">
                  <div class="row container-fluid d-flex align-items-center">
                    <div class="col-11 pe-0">
                      <input
                        v-model="message"
                        type="text"
                        placeholder="Message"
                        class="form-control border border-0 p-0"
                      />
                    </div>

                    <i class="col-1 bi bi-paperclip fs-3"></i>
                  </div>
                </div>
              </div>
            </div>
            <div
              class="col-1 rounded-circle bg-primary ms-2 d-flex justify-content-center align-items-center"
              style="width: 45px; height: 45px"
            >
              <transition name="icon-transition">
                <i
                  v-if="message.trim().length !== 0"
                  class="text-white bi bi-send fs-5 clickable"
                  @click="sendMessage"
                ></i>
              </transition>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>


<script>
import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
  getDoc,
  setDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase/initialize";
import loadingAnimation from "../components/loadingAnimation.vue";

export default {
  components: {
    loadingAnimation,
  },
  data() {
    return {
      chat_arr: [],
      users_arr: null,
      selected_chat_obj: null,
      user: "",
      message: "",
      chats_loading: true,
      showImagePopup: false,
      popupImageUrl: "",
      searchQuery: "", // Search input value
      currentFilter: "all", // default
      isMobileView: window.innerWidth < 992, // Detect if screen is smaller than large size (992px)
      showChats: true, // Toggles between chats and conversation views on mobile
    };
  },
  methods: {
    setFilter(type) {
      this.currentFilter = type;
    },
    openImagePopup(imageUrl) {
      this.popupImageUrl = imageUrl;
      this.showImagePopup = true;
    },
    closeImagePopup() {
      this.showImagePopup = false;
    },
    async fetchUsers() {
      try {
        const usersCollection = collection(db, "chatters");
        const usersSnapshot = await getDocs(usersCollection);
        this.users_arr = usersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log(this.users_arr);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    },
    async fetchChats() {
      this.chat_arr = [];

      try {
        // Step 1: Fetch the `chats` array from the user document in `chatters` collection
        const userDocRef = doc(db, "chatters", this.user);
        const userDocSnap = await getDoc(userDocRef);

        if (!userDocSnap.exists()) {
          console.error("User document does not exist in chatters collection.");
          return;
        }

        const userChats = userDocSnap.data().chats || []; // Array of chat IDs

        // Step 2: Fetch specific chats from the `chats` collection based on the IDs in `userChats`
        const chatsCollection = collection(db, "chats");
        const chatsSnapshot = await getDocs(chatsCollection);

        for (const chatDoc of chatsSnapshot.docs) {
          if (userChats.includes(chatDoc.id)) {
            const chatData = chatDoc.data();
            const chatId = chatDoc.id;

            const chatObj = {
              id: chatId,
              ...chatData,
              conversations: [],
            };

            // Check if it's a "contact" chat type and has exactly two members
            if (
              chatObj.chat_type === "contact" &&
              chatObj.group_members.length === 2
            ) {
              // Find the other member who is not `this.user`
              const otherUserId = chatObj.group_members.find(
                (memberId) => memberId !== this.user
              );

              // Get that user's name from the users collection
              if (otherUserId) {
                const otherUserDoc = await getDoc(
                  doc(db, "chatters", otherUserId)
                );
                if (otherUserDoc.exists()) {
                  const otherUserData = otherUserDoc.data();
                  chatObj.chat_name = otherUserData.name || "Unknown Contact";
                  chatObj.chat_img =
                    otherUserData.profile_picture || "default_image_url";
                } else {
                  console.error("Other user not found in users collection");
                }
              }
            }

            // Step 3: Fetch conversations for each chat
            const conversationsCollection = collection(
              db,
              "chats",
              chatId,
              "conversations"
            );
            const conversationsSnapshot = await getDocs(
              conversationsCollection
            );

            for (const convoDoc of conversationsSnapshot.docs) {
              const convoData = convoDoc.data();
              const convoId = convoDoc.id;

              chatObj.conversations.push({
                id: convoId,
                ...convoData,
              });
            }

            // Sort conversations by timestamp after loading
            chatObj.conversations.sort((a, b) => {
              const dateA = a.timestamp.toDate
                ? a.timestamp.toDate()
                : new Date(a.timestamp);
              const dateB = b.timestamp.toDate
                ? b.timestamp.toDate()
                : new Date(b.timestamp);
              return dateA - dateB;
            });

            this.chat_arr.push(chatObj);
          }
        }
      } catch (error) {
        console.error("Error fetching chats:", error);
      } finally {
        this.chats_loading = false;
      }
    },
    getLastConvo(chat) {
      return chat.conversations[chat.conversations.length - 1] || {};
    },
    getUserName(conversation) {
      if (!this.users_arr) return "";
      const user = this.users_arr.find((user) => user.id === conversation.user);
      return user ? user.name : "Unknown";
    },
    goToChat(index) {
      const selectedChat = this.chat_arr[index];
      if (selectedChat && selectedChat.id) {
        this.selected_chat_obj = selectedChat;
        console.log(this.selected_chat_obj);
        if (this.isMobileView) {
          this.showChats = false;
        }
      } else {
        console.error("Error: Selected chat does not have a valid chat_id.");
      }
    },
    getNumMembers(chat) {
      return chat.group_members ? chat.group_members.length : 0;
    },
    getProfilePic(conversation) {
      const user = this.users_arr?.find(
        (user) => user.id === conversation.user
      );
      return user ? user.profile_picture : "";
    },
    getTime(conversation) {
      if (!conversation.timestamp) return "";

      // Convert Firestore Timestamp to JavaScript Date if it's a Timestamp
      const date = conversation.timestamp.toDate
        ? conversation.timestamp.toDate()
        : new Date(conversation.timestamp);

      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    },
    sortConversations() {
      this.selected_chat_obj.conversations.sort((a, b) => {
        const dateA = a.timestamp.toDate
          ? a.timestamp.toDate()
          : new Date(a.timestamp);
        const dateB = b.timestamp.toDate
          ? b.timestamp.toDate()
          : new Date(b.timestamp);
        return dateA - dateB;
      });
    },
    isNewDay(current, previous) {
      if (!previous) return true;

      // Convert Firestore Timestamps to JavaScript Dates
      const currentDate = current.timestamp.toDate
        ? current.timestamp.toDate()
        : new Date(current.timestamp);
      const previousDate = previous.timestamp.toDate
        ? previous.timestamp.toDate()
        : new Date(previous.timestamp);

      return currentDate.toDateString() !== previousDate.toDateString();
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
    async sendMessage() {
      if (!this.selected_chat_obj || !this.selected_chat_obj.id) {
        console.error("Error: selected_chat_obj or chat_id is undefined.");
        return;
      }

      const last_index = this.selected_chat_obj.conversations.length;
      const message_id = `msg_${String(last_index).padStart(3, "0")}`;

      // Create a temporary message with `isLoading` flag, but exclude `isLoading` from Firestore data
      const new_message = {
        message_id: message_id,
        id: this.selected_chat_obj.id,
        user: this.user,
        message: this.message.trim(),
        timestamp: new Date(), // Temporary local Date for display
        tempId: Date.now(), // Unique temporary ID
        isLoading: true, // Flag for showing loading animation, will not be sent to Firestore
      };

      // Add the temporary message with `isLoading` to the UI
      this.selected_chat_obj.conversations.push(new_message);
      this.message = ""; // Clear the input field

      try {
        const conversationRef = collection(
          db,
          "chats",
          this.selected_chat_obj.id,
          "conversations"
        );

        // Prepare the message data to send to Firestore (exclude `isLoading`)
        const firestoreMessage = {
          ...new_message,
          timestamp: serverTimestamp(), // Use Firestore serverTimestamp
        };
        delete firestoreMessage.isLoading; // Ensure `isLoading` is not stored in Firestore

        // Add the message to Firestore
        const docRef = await addDoc(conversationRef, firestoreMessage);

        // Fetch the added message to get the accurate Firestore timestamp
        const addedMessageDoc = await getDoc(docRef);

        if (addedMessageDoc.exists()) {
          const addedMessage = addedMessageDoc.data();
          const index = this.selected_chat_obj.conversations.findIndex(
            (msg) => msg.tempId === new_message.tempId
          );

          if (index !== -1) {
            // Update the properties directly without replacing the object
            this.selected_chat_obj.conversations[index].timestamp =
              addedMessage.timestamp;
            this.selected_chat_obj.conversations[index].isLoading = false; // Remove loading indicator
          }
        }

        // Sort messages after adding to maintain correct order
        this.sortConversations();
      } catch (error) {
        console.error("Error sending message to Firestore:", error);

        // Remove the message from the UI if saving to Firestore fails
        const index = this.selected_chat_obj.conversations.findIndex(
          (msg) => msg.tempId === new_message.tempId
        );
        if (index !== -1) {
          this.selected_chat_obj.conversations.splice(index, 1);
        }
      }
    },
  },
  computed: {
    // Filtered chat list based on search query
    filteredChats() {
      const query = this.searchQuery.toLowerCase();
      return this.chat_arr.filter(
        (chat) =>
          (this.currentFilter === "all" ||
            chat.chat_type === this.currentFilter) &&
          chat.chat_name.toLowerCase().includes(query)
      );
    },
  },
  mounted() {
    window.addEventListener("resize", () => {
      this.isMobileView = window.innerWidth < 992;
      if (!this.isMobileView) {
        this.showChats = true;
      }
    });
    this.$nextTick(() => {
      window.scrollTo(0, 0);
    });
    const userObject =
      JSON.parse(sessionStorage.getItem("user")) ||
      JSON.parse(localStorage.getItem("user"));
    if (userObject) {
      this.checkAndCreateuser(
        userObject.uid,
        userObject.name,
        userObject.profile_picture
      );
      this.user = userObject.uid;
      console.log(this.user);
    }
    if (this.user) {
      this.fetchUsers();
      this.fetchChats();
    }
  },
};
</script>

 <style scoped>
#chats,
#conversation {
  transition: all 0.3s ease;
}
.full-width {
  width: 100% !important;
}

[style*="display: none"] {
  opacity: 0;
  transform: translateY(-20px);
}

#conversation[style*="display: none"],
#chats[style*="display: none"] {
  opacity: 0;
  transform: translateX(-20px);
}

body {
  overflow-y: hidden;
}

.loading-spinner {
  display: inline-block;
  font-size: 0.75rem;
  color: #007bff; /* Customize as needed */
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Popup Overlay */
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.7); /* Dark translucent cover */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000; /* High z-index to overlay other content */
}

/* Popup Image Container */
.popup-image-container {
  position: relative;
  width: 50vw;
  height: 50vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white; /* White background for extra space */
  overflow: hidden; /* Ensure that the container doesn’t overflow */
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
}

/* Popup Image */
.popup-image {
  width: 100%;
  height: 100%;
  object-fit: contain; /* Scale the image while maintaining aspect ratio */
  object-position: center; /* Center the image within the container */
}

/* Close Button Styles */
.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 30px;
  height: 30px;
  background-color: var(--bs-primary); /* Blue color from bg-primary class */
  color: white;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  transition: transform 0.2s, background-color 0.2s;
  padding-bottom: 3px;
}

.close-button:hover {
  background-color: white;
  transform: scale(1.1);
  color: var(--bs-primary);
}

.close-button:active {
  transform: scale(0.95);
}
</style>