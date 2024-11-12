<template>
  <!---start of navbar-->
  <div class="container-fluid bg-custom-blue sticky-top">
    <div class="row align-items-center">
      <!-- Brand -->
      <div class="col-lg-2 col-6">
        <nav class="navbar navbar-expand-lg">
          <a class="navbar-brand" href="#">
            <span class="text-light fw-bold">Home</span><span class="text-warning fw-bold">Grown</span>
          </a>
        </nav>
      </div>

      <!-- Navigation Links for Large Screens -->
      <div class="col-lg-8 d-none d-lg-flex justify-content-center">
        <nav class="navbar navbar-expand-lg">
          <ul class="navbar-nav mx-auto">
            <!-- Your nav links here -->
            <li class="nav-item mx-3" v-if="userType === 'worker' || userType === 'volunteer'">
              <router-link :to="userType === 'worker' ? '/homePage' : '/volunteerHomePage'" class="nav-link active text-light" @click="closeNavbar">
                Home
              </router-link>
            </li>
            <li class="nav-item mx-3" v-if="userType === 'worker'">
              <router-link to="/coursesPage" class="nav-link text-light" @click="closeNavbar">Upskilling</router-link>
            </li>
            <li class="nav-item mx-3" v-if="userType === 'volunteer'">
              <router-link to="/mentorshipPage" class="nav-link text-light" @click="closeNavbar">Mentorships</router-link>
            </li>
            <li class="nav-item mx-3" v-if="userType === 'worker' || userType === 'volunteer'">
              <router-link to="/eventPage" class="nav-link text-light" @click="closeNavbar">Events</router-link>
            </li>
            <li class="nav-item mx-3" v-if="userType === 'worker'">
              <router-link to="/financePage" class="nav-link text-light" @click="closeNavbar">Finance</router-link>
            </li>
            <li class="nav-item mx-3" v-if="userType === 'volunteer'">
              <router-link to="/volunteerPage" class="nav-link text-light" @click="closeNavbar">Volunteer</router-link>
            </li>
            <li class="nav-item mx-3" v-if="userType === 'worker' || userType === 'volunteer'">
              <router-link to="/chatPage" class="nav-link text-light" @click="closeNavbar">Chat</router-link>
            </li>
            <li class="nav-item mx-3" v-if="userType === 'worker' || userType === 'volunteer'">
              <router-link to="/forum" class="nav-link text-light" @click="closeNavbar">Forum</router-link>
            </li>
          </ul>
        </nav>
      </div>

      <!-- Profile dropdown, Hamburger Icon, and Sign In/Up Buttons -->
      <div class="col-lg-2 col-6 d-flex justify-content-end align-items-center">
        <div class="d-flex align-items-center">
          <!-- Hamburger Menu -->
          <button
            class="navbar-toggler d-flex d-lg-none flex-column me-2"
            type="button"
            :class="{ collapsed: !isNavbarOpen }"
            @click="toggleNavbar"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
            v-if="userType === 'worker' || userType === 'volunteer'">
            <span class="toggler-icon top-bar"></span>
            <span class="toggler-icon middle-bar"></span>
            <span class="toggler-icon bottom-bar"></span>
          </button>

          <!-- Profile Dropdown -->
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
              <router-link v-if="userType === 'worker'" to="/workersCertification" class="dropdown-item">
                <i class="bi bi-award-fill"></i> Certifications
              </router-link>
              <router-link v-else-if="userType === 'volunteer'" to="/volunteerAchievement" class="dropdown-item">
                <i class="bi bi-award-fill"></i> Achievements
              </router-link>
              <hr>
              <router-link to="/" class="dropdown-item" @click="logout"><i class="bi bi-box-arrow-right"></i> Sign Out</router-link>
            </div>
          </div>

          <!-- Sign In/Up Buttons for Unauthenticated Users -->
          <nav v-else class="navbar d-flex flex-nowrap">
            <a class="btn btn-warning fw-bold glow-on-hover mx-1" @click="openLoginModal">Sign In</a>
            <a class="btn btn-warning fw-bold glow-on-hover mx-1" @click="openSignUpModal">Sign Up</a>
          </nav>
        </div>
      </div>
    </div>

    <!-- Mobile Navigation Links -->
    <div v-if="isNavbarOpen" class="d-lg-none bg-custom-blue p-3">
      <ul class="navbar-nav text-center">
        <li class="nav-item mx-3" v-if="userType === 'worker' || userType === 'volunteer'">
            <router-link 
              :to="userType === 'worker' ? '/homePage' : '/volunteerHomePage'" 
              class="nav-link active text-light" 
              aria-current="page"  
              @click="closeNavbar">
              Home
            </router-link>
          </li>
          <li class="nav-item mx-3" v-if="userType === 'worker'">
            <router-link to="/coursesPage" class="nav-link text-light" @click="closeNavbar">Upskilling</router-link>
          </li>
          <li class="nav-item mx-3" v-if="userType === 'volunteer'">
            <router-link to="/mentorshipPage" class="nav-link text-light" @click="closeNavbar">Mentorships</router-link>
          </li>
          <li class="nav-item mx-3" v-if="userType === 'worker' || userType === 'volunteer'">
            <router-link to="/eventPage" class="nav-link text-light" @click="closeNavbar">Events</router-link>
          </li>
          <li class="nav-item mx-3" v-if="userType === 'worker'">
            <router-link to="/financePage" class="nav-link text-light" @click="closeNavbar">Finance</router-link>
          </li>
          <li class="nav-item mx-3" v-if="userType === 'volunteer'">
            <router-link to="/volunteerPage" class="nav-link text-light" @click="closeNavbar">Volunteer</router-link>
          </li>
          <li class="nav-item mx-3" v-if="userType === 'worker' || userType === 'volunteer'">
            <router-link to="/chatPage" class="nav-link text-light" @click="closeNavbar">Chat</router-link>
          </li>
          <li class="nav-item mx-3" v-if="userType === 'worker' || userType === 'volunteer'">
            <router-link to="/forum" class="nav-link text-light" @click="closeNavbar">Forum</router-link>
          </li>
      </ul>
    </div>
  </div>
  <!---end of navbar-->

  <!-- Handle profile image updates -->
  <EditProfile @profileImageUpdated="handleProfileImageUpdate" /> 

  <!-- Handle username updates -->
  <EditProfile @usernameUpdated="handleUsernameUpdate" />

  <!-- Show Sign Out Popup when user clicks Sign Out -->
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

            // Redirect to the landing page
            this.$router.push('/').then(() => {
                // Replace the current history entry with the landing page URL
                window.history.replaceState(null, '', '/');
            });

            // Optional: Add an event listener to prevent using the back button
            window.addEventListener('popstate', () => {
                if (!this.user) { // Check if the user is logged out
                    this.$router.push('/'); // Redirect to the landing page if navigating back
                }
            });
        })
        .catch((error) => {
            console.error("Error signing out:", error);
            this.$emit('stopLoading'); // Hide any loading spinners on error
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
      console.log("Navbar toggled");
    },
    closeNavbar() {
      // Close the navbar (set state to false)
      this.isNavbarOpen = false;
      console.log("Navbar closed");
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

/* Flex alignment to ensure hamburger and profile are centered */
.d-flex.align-items-center.gap-2 {
  display: flex;
  align-items: center;
  gap: 10px; /* Add space between the hamburger and profile button */
}

.navbar-toggler {
  border: none !important;
  background-color: transparent !important;
  padding: 0 !important;
  display: flex;
  align-items: center; /* Center the icon vertically */
  justify-content: center;
  width: 30px; /* Adjust width to keep it aligned next to the profile button */
  height: 30px;
  transition: 0.3s ease;
  z-index: 11; /* Bring it above other elements if needed */
}

.navbar-toggler .toggler-icon {
  display: block;
  width: 25px;
  height: 3px;
  background-color: darkred;
  margin: 4px 0;
  transition: transform 0.3s ease, opacity 0.3s ease, background-color 0.3s ease;
}

/* Styling for the "X" icon when the hamburger is active */
.navbar-toggler:not(.collapsed) .top-bar {
  transform: rotate(45deg) translate(7px, 7px);
  background-color: red;
}

.navbar-toggler:not(.collapsed) .middle-bar {
  opacity: 0;
}

.navbar-toggler:not(.collapsed) .bottom-bar {
  transform: rotate(-45deg) translate(7px, -7px);
  background-color: red;
}

/* Ensure toggler is collapsed back to hamburger icon */
.navbar-toggler.collapsed .top-bar,
.navbar-toggler.collapsed .bottom-bar {
  transform: rotate(0);
}

.navbar-toggler.collapsed .middle-bar {
  opacity: 1;
}

/* Color of 3 lines for hamburger icon */
.navbar-toggler.collapsed .toggler-icon {
    background: linear-gradient(90deg, rgba(255, 233, 179, 1) 0%, rgba(255, 207, 89, 1) 100%);
}

/* Mobile Nav Styles */
.mobile-nav {
  position: absolute; /* Ensures it doesn’t push content */
  top: 100%; /* Aligns it right below the main navbar */
  left: 0;
  width: 100%;
  padding: 1rem 0;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Optional shadow for depth */
}

.container-fluid {
  position: relative;
  overflow: visible; /* Ensure no clipping */
}
</style>
