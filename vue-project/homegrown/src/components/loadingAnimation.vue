<template>
  <div class="loading-container">
    <div class="spinner">
      <div class="double-ring bg-primary"></div>
      <div class="double-ring bg-secondary double-ring-secondary"></div>
    </div>
    <p class="loading-text text-primary">Loading, please wait...</p>
  </div>
</template>

<style scoped>
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.9);
}

.spinner {
  position: relative;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.double-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 8px solid transparent;
  border-radius: 50%;
  animation: spin 1.5s linear infinite, pulse 1.5s ease-in-out infinite;
}


.double-ring-secondary {
  animation-delay: -0.75s; /* Offset the secondary ring for a cool effect */
}

.loading-text {
  font-size: 1.25rem;
  margin-top: 20px;
  font-weight: bold;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}
</style>
