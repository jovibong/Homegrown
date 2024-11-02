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

            <!-- start of sign up/in buttons -->
            <div class="col-lg-2 col-3 d-flex justify-content-end align-items-start">
                <nav class="navbar d-flex flex-nowrap">
                    <!-- if want the sign in to remain as a navlink use class below -->
                    <!-- nav-link fw-bold text-light me-3 btn glow-on-hover -->
                    <a class="btn btn-warning fw-bold glow-on-hover mx-1 text-nowrap" @click="openLoginModal">Sign In</a>
                    <a class="btn btn-warning fw-bold glow-on-hover mx-1 text-nowrap" @click="openSignUpModal">Sign Up</a>
                </nav>
            </div>
            <!-- end of sign up/in buttons -->

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
      isSignUpModalVisible: false
    };
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
    }
  }
}
</script>

