<template>
  <div class="page-wrapper">

    <!-- Loading Spinner -->
    <div v-if="loading" class="loading-spinner">
      <i class="bi  spinner-icon"></i>
    </div>
    <!-- Certification Content -->
    <div class="certifications-page">
      <h2 class="title text-primary fw-bold text-center mb-3 display-4">Your Achievements</h2>

      <div v-if="isBalaAhmad && completedCertifications.length" class="certifications-grid">
        <div
          v-for="(cert, index) in completedCertifications"
          :key="cert.id"
          class="cert-card"
        >
          <!-- Achievement Image and Rank -->
          <div class="cert-image-container">
            <img :src="cert.imageUrl" alt="Certification Image" class="cert-image" />
            <div class="rank-number">
              <i class="bi bi-trophy-fill"></i> <!-- Trophy icon for rank -->
              <span>{{ index + 1 }}</span>
            </div>
          </div>

          <!-- Certification Content -->
          <div class="cert-content">
            <h3 class="cert-title">{{ cert.title }}</h3>
            <p class="cert-grade">
              <i class="bi bi-star-fill"></i> <!-- Star icon for score -->
              Hours Obtained: {{ cert.score }}%
            </p>
            <div class="badge completed">
              <i class="bi bi-award"></i> <!-- Award icon for "Completed" -->
              Completed
            </div>
          </div>
        </div>
      </div>

      <!-- Message for users who are not Bala Ahmad -->
      <div v-else class="no-certifications">
        <p>You haven’t obtained any achievements yet. Start upskilling now!</p>
      </div>
    </div>
  </div>
</template>

<script>
import { auth, db } from '@/firebase/initialize.js'; // Ensure correct Firebase imports
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

export default {
  data() {
    return {
      achievements: [
        { id: 1, title: 'Introduction to Python', score: 80, status: 'completed', imageUrl: require('../img/python.jpg') },
        { id: 2, title: 'Basic Excel', score: 100, status: 'completed', imageUrl: require('../img/excel.jpg') },
      ],
      user: null, // To store user data from Firebase
      isBalaAhmad: false, // Flag to check if the user is "Bala Ahmad"
      loading: true, // Flag to show loading spinner
    };
  },
  computed: {
    completedCertifications() {
      return this.achievements.filter(cert => cert.status === 'completed');
    }
  },
  async created() {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        this.user = user;

        //loading spinner
        this.loading = true;
        // Fetch user profile from Firestore
        const userDoc = await getDoc(doc(db, 'profiles', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();

          // Check if the username is "Bala Ahmad"
          this.isBalaAhmad = userData.name === 'Bala Ahmad';
          this.loading = false;
        }
      } else {
        this.isBalaAhmad = false; // If user is not logged in, do not show achievements
        this.loading = false; // Hide spinner if user not logged in
      }
    });
  }
};
</script>

<style scoped>
/* Existing CSS styles remain the same */
/* Full-page layout */
.page-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* Main content fills available space */
.certifications-page {
  flex: 1;
  padding: 20px;
  background-color: #f4f4f9;
  text-align: center;
}

.title {
  color: #3B71CA;
  margin-bottom: 20px;
}

/* Certifications grid */
.certifications-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 3 columns on desktop */
  gap: 20px;
  padding: 20px;
}

/* Certification card */
.cert-card {
  position: relative;
  background-color: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  height: 350px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start; /* Align content to start */
  padding: 20px;
}


.cert-card:hover {
  transform: translateY(-5px);
  box-shadow: 0px 6px 16px rgba(0, 0, 0, 0.2);
}

/* Rank number */
.rank-number {
  position: absolute;
  top: 10px;
  left: 10px;
  display: flex;
  align-items: center;
  font-size: 1.5rem;
  font-weight: bold;
  color: #FFD700; /* Gold color for trophy */
}

.rank-number i {
  margin-right: 5px;
  font-size: 1.5rem;
}

/* Image container */
.cert-image-container {
  position: relative;
  width: 100%;
  height: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.cert-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}

/* Content styling */
.cert-content {
  text-align: center;
  padding: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

/* Restrict text overflow in title */
.cert-title {
  font-size: 1.2rem;
  font-weight: bold;
  color: #333333;
  margin: 10px 0;
  white-space: normal; /* Allow wrapping */
  text-align: center;
}

/* Certification grade text with ellipsis for overflow */
.cert-grade {
  font-size: 1rem;
  color: #666666;
  text-align: center;
  white-space: normal; /* Allow wrapping */
  line-height: 1.2; /* Set line height for readability */
}

.cert-content {
  text-align: center;
  padding: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px; /* Add gap for spacing between elements */
  width: 100%;
}

.cert-content > * {
  margin: 5px 0;
}

.cert-grade i {
  color: #FFD700; /* Gold color for the star */
  margin-right: 5px;
}

.badge.completed {
  display: inline-block;
  background-color: #3B71CA;
  color: #ffffff;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 0.9rem;
  margin-top: 8px;
}

.badge.completed i {
  margin-right: 5px;
}

/* Responsive layout */
@media (max-width: 992px) {
  .certifications-grid {
    grid-template-columns: repeat(2, 1fr); /* 2 columns on tablets */
  }
}

@media (max-width: 576px) {
  .certifications-grid {
    grid-template-columns: 1fr; /* 1 column on mobile */
  }
}

.no-certifications {
  font-size: 1.2rem;
  color: #666666;
  margin-top: 50px;
}

/* Footer styling */
.footer {
  background-color: #3B71CA;
  color: #ffffff;
  text-align: center;
  padding: 10px 0;
  font-size: 1rem;
}

.loading-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.spinner-icon {
  border: 8px solid #f3f3f3;
  border-top: 8px solid #3B71CA;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
