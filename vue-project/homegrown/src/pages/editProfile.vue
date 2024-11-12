<template>
    <div class="profile-page-container">
        <!-- Sidebar Links -->
        <div class="sidebar">
            <a @click="showProfileSection('profile')" :class="{'active': currentSection === 'profile'}" class="sidebar-link">Profile</a>
            <a @click="showProfileSection('changePassword')" :class="{'active': currentSection === 'changePassword'}" class="sidebar-link">Change Password</a>
        </div>

        <!-- Content Section -->
        <div class="content-container">
            <div v-if="loading" class="spinner-container">
                Loading...
                <div class="spinner"></div>
            </div>

            <div v-else>
                <!-- Profile Section -->
                <div v-if="currentSection === 'profile'" class="profile-box container py-3 fade-in-top">
                    <div class="profile-header mb-4">
                        <h2 class="text-primary fw-bold text-center mb-3 display-4">Profile</h2>
                        <div class="text-center">
                            <img :src="profileImageSrc || require('@/img/blankprofile.png')" alt="Profile Image" class="profile-image" />
                            <a class="edit-picture-link d-block" @click="triggerFileInput">Change Picture</a>
                            <input type="file" ref="profileImageInput" class="d-none" accept="image/*" @change="previewImage">
                        </div>
                    </div>

                    <!-- success message -->
                     

                    <div class="profile-details">
                        <p><strong>Email: </strong> {{ email }}</p>

                        <!-- Editable Name -->
                        <p>
                            <strong>Name: </strong>
                            <span v-if="!isEditingName">
                                {{ formData.name || "Enter your name" }}
                                <span class="edit-icon" @click="isEditingName = true"><i class="fas fa-edit"></i></span>
                            </span>
                            <span v-else>
                                <input
                                    type="text"
                                    v-model="formData.name"
                                    placeholder=" Enter your name"
                                    class="form-control mb-2"
                                />
                                <button class="btn btn-warning" @click="updateField('name')">Change</button>
                            </span>
                        </p>

                        <!-- Editable Username -->
                        <p>
                            <strong>Username: </strong>
                            <span v-if="!isEditingUsername">
                                {{ formData.username || " Enter your username" }}
                                <span class="edit-icon" @click="isEditingUsername = true"><i class="fas fa-edit"></i></span>
                            </span>
                            <span v-else>
                                <input
                                    type="text"
                                    v-model="formData.username"
                                    placeholder=" Enter your username"
                                    class="form-control mb-2"
                                />
                                <button class="btn btn-warning" @click="updateField('username')">Change</button>
                            </span>
                        </p>
                    </div>
                </div>

                <!-- Change Password Section -->
                <div v-if="currentSection === 'changePassword'" class="profile-box container py-3 fade-in-top">
                    <h2 class="text-primary fw-bold text-center mb-3 display-4">Change Password</h2>
                    
                    <!-- Error Message Display for Change Password Section -->
                    <p v-if="errorMessage" class="error-text">{{ errorMessage }}</p>

                    <form @submit.prevent="submitPasswordChange">
                        <div class="mb-3">
                            <label for="password" class="form-label">New Password</label>
                            <input type="password" class="form-control" v-model="formData.password" placeholder="Enter new password">
                        </div>
                        <div class="mb-3">
                            <label for="confirmPassword" class="form-label">Confirm New Password</label>
                            <input type="password" class="form-control" v-model="formData.confirmPassword" placeholder="Confirm new password">
                        </div>
                        <button type="submit" class="btn btn-warning">Update Password</button>
                    </form>
                </div>
                <div v-if="showReauthModal" class="modal-overlay">
                            <div class="reauth-modal">
                            <h2 class="text-primary fw-bold">Re-authentication Required</h2>
                            <p>Please enter your current password to proceed.</p>
                            <input type="password" placeholder="Enter current password" class="reauth-input" />
                            <div class="button-container">
                            <button class="btn btn-submit">Submit</button>
                            <button class="btn btn-cancel">Cancel</button>
                            </div>
                        </div>
                    </div>
            </div>
        </div>
    </div>
</template>

<script>
import { auth, db, storage } from '@/firebase/initialize.js';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { onAuthStateChanged,reauthenticateWithCredential, EmailAuthProvider, updatePassword, } from 'firebase/auth';
import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

export default {
    data() {
        return {
            profileImageSrc: null,
            formData: {
                name: "",
                username: "",
                password: "",
                confirmPassword: "",
            },
            email: "",
            userId: null,
            currentSection: 'profile', // Tracks the current section being viewed
            loading: true,
            isEditingName: false,
            isEditingUsername: false,
            showReauthModal: false, 
            currentPassword: "",
            errorMessage: "" // New property for error messages
        };
    },
    created() {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                this.userId = user.uid;
                this.email = user.email;
                await this.fetchUserProfile();
            }
            this.loading = false;
        });
    },
    methods: {
        showProfileSection(section) {
            this.currentSection = section;
        },
        async fetchUserProfile() {
            try {
                const userDoc = await getDoc(doc(db, "profiles", this.userId));
                if (userDoc.exists()) {
                    const data = userDoc.data();
                    this.formData.name = data.name || "";
                    this.formData.username = data.username || "";
                    this.profileImageSrc = data.profileImageUrl || require('@/img/blankprofile.png');
                }
            } catch (error) {
                console.error("Error fetching user profile:", error);
            }
        },
        triggerFileInput() {
            this.$refs.profileImageInput.click();
        },
        async uploadFile(file, userId) {
            try {
                // Create a reference to the file's storage path (e.g., `profileImages/userId.jpg`)
                const fileRef = storageRef(storage, `profileImages/${userId}.jpg`);
                
                // Upload the file to Cloud Storage
                await uploadBytes(fileRef, file);

                // Get the download URL for the uploaded file
                const downloadURL = await getDownloadURL(fileRef);
                
                console.log('File uploaded successfully:', downloadURL);
                
                // Return the download URL
                return downloadURL;
            } catch (error) {
                console.error('Error uploading file:', error);
                throw error; // Re-throw the error to handle it in your application
            }
        },
        async previewImage(event) {
            const file = event.target.files[0];
            if (file) {
                try {
                    const imageRef = storageRef(storage, `profileImages/${this.userId}.jpg`);

                    // Delete existing image if needed
                    try {
                        await deleteObject(imageRef);
                        console.log("Previous image deleted successfully.");
                    } catch (error) {
                        console.warn("No existing image to delete or error deleting image:", error);
                    }

                    // Upload the new image
                    await uploadBytes(imageRef, file);
                    const imageUrl = await getDownloadURL(imageRef);

                    // Update Firestore document with new image URL
                    await setDoc(doc(db, "profiles", this.userId), { profileImageUrl: imageUrl }, { merge: true });

                    // Emit an event to notify NavMenu about the new image URL
                    this.$emit('profileImageUpdated', imageUrl);

                    alert("Profile image updated successfully!");
                    window.location.reload();
                } catch (error) {
                    console.error("Error uploading image:", error);
                    this.errorMessage = "There was an error uploading your profile image.";
                }
            }
},

        async updateField(field) {
            try {
                await setDoc(doc(db, "profiles", this.userId), {
                    [field]: this.formData[field]
                }, { merge: true });
                
                // Close the editing mode for the respective field
                if (field === 'name') this.isEditingName = false;
                if (field === 'username') {
                    this.isEditingUsername = false;
                    // Emit an event to notify the parent component to update the username
                    this.$emit('usernameUpdated', this.formData[field]);
                }

                alert(`${field} updated successfully!`);
                window.location.reload();
            } catch (error) {
                console.error(`Error updating ${field}:`, error);
               this.errorMessage = "Passwords do not match.";
            }
        },
        async submitPasswordChange() {
        if (this.formData.password !== this.formData.confirmPassword) {
            this.errorMessage = "Passwords do not match."
            return;
        }
        try {
            const user = auth.currentUser;
            await updatePassword(user, this.formData.password);
            alert("Password updated successfully!");
            this.formData.password = "";
            this.formData.confirmPassword = "";
            this.currentSection = 'profile'; // Go back to profile after password change
        } catch (error) {
            if (error.code === 'auth/requires-recent-login') {
                // Show the re-authentication modal
                this.showReauthModal = true;
            } else {
                console.error("Error updating password:", error);
                this.errorMessage = "There was an error updating your password.";
            }
        }
    },
    async handleReauth() {
        try {
            const user = auth.currentUser;
            const credential = EmailAuthProvider.credential(user.email, this.currentPassword);
            await reauthenticateWithCredential(user, credential);
            alert("Re-authentication successful. You can now change your password.");
            this.showReauthModal = false; // Hide the modal after successful re-authentication
        } catch (error) {
            console.error("Re-authentication failed:", error);
            this.errorMessage = "Re-authentication failed: "
        }
    },
    closeReauthModal() {
        this.showReauthModal = false;
    }
    }
};
</script>

<style scoped>
.profile-page-container {
    display: flex;
    min-height: 100vh;
    width: 100%;
}
.sidebar {
    background-color: #f8f9fa;
    padding: 20px;
    height: 100vh;
    width: 250px;
    position: sticky;
    top: 0;
}
.sidebar-link {
    display: block;
    padding: 10px;
    font-weight: bold;
    color: #333;
    text-decoration: none;
    cursor: pointer;
}
.sidebar-link.active, .sidebar-link:hover {
    color: #3B71CA;
}
.content-container {
    flex: 1;
    padding: 20px;
    display: flex;
    justify-content: center;
    align-items: flex-start;
}
.profile-box {
    background-color: #fff;
    border-radius: 8px;
    padding: 30px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 800px;
}
.profile-image {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    margin-bottom: 10px;
}
.edit-picture-link {
    color: #3B71CA;
    cursor: pointer;
    text-decoration: underline;
}
.edit-icon {
    margin-left: 8px;
    color: #3B71CA;
    cursor: pointer;
}
.spinner-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}
.spinner {
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

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  text-align: center;
}

.reauth-modal {
  background-color: #fefefe; /* Match profile container color */
  border-radius: 8px;
  padding: 20px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.reauth-modal h2 {
  color: #525FE1; /* Profile heading color */
  font-weight: bold;
  margin-bottom: 10px;
}

.reauth-modal p {
  color: #333; /* Profile text color */
  margin-bottom: 15px;
}

.reauth-input {
  width: 100%;
  padding: 8px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
}

.button-container {
  display: flex;
  justify-content: space-between;
}

.btn {
  background-color: #FFC107; /* Button color */
  color: #000; /* Button text color */
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn:hover {
  background-color: #e0a106; /* Hover color */
}

.btn-submit {
  background-color: #FFC107; /* Match with the warning theme */
  ; /* Primary color */
}

.btn-submit:hover {
  background-color:#e0a106; /* Slightly darker shade for hover */
}

.btn-cancel {
  background-color: #FFC107; /* Match with the warning theme */
}

.btn-cancel:hover {
  background-color: #e0a106;
}

.error-text {
  color: red;
  font-weight: bold;
  margin-bottom: 10px;
}
</style>
  