<template>
  <div id="app">
      <nav-menu /> <!-- Include the header component -->
      <router-view /> <!-- This is where the current route's component will be rendered -->
  </div>
</template>

<script>
import NavMenu from './components/NavMenu.vue'

export default {
  components: {
    'nav-menu':NavMenu
  }
}
</script>

<style>
@import './css/style.css';
@import './css/navbar_footer_style.css';
@import './css/background-decor.css';
@import './css/mainmin.css';
</style>
