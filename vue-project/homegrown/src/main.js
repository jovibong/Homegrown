import { createApp } from 'vue'
import router from './router/index.js'; // Import the router
import App from './App.vue'

import './css/animation.css';
import './js/animation.js';

const app = createApp(App);
app.use(router); // Use the router
app.mount('#app');
