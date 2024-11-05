<template>
  <button
    :class="buttonClass"
    @click="handleClick"
    @mouseover="isHovered = true"
    @mouseleave="isHovered = false"
    class="d-flex align-items-center"
  >
    <i :class="iconClass" :style="loadingStyle" class="me-2 fs-4"></i>
    <span class="fw-bold">{{ displayText }}</span>
  </button>
</template>

<script>
export default {
  props: {
    initialText: {
      type: String,
      default: "Add Course",
    },
    clickedText: {
      type: String,
      default: "Added",
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isAdded: false,
      isHovered: false,
    };
  },
  computed: {
    buttonClass() {
      if (this.isAdded && !this.loading) {
        return "btn btn-success btn-pill text-white"; // Final state
      }
      if (this.isAdded && this.loading) {
        return "btn btn-primary btn-pill text-white"; // Loading state
      }
      return [
        "btn btn-pill",
        this.isHovered ? "btn-primary text-white" : "btn-outline-primary text-primary",
      ];
    },
    iconClass() {
      if (this.isAdded && this.loading) {
        return "bi bi-arrow-repeat loading-icon"; // Loading icon with animation class
      }
      return this.isAdded ? "bi bi-check text-white" : this.isHovered ? "bi bi-plus text-white" : "bi bi-plus text-primary";
    },
    loadingStyle() {
      return {};
    },
    displayText() {
      return this.isAdded && !this.loading ? this.clickedText : this.initialText;
    },
  },
  methods: {
    handleClick() {
      if (!this.isAdded) {
        this.isAdded = true;
      }
    },
  },
};
</script>

<style scoped>
/* Make the button pill-shaped */
.btn-pill {
  border-radius: 50px;
  transition: background-color 0.3s, color 0.3s;
}

/* Smooth transition for hover and click */
.btn:hover {
  transition: background-color 0.3s, color 0.3s;
}

/* Keyframes for loading animation */
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Apply spinning animation to loading icon */
.loading-icon {
  animation: spin 1s linear infinite;
}
</style>
