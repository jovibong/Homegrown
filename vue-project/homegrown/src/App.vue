<template>
  <div id="app">
      <nav-menu /> <!-- Include the header component -->
      <router-view /> <!-- This is where the current route's component will be rendered -->
      <footer-bar /> 

  </div>
</template>

<script>
import NavMenu from './components/NavMenu.vue'
import FooterBar from './components/FooterBar.vue'

import { animateProgressBars, animateFade, animatePush, animateCounters } from './js/animation.js';


export default {
  components: {
    'nav-menu':NavMenu,
    'footer-bar':FooterBar,
  },
  mounted(){
    animateProgressBars();
    animateFade();
    animatePush();
    animateCounters();
  }
}
</script>

<style>
@import './css/style.css';
@import './css/navbar_footer_style.css';
@import './css/background-decor.css';
@import './css/mainmin.css';
@import './css/animation.css';
</style>
