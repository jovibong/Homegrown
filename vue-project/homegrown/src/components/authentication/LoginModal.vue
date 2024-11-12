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

          <!-- Custom Red X Button (Top Right) -->
          <button
            type="button"
            class="custom-close"
            @click="hideModal"
          >
            &times;
          </button>

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

            <!-- Error Message Display -->
            <p v-if="errorMessage" class="error-text">{{ errorMessage }}</p>

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
import { auth } from '@/firebase/initialize.js';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '@/firebase/initialize.js';

export default {
  emits: ['error'],
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
      rememberMe: false,
      imageUrl: require('@/img/group_picture.jpg'),
      modalInstance: null,
      user: null,
      errorMessage: '' // Error message for displaying above the form
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
      this.resetForm();
    },
    hideModal() {
      if (this.modalInstance) {
        this.modalInstance.hide();
      }
      this.$emit("update:visible", false);
    },
    resetForm() {
      this.email = '';
      this.password = '';
      this.errorMessage = ''; // Clear the error message as well
    },
    async handleLogin() {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, this.email, this.password);
        const user = userCredential.user;
        console.log("Logged in user:", user);

        if (this.rememberMe) {
          localStorage.setItem('user', JSON.stringify(user));
        } else {
          sessionStorage.setItem('user', JSON.stringify(user));
        }

        const docRef = doc(db, 'profiles', user.uid);
        const docSnap = await getDoc(docRef);
        let userType;

        if (docSnap.exists()) {
          userType = docSnap.data().userType;
          if (userType === 'worker') {
            this.$router.push({ name: 'homePage' });
          } else if (userType === 'volunteer') {
            this.$router.push({ name: 'volunteerHomePage' });
          } else {
            this.$router.push({ name: '/' });
          }
        } else {
          this.$router.push({ name: '/' });
        }

        this.hideModal();
      } catch (error) {
        console.error("Error logging in:", error.message);
        this.errorMessage = "Error logging in, please sign in again" || 'An error occurred during login.'; // Set error message here
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
.modal-dialog {
    max-width: 600px;
}

.modal-content {
    border-radius: 20px;
    max-height: 90vh;
    height: auto;
    overflow-y: auto;
}

.modal-login h2 {
    color:#525FE1; 
    font-weight: bold;
    font-size: 2rem;
}

.modal-login #home {
    color:#525FE1; 
}

.modal-login .text-warning {
    color: #FFC107 !important;
}

.modal-login .btn-primary {
    background-color: #525FE1;
    border: none;
}

.modal-login .btn-primary:hover {
    background-color: #335E9A;
}

.signup-link a {
    color: #525FE1;
    text-decoration: underline;
}

.bold-label {
    font-weight: bold;
}

.custom-close {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: transparent;
  border: none;
  color: red;
  font-size: 1.5rem;
  font-weight: bold;
  cursor: pointer;
  z-index: 1051;
}

.custom-close:hover {
  color: darkred;
}

.error-text {
  color: red;
  font-weight: bold;
  margin-bottom: 10px;
}
</style>
