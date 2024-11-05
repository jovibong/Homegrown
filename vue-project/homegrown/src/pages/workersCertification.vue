<template>
    <div class="certifications-page">
      <h1 class="title">Certifications</h1>
      
      <!-- Tab navigation -->
      <div class="tabs">
        <span :class="{ active: activeTab === 'newest' }" @click="setActiveTab('newest')">Newest</span>
        <span :class="{ active: activeTab === 'completed' }" @click="setActiveTab('completed')">Completed</span>
        <span :class="{ active: activeTab === 'ongoing' }" @click="setActiveTab('ongoing')">Ongoing</span>
      </div>
  
      <!-- View All Link -->
      <div class="view-all">
        <a href="#">View All <i class="bi bi-arrow-right"></i></a>
      </div>
  
      <!-- Certifications Grid -->
      <div class="certifications-grid">
        <div 
          v-for="cert in filteredCertifications" 
          :key="cert.id" 
          class="cert-card">
          
          <div class="cert-icon">
            <i class="bi bi-award-fill"></i>
            <img v-if="cert.status === 'completed'" src="path/to/medal-icon.png" class="medal-icon" />
          </div>
          
          <h3>{{ cert.title }}</h3>
          <p>Grade Achieved: {{ cert.grade }}%</p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        activeTab: 'completed', // Default tab
        certifications: [
          { id: 1, title: 'Introduction to Python', grade: 100, status: 'completed' },
          { id: 2, title: 'Color Design', grade: 78, status: 'completed' },
          { id: 3, title: 'Language - Mandarin', grade: 80, status: 'completed' },
          { id: 4, title: 'Language - English', grade: 80, status: 'completed' },
          { id: 5, title: 'Basic Excel', grade: 80, status: 'completed' },
          { id: 6, title: 'Basic', grade: 80, status: 'completed' },
          // Add more certifications as needed
        ]
      };
    },
    computed: {
      filteredCertifications() {
        return this.certifications.filter(cert => cert.status === this.activeTab);
      }
    },
    methods: {
      setActiveTab(tab) {
        this.activeTab = tab;
      }
    }
  };
  </script>
  
  <style scoped>
  .certifications-page {
    padding: 20px;
    text-align: center;
    background-color: #f9f9f9;
  }
  
  .title {
    font-size: 2rem;
    color: #3B71CA;
    font-weight: bold;
  }
  
  .tabs {
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }
  
  .tabs span {
    margin: 0 15px;
    cursor: pointer;
    font-size: 1rem;
    color: #333;
  }
  
  .tabs .active {
    font-weight: bold;
    color: #3B71CA;
    border-bottom: 3px solid #3B71CA;
    padding-bottom: 5px;
  }
  
  .view-all {
    text-align: right;
    margin-top: 10px;
    font-size: 1rem;
  }
  
  .view-all a {
    color: #3B71CA;
    text-decoration: none;
  }
  
  .certifications-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 20px;
    margin-top: 20px;
  }
  
  .cert-card {
    background-color: #fff;
    border-radius: 8px;
    padding: 15px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
    text-align: center;
    transition: transform 0.3s;
  }
  
  .cert-card:hover {
    transform: translateY(-5px);
  }
  
  .cert-icon {
    font-size: 2rem;
    color: #6C63FF;
    position: relative;
  }
  
  .medal-icon {
    position: absolute;
    top: -10px;
    right: -10px;
    width: 20px;
    height: 20px;
  }
  
  .cert-card h3 {
    font-size: 1.1rem;
    margin: 10px 0 5px;
    color: #333;
    font-weight: bold;
  }
  
  .cert-card p {
    font-size: 0.9rem;
    color: #666;
  }
  </style>
  