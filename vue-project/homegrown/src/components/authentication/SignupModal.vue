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
          <!-- Custom Red X Button (Top Right) -->
          <button
            type="button"
            class="custom-close"
            @click="closeModal"
          >
            &times;
          </button>
  
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
            <div>
              <span class="fw-bold" id="home">Home</span><span class="text-warning fw-bold">Grown</span><br /><br />
            </div>
              <h2 class="mb-4 text-center">Create Your Account</h2>
              <form @submit.prevent="handleSignup">
                <div class="form-group mb-3">
                  <label for="name" class="bold-label">Name</label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="name"
                    placeholder="Enter your name"
                    required
                  />
                </div>
                <div class="form-group mb-3">
                  <label for="name" class="bold-label">Username</label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="username"
                    placeholder="Enter your username"
                    required
                  />
                </div>
                <div class="form-group mb-3">
                  <label for="email" class="bold-label">Email</label>
                  <input
                    type="email"
                    class="form-control"
                    v-model="email"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div class="form-group mb-3">
                  <label for="password" class="bold-label">Password</label>
                  <input
                    type="password"
                    class="form-control"
                    v-model="password"
                    placeholder="Create a password"
                    required
                  />
                </div>
                <div class="form-group mb-3">
                  <label for="confirmPassword" class="bold-label">Confirm Password</label>
                  <input
                    type="password"
                    class="form-control"
                    v-model="confirmPassword"
                    placeholder="Confirm your password"
                    required
                  />
                </div>

                <!-- User Type Toggle Group -->
                <div class="form-group mb-3 d-flex align-items-center">
                  <label class="bold-label me-3 mb-0">Sign Up as:</label>
                  <div class="btn-group" role="group">
                    <button
                      type="button"
                      :class="{'btn': true, 'btn-outline-primary': userType !== 'worker', 'btn-primary': userType === 'worker'}"
                      @click="userType = 'worker'"
                    >
                      Worker
                    </button>
                    <button
                      type="button"
                      :class="{'btn': true, 'btn-outline-primary': userType !== 'volunteer', 'btn-primary': userType === 'volunteer'}"
                      @click="userType = 'volunteer'"
                    >
                      Volunteer
                    </button>
                  </div>
                </div>


  
                <button type="submit" class="btn btn-primary btn-block w-100" @click="signUp">Sign Up</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
import Modal from 'bootstrap/js/dist/modal';
import { createUserWithEmailAndPassword , updateProfile} from 'firebase/auth';
import { auth, db } from '@/firebase/initialize.js'; 
import { doc, setDoc } from 'firebase/firestore';

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
      imageUrl: require('@/img/solo_man.jpg'),
      modalInstance: null,
      email: '',
      password: '',
      name: '', // Add an input field for name in the template
      username: '', // Add an input field for username in the template
      userType: '', // Store user type (worker or volunteer)
      confirmPassword: ''
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
          this.resetForm(); // Reset form when modal is closed
        });
      }
      this.modalInstance.show();
    },
    hideModal() {
      if (this.modalInstance) {
        this.modalInstance.hide();
      }
      this.$emit("update:visible", false);
    },
    closeModal() {
      this.$emit("update:visible", false);
      this.resetForm(); // Reset form when modal is closed via close button
    },
    resetForm() {
      // Clear all input fields
      this.email = '';
      this.password = '';
      this.confirmPassword = '';
      this.username = '';
      this.userType = '';
    },
    async handleSignup() {
      if (this.password !== this.confirmPassword) {
        alert("Passwords do not match");
        return;
      }
      if (!this.userType) {
        alert("Please select either 'Worker' or 'Volunteer' to sign up.");
        return;
      }
      if (!this.name) {
        alert("Please enter your name to sign up.");
        return;
      }
      try {
        // Firebase sign-up
        const userCredential = await createUserWithEmailAndPassword(auth, this.email, this.password);
        const user = userCredential.user;
        // Update the user's display name in Firebase Auth
        await updateProfile(user, { displayName: this.username });

        localStorage.removeItem('user'); // Clear any previous user data

        // Store additional user information (username) in Firestore
        await setDoc(doc(db, 'profiles', user.uid), {
          username: this.username,
          email: this.email,
          userType: this.userType, // Save the selected user type
          name: this.name // Save the user's name
        });

        sessionStorage.setItem('user', JSON.stringify(user)); // Save user info in session storage
        localStorage.setItem('user', JSON.stringify(user)); // Save user info in local storage

        console.log("Signed up user:", user);
        this.$emit("signup", user); // Emit event with user info if needed


        // Redirect based on userType
        if (this.userType === 'worker') {
          this.$router.push({ name: 'homePage' });
        } else if (this.userType === 'volunteer') {
          this.$router.push({ name: 'volunteerHomePage' });
        } else {
          console.warn('Unknown userType:', this.userType);
          this.$router.push({ name: 'landingPage' }); // Default or error page if needed
        }

        // Hide signup modal
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
  .bold-label {
  font-weight: bold;
}
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
   /* Ensure no scrollbars show */
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

  .form-check-input {
  width: 18px;
  height: 18px;
  margin-right: 5px;
}

.form-check-label {
  font-size: 16px;
}

#home {
  color: #525FE1;
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
  z-index: 1051; /* Ensure it stays on top */
}

.custom-close:hover {
  color: darkred;
}
  </style>
  