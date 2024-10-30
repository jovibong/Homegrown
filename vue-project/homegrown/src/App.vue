<template>
  <div id="app">
      <AppHeader /> <!-- Include the header component -->
      <router-view /> <!-- This is where the current route's component will be rendered -->
  </div>
</template>

<script>
import navbar from './components/navbar.vue'

export default {
  name: 'App',
  components: {
    navbar
  }
}
</script>

<style>
@import './css/style.css';
@import './css/navbar_footer_style.css';
@import './css/background-decor.css';
@import './css/mainmin.css';
</style>
