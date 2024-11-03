<template>
  <div>
    <div class="bg-secondary">
      <div v-for="(course, key) in courses" :key="key" class="my-5">
        <div class="content" :ref="'courseDescription' + course">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores eius
          dolorem accusantium labore. Nihil, itaque amet. Repellendus enim
          minima architecto dicta aliquid perspiciatis porro tempore, sequi
          laborum rerum, rem illum.
        </div>
        <div class="circle" @click="toggleAccordion(course)">press</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      courses: [1, 2, 3, 4, 5],
    };
  },
  methods: {
    toggleAccordion(course) {
      const courseDetails = this.$refs[`courseDescription${course}`][0];
      
      // Check if the panel is currently expanded
      if (courseDetails.style.height === `${courseDetails.scrollHeight}px`) {
        // Collapse the panel by setting height to 0
        courseDetails.style.height = "0px";
      } else {
        // Expand the panel by setting height to scrollHeight
        courseDetails.style.height = `${courseDetails.scrollHeight}px`;
      }
    },
  },
};
</script>

<style scoped>
.content {
  height: 0px;
  overflow: hidden;
  transition: height 0.5s ease; /* Adjust duration as needed */
}
</style>
