<template>
    <!---start of navbar-->
    <div class="container-fluid bg-custom-blue sticky-top">

        <!-- start row for using grid -->
        <div class="row">

            <!-- start of nav without sign in/up -->
            <div class="col-lg-10 col-9 align-items-start">
                <nav class="navbar navbar-expand-lg ">
                    <div class="container">
                        <!-- Logo -->
                        <a class="navbar-brand me-auto" href="#">
                            <span class="text-light fw-bold">Home</span><span class="text-warning fw-bold">Grown</span>
                        </a>

                        <!-- hamburger collapsible icon -->
                        <!-- flex and hamburger menu only for mobile -->
                        <button class="navbar-toggler d-flex d-lg-none flex-column justify-content-around collapsed"
                            type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                            aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                            <!-- custom 3 lines for animation for menu -->
                            <span class="toggler-icon top-bar"></span>
                            <span class="toggler-icon middle-bar"></span>
                            <span class="toggler-icon bottom-bar"></span>
                        </button>

                        <!-- list of links/navs -->
                        <div class="collapse navbar-collapse justify-content-center" id="navbarNav">
                            <ul class="navbar-nav">
                                <li class="nav-item mx-3">
                                    <a class="nav-link active text-light" aria-current="page" href="#">Home</a>
                                </li>
                                <li class="nav-item mx-3">
                                    <router-link to="/coursesPage" class="nav-link text-light">Upskilling</router-link>
                                </li>
                                <li class="nav-item mx-3">
                                    <router-link to="/volunteerPage" class="nav-link text-light">Volunteer</router-link>
                                </li>
                                <li class="nav-item mx-3">
                                    <router-link to="/eventPage" class="nav-link text-light">Events</router-link>
                                </li>
                                <li class="nav-item mx-3">
                                    <router-link to="/chat" class="nav-link text-light">Chat</router-link>
                                </li>
                                <li class="nav-item mx-3">
                                    <router-link to="/financePage" class="nav-link text-light">Finance</router-link>
                                </li>
                                <li class="nav-item mx-3">
                                    <router-link to="/mentorshipPage" class="nav-link text-light">Mentorship</router-link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </div>
            <!-- end of nav without sign in/up -->

            <!-- profile dropdown and sign in/up buttons using v-if else conditions -->
            <div class="col-lg-2 col-3 d-flex justify-content-end align-items-center">
                <div v-if="user" class="profile-dropdown" @click="toggleDropdown">
                <button class="profile-btn" id="profileDropdownBtn">
                    <img :src="userPhoto" alt="Profile Picture" class="profile-img" />
                    <div class="profile-name btn-warning">
                    <span>{{ user.displayName || 'User' }}</span>
                    <i :class="isDropdownVisible ? 'arrow-up' : 'arrow-down'"></i>
                    </div>
                </button>

                <!-- Dropdown Content -->
                <div v-if="isDropdownVisible" class="dropdown-content bg-warning" id="dropdownContent">
                    <div class="dropdown-header">
                    <img :src="userPhoto" alt="Profile Picture" class="dropdown-img" />
                    <span class="dropdown-username">{{ user.displayName || 'User' }}</span>
                    </div>
                    <hr>
                    <router-link to="/editProfile" class="dropdown-item"><i class="bi bi-gear-fill"></i> Profile Settings</router-link>
                    <router-link to="/workersCertification" class="dropdown-item"><i class="bi bi-award-fill"></i> Certifications</router-link>
                    <hr>
                    <a href="#" class="dropdown-item" @click="logout"><i class="bi bi-box-arrow-right"></i> Sign Out</a>
                </div>
                </div>

                <!-- Show Sign In/Up Buttons when User is not logged in -->
                <nav v-else class="navbar d-flex flex-nowrap">
                    <!-- if want the sign in to remain as a navlink use class below -->
                    <!-- nav-link fw-bold text-light me-3 btn glow-on-hover -->
                    <a class="btn btn-warning fw-bold glow-on-hover mx-1" @click="openLoginModal">Sign In</a>
                    <a class="btn btn-warning fw-bold glow-on-hover mx-1" @click="openSignUpModal">Sign Up</a>
                </nav>
            </div>
        </div>
        
        <!-- end of row -->

    </div>
    <!---end of navbar-->
    <LoginModal
    :visible="isLoginModalVisible"
    @login="handleLogin"
    @openSignup="switchToSignUpModal"
    @update:visible="isLoginModalVisible = $event"
  />

  <SignupModal
      :visible="isSignUpModalVisible"
      @signup="handleSignup"
      @update:visible="isSignUpModalVisible = $event"
    />
</template>

<script>
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/firebase/initialize.js';
import LoginModal from './authentication/LoginModal.vue';
import SignupModal from './authentication/SignupModal.vue';

export default {
  components: {
    LoginModal,
    SignupModal
  },
  data() {
    return {
      isLoginModalVisible: false,
      isSignUpModalVisible: false,
      user: null,
      isDropdownVisible: false // Track dropdown visibility
    };
  },
  computed: {
    userPhoto() {
      return this.user?.photoURL || require('@/img/blankprofile.png'); // Fallback to default profile pic if none is provided
    }
  },
  created() {
    // Check storage for "Remember Me" and user data on page load
    const rememberMe = localStorage.getItem('rememberMe') === 'true';
    const savedUser = rememberMe ? localStorage.getItem('user') : sessionStorage.getItem('user');

    // Set the user if available in storage
    this.user = savedUser ? JSON.parse(savedUser) : null;

    // Watch Firebase auth state changes
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // Save user data in the appropriate storage based on "Remember Me" preference
        if (rememberMe) {
          localStorage.setItem('user', JSON.stringify(user));
        } else {
          sessionStorage.setItem('user', JSON.stringify(user));
        }
        this.user = user;
      } else {
        // Clear user data from both storages if logged out
        sessionStorage.removeItem('user');
        localStorage.removeItem('user');
        this.user = null;
      }
    });
  },
  mounted() {
    // Listen for clicks on the document to detect clicks outside the dropdown
    document.addEventListener("click", this.handleClickOutside);
  },
  beforeUnmount() {
    // Clean up the event listener when the component is unmounted
    document.removeEventListener("click", this.handleClickOutside);
  },
  methods: {
    openLoginModal() {
      this.isLoginModalVisible = true;
    },
    openSignUpModal() {
      this.isSignUpModalVisible = true;
    },
    switchToSignUpModal() {
      this.isLoginModalVisible = false;
      this.isSignUpModalVisible = true;
    },
    handleLogin() {
      console.log("User has logged in!");
      this.isLoginModalVisible = false;
    },
    handleSignup(userData) {
      console.log("User has signed up!", userData);
      this.isSignUpModalVisible = false;
    },
    logout() {
      signOut(auth)
        .then(() => {
          console.log("User signed out");
          this.user = null;
          this.isDropdownVisible = false;
        })
        .catch((error) => {
          console.error("Error signing out:", error);
        });
    },
    toggleDropdown(event) {
      // Toggle dropdown visibility
      this.isDropdownVisible = !this.isDropdownVisible;
      event.stopPropagation(); // Stop event from closing the dropdown immediately
    },
    handleClickOutside(event) {
      // Only proceed if the dropdown is currently visible
      if (!this.isDropdownVisible) return;

      // Access the dropdown and button elements by their class names
      const dropdown = document.querySelector(".dropdown-content");
      const button = document.querySelector(".profile-btn");

      // Check if the click is outside both dropdown and button
      if (dropdown && button && !dropdown.contains(event.target) && !button.contains(event.target)) {
        this.isDropdownVisible = false;
      }
    }
}};
</script>

<style scoped>
/* Profile Dropdown container styling */
.profile-dropdown {
  position: relative;
}

.profile-btn {
  display: flex;
  align-items: center;
  background: #FFC107;
  color: black;
  border: none;
  border-radius: 5px;
  padding: 8px 12px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s ease;
  position: relative;
}

.profile-btn:hover {
  background-color: #e0a106;
}

/* Profile image */
.profile-img  {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  margin-right: 8px;
}

.arrow-down, .arrow-up {
  font-size: 0.8rem;
  margin-left: 6px;
}

/* Rotate the arrow to face up when dropdown is visible */
.arrow-up::before {
  content: "▲";
  color: black;
}

.arrow-down::before {
  content: "▼";
  color: black;
}

/* Dropdown content styling */
.dropdown-content {  
  position: absolute;
  right: 0;
  top: calc(100% + 8px); /* Adds an 8px gap between the button and dropdown */
  background-color: #FFC107;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  width: 200px;
  padding: 10px;
  border-radius: 8px;
  z-index: 1000;
  align-items: center;
}

/* Styling for individual dropdown items */
.dropdown-content a {
  display: flex;
  align-items: center;
  padding: 8px;
  color: #333;
  text-decoration: none;
}

.dropdown-img {
  width: 35px; /* Set the desired width */
  height: 35px; /* Set the desired height */
  border-radius: 50%; /* Makes the image circular */
  object-fit: cover; /* Ensures the image covers the space without distortion */
  border: 2px solid #000; /* Optional: adds a border around the image */
  margin-right: 15px; /* Adds space between the image and text */
  object-fit: cover; /* Ensures the image covers the space without distortion */
}

.dropdown-username {
  flex: 1; /* Push the text to occupy the remaining space */
  text-align: left; /* Align text to the left within its space */
  font-size: 1rem; /* Adjust font size as needed */
  font-weight: bold; /* Optional */
  color: #333;
}

.dropdown-content a:hover {
  background-color: #e0a106;
}

/* Icon and text spacing */
.dropdown-content i {
  margin-right: 8px;
}

.hidden {
  display: none;
}
</style>


