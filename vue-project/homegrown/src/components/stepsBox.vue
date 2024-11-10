<template>
  <div
    class="step-container"
    @mouseover="hover = true"
    @mouseleave="hover = false"
    @click="toggleActive"
  >
    <div :class="['step-circle', { active: isActive, completed: isCompleted }]">
      <template v-if="!isCompleted">
        {{ stepNumber }}
      </template>
      <template v-else>
        ✔
      </template>
    </div>
    <span class="step-text">{{ stepText }}</span>
    <div v-if="hover" class="tooltip">{{ tooltipText }}</div>
  </div>
</template>

<script>
export default {
  props: {
    stepNumber: {
      type: Number,
      default: 1
    },
    stepText: {
      type: String,
      default: "Sign Up"
    },
    tooltipText: {
      type: String,
      default: "Complete this step to proceed."
    }
  },
  data() {
    return {
      hover: false,
      isActive: false,
      isCompleted: false
    };
  },
  methods: {
    toggleActive() {
      if (!this.isCompleted) {
        this.isActive = !this.isActive;
        this.isCompleted = this.isActive;
      }
    }
  }
};
</script>

<style scoped>
.step-container {
  position: relative;
  display: flex;
  align-items: center;
  padding: 10px 20px;
  background-color: #ffe082;
  border-radius: 8px;
  cursor: pointer;
  transition: box-shadow 0.3s ease, background-color 0.3s ease;
}

.step-container:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  background-color: #ffcc80;
}

.step-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #ffc107;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 18px;
  transition: background-color 0.3s ease, transform 0.3s ease;
  position: relative;
}

.step-circle.active {
  animation: pulse 1.5s infinite;
  background-color: #ff9800;
  transform: scale(1.1);
}

.step-circle.completed {
  background-color: #4caf50;
  color: white;
  transform: scale(1.2);
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1.1);
  }
  50% {
    transform: scale(1.3);
  }
}

.step-text {
  margin-left: 10px;
  font-size: 18px;
  color: #333;
  transition: color 0.3s ease;
}

.step-container:hover .step-text {
  color: #000;
}

.tooltip {
  position: absolute;
  top: -35px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #333;
  color: #fff;
  padding: 5px 10px;
  font-size: 12px;
  border-radius: 4px;
  white-space: nowrap;
  opacity: 0;
  animation: fadeIn 0.3s forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
