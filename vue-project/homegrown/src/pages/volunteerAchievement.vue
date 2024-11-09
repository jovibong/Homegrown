<template>
    <div class="page-wrapper">
      <!-- Certification Content -->
      <div class="certifications-page">
        <h2 class="title text-primary fw-bold text-center mb-3 display-4">Your Achievements</h2>
  
        <div v-if="completedCertifications.length" class="certifications-grid">
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
                Hours Obtained: {{ cert.hours }}%
              </p>
              <div class="badge completed">
                <i class="bi bi-award"></i> <!-- Award icon for "Completed" -->
                Completed
              </div>
            </div>
          </div>
        </div>
  
        <div v-else class="no-certifications">
          <p>You haven’t obtained any achievements yet. Start volunteering now!</p>
        </div>
      </div>
  </div>
    </template>
    
  <script>
  export default {
    data() {
      return {
        achievements: [
          { id: 1, title: 'Introduction to Python', hours: 25, status: 'completed', imageUrl: 'path/to/python.jpg' },
          { id: 2, title: 'Advanced CSS Design', hours: 30, status: 'completed', imageUrl: 'path/to/css.jpg' },
          { id: 3, title: 'JavaScript Essentials', hours: 45, status: 'completed', imageUrl: 'path/to/js.jpg' },
        ]
      };
    },
    computed: {
      completedCertifications() {
        return this.achievements.filter(cert => cert.status === 'completed');
      }
    }
  };
  </script>
  
  <style scoped>
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
    height: 350px; /* Slightly greater height */
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
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
  
  .cert-title {
    font-size: 1.5rem;
    font-weight: bold;
    color: #333333;
    margin: 10px 0;
  }
  
  .cert-grade {
    font-size: 1.2rem;
    color: #666666;
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
    font-size: 1rem;
    margin-top: 12px;
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
  </style>
  