<template>
  <!---start of navbar-->
  <div class="container-fluid bg-custom-blue sticky-top">

    <!-- start row for using grid -->
    <div class="row">

      <!-- start of nav without sign in/up -->
      <div class="col-lg-10 col-9 align-items-start">
        <nav class="navbar navbar-expand-lg">
          <div class="container">
            <!-- Logo -->
            <a class="navbar-brand me-auto" href="#">
              <span class="text-light fw-bold">Home</span><span class="text-warning fw-bold">Grown</span>
            </a>

            <!-- hamburger collapsible icon -->
            <!-- Hamburger Menu and Profile Button Container -->
            <div class="d-flex align-items-center"></div>
              <!-- flex and hamburger menu only for mobile -->
              <button class="navbar-toggler d-flex d-lg-none flex-column"
                  type="button" :class="{ collapsed: !isNavbarOpen }" @click="toggleNavbar"
                  aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation"
                  v-if="userType === 'worker' || userType === 'volunteer'">
                  <!-- custom 3 lines for animation for menu -->
                  <span class="toggler-icon top-bar"></span>
                  <span class="toggler-icon middle-bar"></span>
                  <span class="toggler-icon bottom-bar"></span>
              </button>

              <!-- list of links/navs -->
              <div :class="['collapse', 'navbar-collapse', 'justify-content-center', { show: isNavbarOpen }]" id="navbarNav">
                <ul class="navbar-nav">
                <li class="nav-item mx-3" v-if="userType === 'worker' || userType === 'volunteer'">
                  <router-link 
                    :to="userType === 'worker' ? '/homePage' : '/volunteerHomePage'" 
                    class="nav-link active text-light" 
                    aria-current="page"  @click="closeNavbar">
                    Home
                  </router-link>
                </li>
                <li class="nav-item mx-3" v-if="userType === 'worker'">
                  <router-link to="/coursesPage" class="nav-link text-light" @click="closeNavbar">Upskilling</router-link>
                </li>
                <li class="nav-item mx-3" v-if="userType === 'volunteer'">
                  <router-link to="/volunteerPage" class="nav-link text-light" @click="closeNavbar">Volunteer</router-link>
                </li>
                <li class="nav-item mx-3" v-if="userType === 'worker' || userType === 'volunteer'">
                  <router-link to="/eventPage" class="nav-link text-light" @click="closeNavbar">Events</router-link>
                </li>
                <li class="nav-item mx-3" v-if="userType === 'worker' || userType === 'volunteer'">
                  <router-link to="/chatPage" class="nav-link text-light" @click="closeNavbar">Chat</router-link>
                </li>
                <li class="nav-item mx-3" v-if="userType === 'worker'">
                  <router-link to="/financePage" class="nav-link text-light" @click="closeNavbar">Finance</router-link>
                </li>
                <li class="nav-item mx-3" v-if="userType === 'volunteer'">
                  <router-link to="/mentorshipPage" class="nav-link text-light" @click="closeNavbar">Mentorship</router-link>
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
            <router-link to="/editProfile" class="dropdown-item"><i class="bi bi-gear-fill"></i> Profile
              Settings</router-link>
              <router-link 
              v-if="userType === 'worker'" 
              to="/workersCertification" 
              class="dropdown-item">
              <i class="bi bi-award-fill"></i> Certifications
            </router-link>
            <router-link 
              v-else-if="userType === 'volunteer'" 
              to="/volunteerAchievement" 
              class="dropdown-item">
              <i class="bi bi-award-fill"></i> Achievements
            </router-link>
            <hr>
            <router-link to="/" class="dropdown-item" @click="logout"><i class="bi bi-box-arrow-right"></i> Sign
              Out</router-link>
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
  </div>
  <!---end of navbar-->

  <!-- handle profile image updates -->
  <EditProfile @profileImageUpdated="handleProfileImageUpdate" /> 

  <!-- handle username updates -->
  <EditProfile @usernameUpdated="handleUsernameUpdate" />

  <!-- // Show Sign Out Popup when user clicks Sign Out -->

  <LoginModal :visible="isLoginModalVisible" @login="handleLogin" @openSignup="switchToSignUpModal"
    @update:visible="isLoginModalVisible = $event" />

  <SignupModal :visible="isSignUpModalVisible" @signup="handleSignup" @update:visible="isSignUpModalVisible = $event" />
</template>

<script>
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from '@/firebase/initialize.js';
import LoginModal from './authentication/LoginModal.vue';
import SignupModal from './authentication/SignupModal.vue';
import { doc, getDoc } from 'firebase/firestore';


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
      isDropdownVisible: false, // Track dropdown visibility
      userType: null,
      isNavbarOpen: false, // Tracks the open/closed state of the navbar
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

    onAuthStateChanged(auth, async (user) => {
          if (user) {
            const docRef = doc(db, "profiles", user.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                this.user = {
                    ...user,
                    displayName: docSnap.data().username || user.displayName,
                    photoURL: docSnap.data().profileImageUrl || user.photoURL
                };
                this.userType = docSnap.data().userType;
            } else {
                this.user = user;
                this.userType = null;
            }
        } else {
            this.user = null;
            this.userType = null;
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
          this.userType = null; // Reset user type
          this.$router.push("/"); // Redirect to home page
        })
        .catch((error) => {
          console.error("Error signing out:", error);
          this.$emit('stopLoading'); // Hide spinner on error
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
    },
    toggleNavbar() {
      // Toggle the open/closed state of the navbar
      this.isNavbarOpen = !this.isNavbarOpen;
    },
    closeNavbar() {
      // Close the navbar (set state to false)
      this.isNavbarOpen = false;
    },
    handleProfileImageUpdate(newImageUrl) {
            if (this.user) {
                this.user.photoURL = newImageUrl; // Update user object with new image URL
      }
    },
    handleUsernameUpdate(newUsername) {
      if (this.user) {
            // Update the user object in a reactive way
            this.$set(this.user, 'displayName', newUsername);
        }
    }
  }
};
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
.profile-img {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  margin-right: 8px;
}

.arrow-down,
.arrow-up {
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
  top: calc(100% + 8px);
  /* Adds an 8px gap between the button and dropdown */
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
  width: 35px;
  /* Set the desired width */
  height: 35px;
  /* Set the desired height */
  border-radius: 50%;
  /* Makes the image circular */
  object-fit: cover;
  /* Ensures the image covers the space without distortion */
  border: 2px solid #000;
  /* Optional: adds a border around the image */
  margin-right: 15px;
  /* Adds space between the image and text */
  object-fit: cover;
  /* Ensures the image covers the space without distortion */
}

.dropdown-username {
  flex: 1;
  /* Push the text to occupy the remaining space */
  text-align: left;
  /* Align text to the left within its space */
  font-size: 1rem;
  /* Adjust font size as needed */
  font-weight: bold;
  /* Optional */
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

/* Navbar Toggler Icon */
.navbar-toggler {
  border: none !important;         /* Remove border */
  background-color: transparent !important;  /* Make background transparent */
  box-shadow: none !important;     /* Remove any box shadow */
  outline: none !important;        /* Remove focus outline */
  padding: 0 !important;     /* Reset padding if needed */
  align-items: center !important; /* Center vertically */  
}

.toggler-icon {
  display: block;
  width: 25px;
  height: 3px;
  background-color: darkred; /* Default color */
  margin: 4px 0;
  transition: transform 0.3s ease, opacity 0.3s ease, background-color 0.3s ease;
}

/* Style for collapsed (X) icon */
.collapsed-bar.top-bar {
  transform: rotate(45deg) translate(5px, 5px);
  background-color: red; /* Change to red when transformed */
}

.collapsed-bar.middle-bar {
  opacity: 0; /* Hide middle bar for "X" effect */
}

.collapsed-bar.bottom-bar {
  transform: rotate(-45deg) translate(5px, -5px);
  background-color: red; /* Change to red when transformed */
}

/* General button styling */
.btn {
  white-space: nowrap; /* Prevents text from wrapping */
  display: inline-block; /* Ensures buttons stay inline */
  min-width: 100px; /* Set a consistent minimum width */
  padding: 10px 16px; /* Ensure consistent padding */
  font-size: 1rem; /* Set a consistent font size */
  text-align: center; /* Center text */
}

/* Media query to handle different screen sizes */
@media (max-width: 1230px) {
  .btn {
    min-width: 100px; /* Maintain minimum width */
    font-size: 0.95rem; /* Slightly adjust font size if needed */
  }
}

@media (max-width: 820px) {
  .btn {
    min-width: 90px; /* Adjust if necessary for smaller screens */
    font-size: 0.9rem; /* Adjust font size for readability */
  }
}

@media (max-width: 470px) {
  .profile-dropdown {
    margin-left: 10px; /* Adjust the spacing between the profile button and the hamburger */
  }
}

.navbar {
    justify-content: space-between !important; /* Ensure navbar items are evenly spaced */
  }
</style>
