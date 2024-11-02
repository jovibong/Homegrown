<template>
    <!-- Sign Up Modal (with height adjustments) -->
    <div
      class="modal fade signup-modal"
      id="signupModal"
      tabindex="-1"
      aria-labelledby="signupModalLabel"
      aria-hidden="true"
      ref="signupModal"
    >
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <!-- Centers modal vertically -->
        <div
          class="modal-content"
          style="border-radius: 20px; max-height: 80vh; height: auto; overflow-y: auto;"
        >
          <!-- Close Button (Top Right) -->
          <button
            type="button"
            class="btn-close position-absolute top-0 end-0 m-3"
            data-bs-dismiss="modal"
            aria-label="Close"
            @click="closeModal"
          ></button>
  
          <div class="modal-body p-0 d-flex flex-row" style="height: 100%;">
            <!-- Left Side: Image -->
            <div
              class="modal-image"
              :style="{ backgroundImage: 'url(' + imageUrl + ')' }"
              style="flex: 1; background-size: cover; background-position: center; border-top-left-radius: 20px; border-bottom-left-radius: 20px;"
            ></div>
  
            <!-- Right Side: Sign Up Form -->
            <div
              class="modal-signup p-4"
              style="flex: 1; background-color: #ffffff; border-top-right-radius: 20px; border-bottom-right-radius: 20px;"
            >
              <h2 class="mb-4 text-center">Create Your Account</h2>
              <form @submit.prevent="handleSignup">
                <div class="form-group mb-3">
                  <label for="name">Full Name</label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="name"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div class="form-group mb-3">
                  <label for="email">Email</label>
                  <input
                    type="email"
                    class="form-control"
                    v-model="email"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div class="form-group mb-3">
                  <label for="password">Password</label>
                  <input
                    type="password"
                    class="form-control"
                    v-model="password"
                    placeholder="Create a password"
                    required
                  />
                </div>
                <div class="form-group mb-3">
                  <label for="confirmPassword">Confirm Password</label>
                  <input
                    type="password"
                    class="form-control"
                    v-model="confirmPassword"
                    placeholder="Confirm your password"
                    required
                  />
                </div>
  
                <button type="submit" class="btn btn-primary btn-block w-100">Sign Up</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
import { Modal } from "bootstrap";
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebase/initialize.js'; 

export default {
  name: "SignUpModal",
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      imageUrl: "your-image-url.png",
      modalInstance: null
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
        this.modalInstance = new Modal(this.$refs.signupModal);
        // Add event listener to reset visibility on close
        this.$refs.signupModal.addEventListener("hidden.bs.modal", () => {
          this.$emit("update:visible", false);
        });
      }
      this.modalInstance.show();
    },
    hideModal() {
      if (this.modalInstance) {
        this.modalInstance.hide();
      }
    },
    closeModal() {
      this.$emit("update:visible", false);
    },
    async handleSignup() {
      if (this.password !== this.confirmPassword) {
        alert("Passwords do not match");
        return;
      }
      
      try {
        // Firebase sign-up
        const userCredential = await createUserWithEmailAndPassword(auth, this.email, this.password);
        const user = userCredential.user;
        console.log("Signed up user:", user);
        this.$emit("signup", user); // Emit event with user info if needed
        this.hideModal();
      } catch (error) {
        console.error("Error signing up:", error.message);
        alert("Signup failed: " + error.message);
      }
    },
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
  .modal-image {
    flex: 1;
  }
  
  .modal-signup {
    flex: 1;
    background-color: #ffffff;
    border-top-right-radius: 20px;
    border-bottom-right-radius: 20px;
  }
  
  .modal-dialog {
    max-width: 700px; /* Adjust width as needed */
  }
  
  .modal-content {
    border-radius: 20px;
    max-height: 90vh;
    height: auto;
    overflow-y: auto;
  }
  
  .modal-signup h2 {
    color: #525FE1; /* Match to navbar color */
    ; /* Match this to your navbar color */
    font-weight: bold;
  }
  
  .btn-primary {
    background-color:#525FE1; /* Match to navbar color */
    ; /* Match to navbar color */
    border: none;
  }
  
  .btn-primary:hover {
    background-color: #335E9A; /* Slightly darker shade for hover effect */
  }
  </style>
  