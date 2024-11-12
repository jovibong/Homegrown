<template>
    <div>
        <section class="container mx-auto text-center">
            <div>
                <h2 class="text-primary fw-bold text-center mb-3 display-4">Community Forum</h2>
            </div>

            <div class="text-muted mb-4 h5 text-center">
                We are happy to have you here.
            </div>
        </section>

        <!-- Categories -->
        <section id="forumCategories" class="my-3">
            <div class="row d-flex justify-content-center">

                <div class="col-5 me-5">
                    <h2 class="text-primary fw-bold mb-3 display-5 mt-2"> Popular Categories</h2>
                    <div class="d-flex flex-column mb-3">
                        <button class="p-2 category shadow-sm bg-body-tertiary text-muted mb-4 h2" id="generalCAT"
                            @click="goToCategory('general')">
                            <i class="bi bi-chat-dots p-2"></i>
                            General</button>
                        <button class="p-2 category shadow-sm bg-body-tertiary text-muted mb-4 h2" id="learningCAT"
                            @click="goToCategory('learning')">
                            <i class="bi bi-book p-2"></i>
                            Learning</button>
                        <button class="p-2 category shadow-sm bg-body-tertiary text-muted mb-4 h2" id="eventCAT"
                            @click="goToCategory('events')">
                            <i class="bi bi-calendar3 p-2"></i>
                            Events</button>
                    </div>
                </div>

                <!-- Top Discussions -->
                <div class="col-5">
                    <h2 class="text-primary fw-bold mb-3 display-5 mt-2"> Top Discussions </h2>
                    <div class="d-flex flex-column mb-3">
                        <router-link :to="{ name: 'forumDetail', params: { id: 'KfKX2aYOxSBzJpsa7X1m' } }">
                            <button class="discussion shadow-sm bg-body-tertiary text-muted mb-4 h5">
                                Best Travel Destinations for 2025
                            </button>
                        </router-link>

                        <router-link :to="{ name: 'forumDetail', params: { id: 'WX0No5zz8p6JbWS9SNqu' } }">
                            <button class="discussion shadow-sm bg-body-tertiary text-muted mb-4 h5">
                                How to Improve Productivity at Work?
                            </button>
                        </router-link>

                        <router-link :to="{ name: 'forumDetail', params: { id: 'aXjcPZLpHYbY3esPZY3m' } }">
                            <button class="discussion shadow-sm bg-body-tertiary text-muted mb-4 h5">
                                Best Online Courses for Data Science
                            </button>
                        </router-link>
                    </div>
                </div>
            </div>
        </section>

        <!-- Forum  -->
        <section id="forum">
            <!-- Filter Buttons -->
            <div class="filter-buttons d-flex">
                <button 
                    :class="['filter-button all-filter', { 'active': selectedCategory === 'all' }]"
                    :style="{ backgroundColor: selectedCategory === 'all' ? categoryColor : 'transparent', color: selectedCategory === 'all' ? 'white' : '' }"
                    @click="selectedCategory = 'all'">
                    All
                </button>

                <button 
                    :class="['filter-button general-filter', { 'active': selectedCategory === 'general' }]"
                    :style="{ backgroundColor: selectedCategory === 'general' ? categoryColor : 'transparent', color: selectedCategory === 'general' ? 'white' : '' }"
                    @click="selectedCategory = 'general'">
                    <i class="bi bi-chat-dots"></i>
                    General
                </button>

                <button 
                    :class="['filter-button learning-filter', { 'active': selectedCategory === 'learning' }]"
                    :style="{ backgroundColor: selectedCategory === 'learning' ? categoryColor : 'transparent', color: selectedCategory === 'learning' ? 'white' : '' }"
                    @click="selectedCategory = 'learning'">
                    <i class="bi bi-book"></i>
                    Learning
                </button>

                <button 
                    :class="['filter-button events-filter', { 'active': selectedCategory === 'events' }]"
                    :style="{ backgroundColor: selectedCategory === 'events' ? categoryColor : 'transparent', color: selectedCategory === 'events' ? 'white' : '' }"
                    @click="selectedCategory = 'events'">
                    <i class="bi bi-calendar3"></i>
                    Events
                </button>

                <button type="button" class="createButton ms-auto m-2" data-bs-toggle="modal"
                    data-bs-target="#createForum">
                    POST
                </button>

                <!-- Modal -->
                <div class="modal fade" id="createForum" tabindex="-1" aria-labelledby="createForumLabel"
                    aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content">

                            <div class="modal-body">
                                <form @submit.prevent="addForum">

                                    <div class="row mb-3">
                                        <label for="title" class="col-sm-3 col-form-label"> Title : </label>
                                        <div class="col-sm-8">
                                            <input id="title" v-model="forumTitle" type="text" class="form-control" />
                                        </div>
                                    </div>

                                    <!-- Description -->
                                    <div class="row mb-3">
                                        <label for="description" class="col-sm-3 col-form-label">Description: </label>
                                        <div class="col-sm-8">
                                            <textarea rows="4" cols="50" id="description" v-model="forumDesc"
                                                class="form-control"></textarea>
                                        </div>
                                    </div>

                                    <!-- Forum Category -->
                                    <div class="row mb-3">
                                        <label for="forumCategory" class="col-sm-3 col-form-label">
                                            Category</label>
                                        <div class="col-sm-8">
                                            <select id="forumCategory" v-model="forumCategory" class="form-select">
                                                <option disabled value="">Select a category</option>
                                                <option value="general">General</option>
                                                <option value="learning">learning</option>
                                                <option value="events">events</option>
                                            </select>
                                        </div>
                                    </div>

                                </form>

                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button type="submit" class="btn btn-primary" @click="addForum" >Post</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Dynamic forum page-->
            <loading-animation v-if="forum_loading"></loading-animation>
            <div v-if="!forum_loading" class="m-3 forum-container">

                <div v-if="selectedForums.length === 0">
                    No forums yet. Post your own!
                </div>

                <div v-else>
                    <div v-for="forum in selectedForums" :key="forum.id" class="indivForum m-3" :style="getForumStyles(forum.category)">

                        <div class="left-section">
                            <img :src="forum.postedBy.profilePic" class="profile-pic" id="forum-pfp" />
                        </div>


                        <div class="right-section">
                            <div class="forum-text">
                                <h2 class="title">{{ forum.title }}</h2>
                                <p class="desc">{{ croppedDesc(forum.description) }}</p>
                            </div>

                            <div class="d-flex justify-content-between align-items-center">
                                <router-link :to="{ name: 'forumDetail', params: { id: forum.id } }">
                                    <i class="bi bi-arrow-right-circle directButton"></i>
                                </router-link>
                            </div>
                        </div>
                    </div>

                </div>


            </div>
        </section>
    </div>

</template>

<script>
import { collection, getDocs, addDoc, query, where, getDoc, doc } from "firebase/firestore";
import { db } from '../firebase/initialize';
import loadingAnimation from "../components/loadingAnimation.vue";


export default{
    components : {
        loadingAnimation
    },

    mounted(){
        this.getAllForums()
    },

    data (){
        return {
            selectedCategory: "all",
            selectedForums: [],
            forum_loading: true,

            forumTitle: '',
            forumDesc:'',
            forumCategory:'',
        }
    },

    methods: {
        goToCategory(category) {
            this.selectedCategory = category;
            const forumSection = document.getElementById('forum');
            if (forumSection) {
                forumSection.scrollIntoView({ behavior: 'smooth' });
            }
        },

        getForumStyles(category) {
            let bgColor = '';
            let borderColor = '';

            // Determine background color and border color based on category
            switch (category) {
                case 'general':
                    bgColor = '#0061b5';  
                    borderColor = '#0061b5';
                    break;
                case 'learning':
                    bgColor = '#853a76'; 
                    borderColor = '#853a76';  
                    break;
                case 'events':
                    bgColor = '#009792'; 
                    borderColor = '#009792';  
                    break;
                default:
                    bgColor = '#CE2029';  // Default to red
                    borderColor = '#CE2029';  // Default border color
            }

            // Return the background and border style for the indivForum
            return {
                background: `linear-gradient(to right, ${bgColor} 30%, white 10%)`,
                border: `2px solid ${borderColor}`  // Apply dynamic border color
            };
        },

        async getAllForums() {
            try {
                const querySnapshot = await getDocs(collection(db, "forums"));

                for (const doc of querySnapshot.docs) {

                    const userInfo = await this.fetchUserProfile(doc.data().postedBy); // Fetch the user profile async
                    console.log("initial data", doc.id, " => ", doc.data());

                    // Add the forum data along with the user profile to the selectedForums array
                    this.selectedForums.push({
                        id: doc.id,
                        title: doc.data().title,
                        description: doc.data().description,
                        category: doc.data().category,
                        postedBy: {
                            uid: doc.data().postedBy, // Store the user ID
                            username: userInfo.username,  // Store the fetched username
                            profilePic: userInfo.profilePic  // Store the fetched profile picture
                        }
                    });
                    console.log("All Forums", this.selectedForums)
                }
            } catch (error) {
                console.log("Error getting all forums", error)
            } finally {
                this.forum_loading = false;
            }
        },

        async getSelectedForums() {
            try {
                this.selectedForums = []; // Clear the selected forums array

                if (this.selectedCategory == "all") {
                    return this.getAllForums(); // If 'all' category is selected, return all forums
                }

                // Query for forums in the selected category
                const q = query(collection(db, "forums"), where("category", "==", this.selectedCategory));

                const querySnapshot = await getDocs(q);

                for (const doc of querySnapshot.docs) {
                    const userInfo = await this.fetchUserProfile(doc.data().postedBy); // Fetch user profile async
                    console.log(doc.id, " => ", doc.data());

                    // Add the forum data along with the user profile to the selectedForums array
                    this.selectedForums.push({
                        id: doc.id,
                        title: doc.data().title,
                        description: doc.data().description,
                        category: doc.data().category,
                        postedBy: {
                            uid: doc.data().postedBy, // Store the user ID
                            username: userInfo.username,  // Store the fetched username
                            profilePic: userInfo.profilePic  // Store the fetched profile picture
                        }
                    });
                    console.log("Show selected forums", this.selectedForums);
                }
            } catch (error) {
                console.log("Error fetching selected forums", error)
            } finally {
                this.forum_loading = false;
            }
        },


        async fetchUserProfile(userID) {
            console.log(userID)
            try {
                const userDoc = await getDoc(doc(db, "profiles", userID)); // Fetch the user document
                if (userDoc.exists()) {
                    const data = userDoc.data();

                    // Return the user profile information as an object
                    return {
                        name: data.name || "", // Provide a default empty string if name is missing
                        username: data.username || "", // Default to empty string if username is missing
                        profilePic: data.profileImageUrl || require('@/img/blankprofile.png'), // Default to a placeholder if no image
                    };
                } else {
                    console.log("User not found");
                    return null; // Return null if the document doesn't exist
                }
            } catch (error) {
                console.error("Error fetching user profile:", error);
                return null; // Return null in case of an error
            }
        },

        async addForum() {
            const sessionUser = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user'));

            const newForumData = {
                title: this.forumTitle,
                description: this.forumDesc,
                category: this.forumCategory,
                postedBy: sessionUser.uid
            };

            try {
                const docRef = await addDoc(collection(db, "forums"), newForumData);
                console.log("Document written with ID: ", docRef.id);
                this.forumID = docRef.id;
                window.location.reload();

            } catch (error) {
                console.error("Error Posting: ", error); // Handle errors
            }
        },

        croppedDesc(desc) {
            const maxLength = 250; // Max length for the description
            return desc.length > maxLength
                ? desc.slice(0, maxLength) + '...'  // Crop and append ellipsis
                : desc;  // Return original description if it's short enough
        }
    },

    watch: {
        // Watch for changes to selectedCategory and filter forums accordingly
        selectedCategory() {
            this.forum_loading = true;
            this.getSelectedForums();
        }
    },

    computed: {
        // Dynamically returns the color for each category
        categoryColor() {
            const colors = {
                all: '#CE2029', // Red
                general: '#0061b5', // Blue
                learning: '#853a76', // Purple
                events: '#009792', // Teal
            };
            return colors[this.selectedCategory] || '#0061b5'; // Default to blue if category not found
        }
    }  
}
</script>




<style scoped>
@import '../css/events.css';
#forum {
    height: 100%;
}

.createButton {
  cursor: pointer;
  width: fit-content;
  padding: 10px 20px;
  font-family: 'Poppins';
  border-radius: 5px;
  border: none;
  background-color: #525FE1;
}

.directButton {
    font-size: 30px;
}

.filter-button {
    border-radius: 55px;
    width: 130px;
    margin: 2px;
}

.all-filter{
    border: 2px solid #CE2029;
}

.general-filter {
    border: 2px solid #0061b5;

}

.learning-filter {
    border: 2px solid #853a76;

}
.events-filter {
    border: 2px solid #009792;

}

.forum-container {
    height: 100%;
}

.forum-text .title {
  font-size: 1.2rem;
  font-weight: bold;
}

.forum-text .desc {
  font-size: 1rem;
  color: #555;
}


.indivForum {
    display: flex;
    align-items: center; /* Vertically align content */
    background: linear-gradient(to right, #CE2029 30%, white 10%);
    border-radius: 8px;
    width: 100%;  /* Ensure it takes up full width */
}

.left-section {
    width: 30%;  /* 30% of the width */
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;  /* Center profile image */
    padding: 10px;
}

.profile-pic {
    width: 100px;
    height: 100px;
    object-fit: cover;
    border: 3px solid #fff;
    border-radius: 5px;
}

.right-section {
    width: 70%;  /* 70% of the width */
    padding: 10px;
    padding-left: 20px;  /* Space between sections */
}

.directButton {
    font-size: 1.5rem;
    cursor: pointer;
    color: #007bff;
}

.directButton:hover {
    color: #0056b3;
}

.filter-button {
    color: #333; /* Default text color */
    transition: all 0.3s ease;
}

.filter-button.active {
    color: white; /* Text color when active */
}


</style>
