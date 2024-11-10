<template>
  <!-- Login Modal (with height adjustments) -->
  <div
    class="modal fade login-modal"
    id="loginModal"
    tabindex="-1"
    aria-labelledby="loginModalLabel"
    aria-hidden="true"
    ref="loginModal"
  >
    <div class="modal-dialog modal-dialog-centered">
      <!-- Centers modal vertically -->
      <div class="modal-content" style="border-radius: 20px; max-height: 80vh; height: auto; overflow-y: auto;">
        <!-- Set max-height and overflow -->
        <div class="modal-body p-0 d-flex flex-row" style="height: 100%;">
          <!-- Left Side: Image -->
          <div
            class="modal-image"
            :style="{ backgroundImage: 'url(' + imageUrl + ')' }"
            style="flex: 1; background-size: cover; background-position: center; border-top-left-radius: 20px; border-bottom-left-radius: 20px;"
          ></div>

          <!-- Right Side: Login Form -->
          <div class="modal-login p-4" style="flex: 1; background-color: #ffffff; border-top-right-radius: 20px; border-bottom-right-radius: 20px;">
            <div>
              <span class="fw-bold" id="home">Home</span><span class="text-warning fw-bold">Grown</span><br /><br />
            </div>
            <h2 class="mb-4">Welcome!</h2>
            <form @submit.prevent="handleLogin">
              <div class="form-group mb-3">
                <label for="email" class="bold-label">Email or Phone Number</label>
                <input type="text" class="form-control" v-model="email" placeholder="Enter email or phone number" />
              </div>
              <div class="form-group mb-3">
                <label for="password" class="bold-label">Password</label>
                <input type="password" class="form-control" v-model="password" placeholder="Enter password" />
              </div>
              <div class="form-check mb-3">
                <input type="checkbox" class="form-check-input" id="rememberMe" v-model="rememberMe" />
                <label class="form-check-label" for="rememberMe">Remember me</label>
              </div>
              <button type="submit" class="btn btn-primary btn-block w-100">Sign In</button>
            </form>
            <div class="signup-link text-center mt-4">
              <p>Don't have an account? <a href="#" @click.prevent="openSignup">Sign up now</a></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Modal } from "bootstrap";
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebase/initialize.js'; // Import Firebase auth instance
import { getDoc, doc } from 'firebase/firestore';
import { db } from '@/firebase/initialize.js'; // Import Firestore instance

export default {
  emits: ['startLoading', 'stopLoading'],
  name: "LoginModal",
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      email: "",
      password: "",
      rememberMe: false, // checkbox for "Remember Me"
      imageUrl: require('@/img/group_picture.jpg'),
      modalInstance: null,
      user: null, // user data from login
    };
  },
  watch: {
    visible(newValue) {
      if (newValue) {
        this.showModal();
      } else {
        this.hideModal();
      }
    }
  },
  methods: {
    showModal() {
      if (!this.modalInstance) {
        this.modalInstance = new Modal(this.$refs.loginModal);
        this.$refs.loginModal.addEventListener("hidden.bs.modal", () => {
          this.$emit("update:visible", false);
          this.resetForm(); // Clear form when modal is closed
        });
      }
      this.modalInstance.show();
      this.resetForm(); // Clear form each time modal opens
    },
    hideModal() {
      if (this.modalInstance) {
        this.modalInstance.hide();
      }
      this.$emit("update:visible", false);
    },
    resetForm() {
      // Clear all input fields
      this.email = '';
      this.password = '';
    },
    async handleLogin() {
      try {
        // Firebase sign-in
        const userCredential = await signInWithEmailAndPassword(auth, this.email, this.password);
        const user = userCredential.user;
        console.log("Logged in user:", user);

        // Check the "Remember Me" preference and save accordingly
        if (this.rememberMe) {
          localStorage.setItem('rememberMe', true);
          sessionStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('user', JSON.stringify(user));
        } else {
          sessionStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('user', JSON.stringify(user));
        }

        // Fetch userType from Firestore
        const docRef = doc(db, 'profiles', user.uid);
        const docSnap = await getDoc(docRef);
        let userType;

        if (docSnap.exists()) {
          userType = docSnap.data().userType;
          console.log('UserType fetched:', userType);

          // Redirect based on userType
          if (userType === 'worker') {
            this.$router.push({ name: 'homePage' });
          } else if (userType === 'volunteer') {
            this.$router.push({ name: 'volunteerHomePage' });
          } else {
            console.warn('Unknown userType:', userType);
            this.$router.push({ name: '/' }); // Default or error page if needed
          }
        } else {
          console.log('No such document!');
          this.$router.push({ name: '/' }); // Redirect to a default or error page if no userType is found
        }

        // Emit login event to parent if needed
        this.$emit('login', { user: user, rememberMe: this.rememberMe });

        // Hide login modal
        this.hideModal();
      } catch (error) {
        console.error("Error logging in:", error.message);
        alert("Login failed: " + error.message);
      }
},
    openSignup() {
      this.$emit("openSignup");
      this.hideModal();
    }
  },
  mounted() {
    if (this.visible) {
      this.showModal();
    }
  },
  beforeUnmount() {
    if (this.modalInstance) {
      this.modalInstance.dispose();
    }
  },
};
</script>


<style scoped>
/* Enlarge modal size */
.modal-dialog {
    max-width: 600px; /* Adjust width as needed */
}

.modal-content {
    border-radius: 20px;
    max-height: 90vh;
    height: auto;
    overflow-y: auto;
}

/* Style for the header text */
.modal-login h2 {
    color:#525FE1; 
    font-weight: bold;
    font-size: 2rem;
}

.modal-login #home {
    color:#525FE1; 
}

.modal-login .text-warning {
    color: #FFC107 !important; /* Navbar complementary color */
}

/* Adjust Sign In button styling */
.modal-login .btn-primary {
    background-color: #525FE1; /* Match to navbar color */
    border: none;
}

.modal-login .btn-primary:hover {
    background-color: #335E9A; /* Slightly darker shade for hover effect */
}

.signup-link a {
    color: #525FE1;
    text-decoration: underline;
}

.bold-label {
    font-weight: bold;
}
</style>

