<template>
    <button @click="goBack">Go Back</button>
  </template>
  
  <script>
  export default {
    methods: {
      goBack() {
        this.$router.go(-1);  // Goes back one step in the browser history
      }
    }
  };
  </script>