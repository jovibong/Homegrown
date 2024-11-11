<template>
  <div class="emoji-picker-container">
    <div class="emoji-picker-content">
      <span
        v-for="emoji in emojis"
        :key="emoji.slug"
        class="emoji"
        @click="$emit('emoji-selected', emoji.character)"
      >
        {{ emoji.character }}
      </span>
    </div>
  </div>
</template>



<script>
export default {
  props: ['emojis'],
  methods: {
    selectEmoji(emoji) {
      this.$emit('emoji-selected', emoji);
    }
  }
};
</script>

<style scoped>
.emoji-picker-container {
  position: absolute;
  bottom: 50px; /* Adjust positioning if needed */
  left: 25%;
  max-height: 200px; /* Adjust max-height for container */
  overflow-y: hidden; /* Hides the scrollbar */
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  padding: 10px;
  z-index: 10;
  width: 50%;
}

.emoji-picker-content {
  display: flex;
  flex-wrap: wrap;
  gap: 8px; /* Adds space between emojis */
  max-height: 180px;
  overflow-y: auto;
}

.emoji-picker-content::-webkit-scrollbar {
  display: none; /* Hides scrollbar on Webkit browsers */
}

.emoji {
  font-size: 1.5rem; /* Emoji size */
  cursor: pointer;
  transition: transform 0.2s;
}

.emoji:hover {
  transform: scale(1.2);
}


</style>
