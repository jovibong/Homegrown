<template>
    <div>
      <!-- Sidebar Links -->
      <div class="sidebar">
        <router-link to="/profile">Profile</router-link>
        <router-link to="/edit-profile" class="text-dark">Edit Profile</router-link>
      </div>
  
      <!-- Profile Form Section -->
      <div class="content-container">
        <div class="profile-header mb-4">
          <h2>Edit Profile</h2>
          <div class="text-center">
            <img :src="profileImageSrc || 'https://via.placeholder.com/100'" alt="Profile Image" class="profile-image" />
            <a class="edit-picture-link d-block" @click="triggerFileInput">Change Picture</a>
            <input type="file" ref="profileImageInput" class="d-none" accept="image/*" @change="previewImage">
          </div>
        </div>
        
        <form @submit.prevent="submitForm">
          <div class="row">
            <div class="col-md-6 mb-3">
              <label for="firstName" class="form-label">First Name</label>
              <input type="text" class="form-control" v-model="formData.firstName" required>
            </div>
  
            <div class="col-md-6 mb-3">
              <label for="lastName" class="form-label">Last Name</label>
              <input type="text" class="form-control" v-model="formData.lastName" required>
            </div>
  
            <div class="col-md-12 mb-3">
              <label for="username" class="form-label">Username</label>
              <input type="text" class="form-control" v-model="formData.username" required>
            </div>
  
            <div class="col-md-6 mb-3">
              <label for="password" class="form-label">Change Password</label>
              <input type="password" class="form-control" v-model="formData.password">
            </div>
  
            <div class="col-md-6 mb-3">
              <label for="confirmPassword" class="form-label">Confirm Password</label>
              <input type="password" class="form-control" v-model="formData.confirmPassword">
            </div>
          </div>
  
          <div class="text-end">
            <button type="submit" class="btn btn-warning">Save</button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script>

  import { auth, db, storage } from '@/firebase/initialize.js';
  import { doc, getDoc, setDoc } from 'firebase/firestore';
  import { uploadBytes, getDownloadURL, ref as storageRef } from 'firebase/storage';
  
  export default {
    data() {
      return {
        profileImageSrc: null,
        formData: {
          firstName: "",
          lastName: "",
          username: "",
          password: "",
          confirmPassword: ""
        },
        userId: null
      };
    },
    async created() {
      const user = auth.currentUser;
      if (user) {
        this.userId = user.uid;
        await this.fetchUserProfile();
      }
    },
    methods: {
      async fetchUserProfile() {
        try {
          const userDoc = await getDoc(doc(db, "profiles", this.userId));
          if (userDoc.exists()) {
            const data = userDoc.data();
            this.formData = {
              firstName: data.firstName || "",
              lastName: data.lastName || "",
              username: data.username || "",
              password: "",
              confirmPassword: ""
            };
            this.profileImageSrc = data.profileImageUrl || "https://via.placeholder.com/100";
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      },
      triggerFileInput() {
        this.$refs.profileImageInput.click();
      },
      previewImage(event) {
        const file = event.target.files[0];
        if (file) {
          this.profileImageSrc = URL.createObjectURL(file);
        }
      },
      async submitForm() {
        if (this.formData.password && this.formData.password !== this.formData.confirmPassword) {
          alert("Passwords do not match.");
          return;
        }
  
        try {
          // Update profile information in Firestore
          await setDoc(doc(db, "profiles", this.userId), {
            firstName: this.formData.firstName,
            lastName: this.formData.lastName,
            username: this.formData.username,
          });
  
          // Update profile image if a new one is selected
          if (this.$refs.profileImageInput.files[0]) {
            const file = this.$refs.profileImageInput.files[0];
            const imageRef = storageRef(storage, `profileImages/${this.userId}`);
            await uploadBytes(imageRef, file);
            const imageUrl = await getDownloadURL(imageRef);
            this.profileImageSrc = imageUrl;
  
            // Update image URL in Firestore
            await setDoc(doc(db, "users", this.userId), { profileImageUrl: imageUrl }, { merge: true });
          }
  
          // Update password if provided
          if (this.formData.password) {
            await auth.currentUser.updatePassword(this.formData.password);
          }
  
          alert("Profile updated successfully!");
        } catch (error) {
          console.error("Error updating profile:", error);
          alert("There was an error updating your profile.");
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .sidebar {
    background-color: #f8f9fa;
    padding: 20px;
    height: 100vh;
    position: sticky;
    top: 0;
    width: 200px;
  }
  
  .content-container {
    margin-left: 220px;
    padding: 20px;
  }
  
  .profile-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  .profile-image {
    width: 100px;
    height: 100px;
    object-fit: cover;
    border-radius: 50%;
  }
  
  .edit-picture-link {
    font-size: 14px;
    color: #007bff;
    cursor: pointer;
    text-decoration: underline;
  }
  
  .btn-warning {
    background-color: #f0ad4e;
    border: none;
  }
  </style>
  