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
                        <button class="p-2 category shadow-sm bg-body-tertiary text-muted mb-4 h5">General</button>
                        <button class="p-2 category shadow-sm bg-body-tertiary text-muted mb-4 h5">Learning</button>
                        <button class="p-2 category shadow-sm bg-body-tertiary text-muted mb-4 h5">Events</button>
                    </div>
                </div>

                <div class="col-5">
                    <h2 class="text-primary fw-bold mb-3 display-5 mt-2"> Top Discussions </h2>
                    <div class="d-flex flex-column mb-3">
                        <button class="p-2 discussion shadow-sm bg-body-tertiary text-muted mb-4 h5">Flex item 1</button>
                        <button class="p-2 discussion shadow-sm bg-body-tertiary text-muted mb-4 h5">Flex item 2</button>
                        <button class="p-2 discussion shadow-sm bg-body-tertiary text-muted mb-4 h5">Flex item 3</button>
                    </div>
                </div>
            </div>
        </section>

        <!-- Forum  -->
        <section id="forum">
            <!-- Filter Buttons -->
            <div class="filter-buttons d-flex">
                <button :class="['filter-button', { 'active': selectedCategory === 'all' }]" @click="selectedCategory = 'all'">
                    All
                </button>

                <button :class="['filter-button', { 'active': selectedCategory === 'general' }]" @click="selectedCategory = 'general'">
                    <i class="bi bi-chat-dots"></i>
                    General
                </button>

                <button :class="['filter-button', { 'active': selectedCategory === 'learning' }]" @click="selectedCategory = 'learning'">
                    <i class="bi bi-book"></i>
                    Learning
                </button>

                <button :class="['filter-button', { 'active': selectedCategory === 'events' }]" @click="selectedCategory = 'events'">
                    <i class="bi bi-calendar3"></i>
                    Events
                </button>

                <button type="button" class="createButton me-5" data-bs-toggle="modal" data-bs-target="#createForum">
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
                                <button type="submit" class="btn btn-primary" @click="addForum">Post</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Dynamic forum page-->
            <div class="forum-container m-3">

                <div v-if="selectedForums.length === 0">
                    No forums yet. Post your own!
                </div>

                <div v-else>
                    <div v-for="forum in selectedForums" :key="forum.id" class="indivForum m-3">
                        <h2 class="title">{{ forum.title }}</h2>
                        <p class="desc"> {{ forum.description }}</p>

                        <div class="d-flex justify-content-between align-items-center">
                            <div class="flex-grow-1 align-content-center"></div> <!-- This will push the button to the right -->

                            <router-link :to="{ name: 'forumDetail', params: { id: forum.id } }">
                                <i class="bi bi-arrow-right-circle directButton"></i>
                            </router-link>

                        </div>
                    </div>
                </div>


            </div>
        </section>
    </div>

</template>

<script>
import { collection, getDocs, addDoc, query, where } from "firebase/firestore";
import { db } from '../firebase/initialize';

export default{

    data (){
        return {
            selectedCategory: "",
            selectedForums: [],

            forumTitle: '',
            forumDesc:'',
            forumCategory:'',
        }
    },

    methods: {
        async getAllForums(){

            const querySnapshot = await getDocs(collection(db, "forums"));
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                console.log(doc.id, " => ", doc.data());
                this.selectedForums.push({ 
                    id: doc.id,
                    title: doc.data().title,
                    description: doc.data().description, 
                    category: doc.data().category,
                });
            });
        },

        async getSelectedForums (){
            this.selectedForums = [];

            if (this.selectedCategory == "all"){
                return this.getAllForums();
            }

            const q = query(collection(db, "forums"), where("category", "==", this.selectedCategory));

            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                console.log(doc.id, " => ", doc.data());
                this.selectedForums.push({ 
                    id: doc.id,
                    title: doc.data().title,
                    description: doc.data().description, 
                    category: doc.data().category,
                });
            });

            console.log("show selected forums", this.selectedForums)
        },

        async getTopForums(){
            // Condition for top: comments >= 3
        },

        async addForum() {
            const sessionUser = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user'));

            const newForumData = {
                name: this.forumTitle,
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
        }
    },

    watch: {
        // Watch for changes to selectedCategory and filter forums accordingly
        selectedCategory() {
            this.getSelectedForums();
        }
    }

}
</script>




<style scoped>
@import '../css/events.css';

.createButton {
  cursor: pointer;
  width: fit-content;
  padding: 10px 20px;
  font-family: 'Poppins';
  border-radius: 5px;
  border: none;
  background-color: #525FE1;
}

.indivForum {
    border: 2px solid #525FE1;
    border-radius: 20px;
    padding: 10px;
}

.directButton {
    font-size: 30px;
}

.filter-button {
    border-radius: 55px;
    width: 130px;
    margin: 2px;
}


</style>
