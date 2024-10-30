<template>
  <div id="app">
      <nav-bar /> <!-- Include the header component -->
      <router-view /> <!-- This is where the current route's component will be rendered -->
  </div>
</template>

<script>
import NavBar from './components/NavBar.vue'

export default {
  components: {
    'nav-bar':NavBar
  }
}
</script>

<style>
@import './css/style.css';
@import './css/navbar_footer_style.css';
@import './css/background-decor.css';
@import './css/mainmin.css';
</style>
