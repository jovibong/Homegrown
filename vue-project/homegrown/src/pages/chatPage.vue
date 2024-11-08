<template>
  <div>
    <div class="row container-fluid px-0 mx-0 h-100">
      <section id="chats" class="col-md-4 bg-white">
        <div class="row container-fluid mt-2 fade-in-top">
          <div class="col-2 pe-2">
            <button class="btn btn-secondary btn-sm my-2" id="hamburgerBtn">
              <i class="bi bi-list h4"></i>
            </button>
          </div>
          <div class="col-10 py-2 my-2 rounded-pill border border-black">
            Search
          </div>
        </div>
        <nav class="navbar navbar-expand">
          <div class="container-fluid">
            <div id="navbarNav">
              <ul class="navbar-nav">
                <li class="nav-item me-2">
                  <a class="nav-link active" aria-current="page" href="#"
                    >All Chats</a
                  >
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="#">Mentors</a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        <!-- Chat List -->
        <div style="height: 65vh; overflow-y: auto">
          <div
            v-for="(chat, index) in chat_arr"
            :key="index"
            class="row container-fluid d-flex align-items-center mb-3 py-2 fade-in-left"
            @click="goToChat(index)"
            style="cursor: pointer"
          >
            <div class="col-2">
              <div
                class="overflow-hidden rounded-circle border border-black"
                style="width: 40px; height: 40px"
              >
                <img :src="chat.chat_img" alt="Chat Image" />
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
        <!-- End Chat List -->
      </section>

      <!-- Conversation Section -->
      <section
        id="conversation"
        class="col-md-8 bg-secondary px-0 fade-in-right"
        style="height: 90vh"
      >
        <div v-if="selected_chat_obj">
          <div class="row p-2 bg-primary container-fluid mx-0 mb-4">
            <div class="col-1 me-2 d-flex align-items-center">
              <div
                class="overflow-hidden rounded-circle border border-black"
                style="width: 40px; height: 40px"
              >
                <img
                  :src="selected_chat_obj.chat_img"
                  alt="Selected Chat Image"
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
          <div style="height: 60vh; overflow-y: auto">
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
                <span class="badge bg-white text-secondary text-center">
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
                  class="overflow-hidden rounded-circle d-inline-block border border-black me-3"
                  style="width: 40px; height: 40px"
                >
                  <img :src="getProfilePic(conversation)" alt="User Image" />
                </span>
                <span class="bg-white rounded px-3 py-2 d-inline-block">
                  <b>{{ getUserName(conversation) }}</b
                  ><br />{{ conversation.message }}
                  <div class="mt-2 text-end">{{ getTime(conversation) }}</div>
                </span>
              </div>
            </div>
          </div>
          <div
            class="row container-fluid p-0 m-0 mt-2 d-flex justify-content-center align-items-center"
          >
            <div
              class="rounded-pill col-8 py-2 bg-white d-flex align-items-center"
            >
              <div class="row container-fluid d-flex align-items-center">
                <div class="col-1">
                  <i class="bi bi-emoji-smile me-2 fs-3"></i>
                </div>
                <div class="col-10">
                  <input
                    v-model="message"
                    type="text"
                    placeholder="Message"
                    class="form-control border border-0 container-fluid"
                  />
                </div>
                <div class="col-1">
                  <i class="bi bi-paperclip fs-3"></i>
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
} from "firebase/firestore";
import { db } from "../firebase/initialize";

export default {
  data() {
    return {
      chat_arr: [],
      users_arr: null,
      selected_chat_obj: null,
      user: "user_00001",
      message: "",
    };
  },
  methods: {
    async fetchUsers() {
      try {
        const usersCollection = collection(db, "users");
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
        const chatsCollection = collection(db, "chats");
        const chatsSnapshot = await getDocs(chatsCollection);

        for (const chatDoc of chatsSnapshot.docs) {
          const chatData = chatDoc.data();
          const chatId = chatDoc.id;

          const chatObj = {
            id: chatId,
            ...chatData,
            conversations: [],
          };

          const conversationsCollection = collection(
            db,
            "chats",
            chatId,
            "conversations"
          );
          const conversationsSnapshot = await getDocs(conversationsCollection);

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
      } catch (error) {
        console.error("Error fetching chats:", error);
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
  mounted() {
    this.fetchUsers();
    this.fetchChats();
  },
};
</script>

 <style scoped>
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
</style>