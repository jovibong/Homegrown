<template>
  <div class="individualCoursePage">
   <loading-animation></loading-animation>
  </div>
</template>


<script>
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/initialize";
import loadingAnimation from "../components/loadingAnimation.vue";

export default {
  components:{
    loadingAnimation,
  },
  data() {
    return {
      user: "user_00001", // Target user ID
      course: null,
      loading: true, // Loading state

    };
  },
  methods: {
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
    preloadImage(url) {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = url;
        img.onload = () => resolve(url);
        img.onerror = () => resolve(this.placeholderImage); // Use placeholder on error
      });
    },
    async fetchCourses() {
      try {
        // Fetch user data to get ongoing course IDs
        const userDocRef = doc(db, "users", this.user);
        const userSnap = await getDoc(userDocRef);

        // Check if user data exists and retrieve ongoing courses array
        const userOngoingCourseIds = userSnap.exists()
          ? userSnap.data().ongoing_courses || []
          : [];
        console.log("User Ongoing Courses IDs:", userOngoingCourseIds);

        // Fetch all courses from Firestore
        const coursesSnap = await getDocs(collection(db, "courses"));
        const allCourses = coursesSnap.docs.map((doc) => ({
          id: doc.id, // Document ID (e.g., course_00101)
          ...doc.data(),
        }));

        console.log("All Courses Fetched from Firestore:", allCourses);

        // Separate ongoing and new courses by matching document ID
        const ongoing = allCourses
          .filter((course) => userOngoingCourseIds.includes(course.id))
          .slice(0, 6);

        const newCourses = allCourses
          .filter((course) => !userOngoingCourseIds.includes(course.id))
          .slice(0, 6);

        console.log("Filtered Ongoing Courses:", ongoing);
        console.log("Filtered New Courses:", newCourses);

        this.ongoing_courses = ongoing;
        this.new_courses = newCourses;

        // Preload images for each course and populate course_images
        await Promise.all(
          ongoing.concat(newCourses).map(async (course, index) => {
            const imageUrl = `https://random.imagecdn.app/500/300?random=${Date.now() + index}`;
            const loadedImage = await this.preloadImage(imageUrl);
            this.course_images[course.id] = loadedImage; // Directly assign the image URL to course_images
          })
        );

        console.log("Course Images:", this.course_images);

        // Set loading to false after all images are loaded
        this.loading = false;
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    },
  },
  mounted() {
    const courseId = this.$route.params.course_id;
    console.log("Course ID:", courseId);
    this.fetchCourses();
  },
};



</script>




<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>