<template>
  <div class="container mt-5">
    <h2 class="text-primary mb-4">Update Course Completion</h2>

    <div class="card p-4 shadow-sm">
      <h4 class="card-title">Course Progress</h4>
      <p>Click the button below to add a `percentage_completed` field with a starting value of 0 to each ongoing course document.</p>

      <button
        class="btn btn-primary mt-3"
        @click="addPercentageCompleted"
      >
        Initialize Percentage Completed
      </button>

      <div v-if="message" class="alert alert-info mt-3">{{ message }}</div>
    </div>
  </div>
</template>

<script>
import { doc, updateDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/initialize";

export default {
  data() {
    return {
      user: "user_00001", // Replace with dynamic user ID as needed
      message: "",
    };
  },
  methods: {
    async addPercentageCompleted() {
      this.message = "Initializing percentage_completed...";

      try {
        // Reference to the ongoing_courses collection for the user
        const ongoingCoursesRef = collection(
          db,
          `users/${this.user}/ongoing_courses`
        );

        // Fetch all course documents within ongoing_courses
        const courseDocsSnap = await getDocs(ongoingCoursesRef);

        // Iterate through each course document and set percentage_completed to 0
        const updatePromises = courseDocsSnap.docs.map((courseDoc) =>
          updateDoc(doc(db, courseDoc.ref.path), { percentage_completed: 0 })
        );

        // Wait for all updates to complete
        await Promise.all(updatePromises);

        // Update message on success
        this.message = "Percentage completed initialized to 0 for all courses.";
        console.log("percentage_completed set to 0 for all ongoing courses.");
      } catch (error) {
        console.error("Error updating percentage_completed:", error);
        this.message = "Error updating percentage_completed. Check console for details.";
      }
    },
  },
};
</script>

<style scoped>
.container {
  max-width: 600px;
}

.btn {
  width: 100%;
}
</style>
