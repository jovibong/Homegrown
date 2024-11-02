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
                <label for="email">Email or Phone Number</label>
                <input type="text" class="form-control" v-model="email" placeholder="Enter email or phone number" />
              </div>
              <div class="form-group mb-3">
                <label for="password">Password</label>
                <input type="password" class="form-control" v-model="password" placeholder="Enter password" />
              </div>
              <div class="form-check mb-3">
                <input type="checkbox" class="form-check-input" v-model="rememberMe" />
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

export default {
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
        this.modalInstance = new Modal(this.$refs.loginModal);
        this.$refs.loginModal.addEventListener("hidden.bs.modal", () => {
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
    handleLogin() {
      if (this.email && this.password) {
        console.log("Logging in with:", this.email, this.password);
        this.$emit("login");
        this.hideModal();
      } else {
        alert("Please enter valid credentials");
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
  }
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
</style>

