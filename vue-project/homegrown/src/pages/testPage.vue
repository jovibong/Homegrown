<template>
  <div>
    <button @click="addCoursesToUsers">Add Ongoing Courses to Users</button>
  </div>
</template>

<script>
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase/initialize"; // Adjust this path as needed for your project

export default {
  name: "AddOngoingCourses",
  methods: {
    async addCoursesToUsers() {
      try {
        // Define the array of course IDs to add to each user
        const courseIds = ["course_00101", "course_00103", "course_00105", "course_00107"];

        // Access the `users` collection
        const usersCollection = collection(db, "users");
        
        // Get all user documents
        const userSnapshots = await getDocs(usersCollection);

        // Loop through each user document
        for (const userDoc of userSnapshots.docs) {
          // Create a reference to each user document
          const userRef = doc(db, "users", userDoc.id);
          
          // Update each user document to include the `ongoing_courses` array
          await updateDoc(userRef, {
            ongoing_courses: courseIds
          });
        }

        console.log("Added ongoing_courses to all users successfully.");
      } catch (error) {
        console.error("Error adding ongoing_courses to users:", error);
      }
    }
  }
};
</script>
