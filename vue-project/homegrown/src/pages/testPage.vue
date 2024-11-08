<template>
  <div class="container">
    <h2>Convert Timestamps to Firestore Timestamps</h2>
    <button @click="convertTimestamps" class="btn btn-primary mt-3">
      Convert All Timestamps
    </button>
    <div v-if="loading" class="mt-3">Converting timestamps, please wait...</div>
    <div v-else-if="success" class="mt-3 text-success">
      Timestamps have been successfully converted!
    </div>
  </div>
</template>

<script>
import { collection, getDocs, updateDoc, doc, Timestamp } from "firebase/firestore";
import { db } from "../firebase/initialize";

export default {
  data() {
    return {
      loading: false,
      success: false,
    };
  },
  methods: {
    async convertTimestamps() {
      this.loading = true;
      this.success = false;

      try {
        const chatsCollection = collection(db, "chats");
        const chatsSnapshot = await getDocs(chatsCollection);

        for (const chatDoc of chatsSnapshot.docs) {
          const chatId = chatDoc.id;

          // Access the conversations sub-collection
          const conversationsCollection = collection(db, "chats", chatId, "conversations");
          const conversationsSnapshot = await getDocs(conversationsCollection);

          for (const convoDoc of conversationsSnapshot.docs) {
            const convoData = convoDoc.data();

            // Check if the timestamp is already a Firestore Timestamp
            if (!(convoData.timestamp instanceof Timestamp)) {
              // Convert to Firestore Timestamp if it's not already
              const updatedTimestamp = Timestamp.fromDate(new Date(convoData.timestamp));

              // Update the document with the converted timestamp
              await updateDoc(doc(db, "chats", chatId, "conversations", convoDoc.id), {
                timestamp: updatedTimestamp,
              });
            }
          }
        }

        this.success = true;
      } catch (error) {
        console.error("Error converting timestamps:", error);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.container {
  max-width: 600px;
  margin-top: 20px;
}
</style>
