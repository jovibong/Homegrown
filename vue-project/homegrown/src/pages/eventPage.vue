<!-- how to lead to personal page, under profile? 
-->

<template>
    <!-- For overall root element -->
    <div>

        <!-- For Carousel -->
        <section class="row">

            <div id="carouselHeader" class="carousel slide mx-auto carouselHeaderwidth" data-bs-ride="carousel">

                <div class="carousel-indicators">
                    <button type="button" data-bs-target="#carouselHeader" data-bs-slide-to="0" class="active"
                        aria-current="true" aria-label="Slide 1"></button>
                    <button type="button" data-bs-target="#carouselHeader" data-bs-slide-to="1"
                        aria-label="Slide 2"></button>
                    <button type="button" data-bs-target="#carouselHeader" data-bs-slide-to="2"
                        aria-label="Slide 3"></button>
                </div>

                <div class="carousel-inner">
                    <div class="carousel-item active">
                        <img src="../img/deepavali.png" class="d-block w-100" alt="...">
                        <div class="carousel-caption d-none d-md-block">
                            <h5>Deepavali</h5>
                            <p>Some representative placeholder content for the first slide.</p>
                        </div>
                    </div>

                    <div class="carousel-item">
                        <img src="../img/deepavali.png" class="d-block w-100" alt="...">
                        <div class="carousel-caption d-none d-md-block">
                            <h5>First slide label</h5>
                            <p>Some representative placeholder content for the first slide.</p>
                        </div>
                    </div>
                    <div class="carousel-item">
                        <img src="../img/deepavali.png" class="d-block w-100" alt="...">
                        <div class="carousel-caption d-none d-md-block">
                            <h5>First slide label</h5>
                            <p>Some representative placeholder content for the first slide.</p>
                        </div>
                    </div>
                </div>

                <button class="carousel-control-prev" type="button" data-bs-target="#carouselHeader"
                    data-bs-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Previous</span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#carouselHeader"
                    data-bs-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Next</span>
                </button>
            </div>

        </section>

        <div class="container mt-5">

            <!-- Explore more or Search -->
            <section class="row">
                <h2 class="title my-3">Explore more here</h2>

                <div class="container text-center">
                    <div class="row align-items-center">

                        <div class="col-12 col-sm-6">
                            <input type="text" class="searchBar" id="dropdownTextbox"
                                :aria-expanded="eventSuggestVisible.toString()" placeholder="Search for events"
                                @input="getRelevantSearches" @keyup.enter="eventSearch" v-model="searchQuery" />

                            <ul v-show="eventSuggestVisible" class="dropdown-content" aria-labelledby="dropdownTextbox">
                                <li v-for="event in suggestEvents" :key="event.name"> {{ event.name }}</li>
                            </ul>
                        </div>

                        <span class="title col-2"> or </span>

                        <button @click="allowCreate"
                            :class="showCreate ? 'createButton col-3 pressed' : 'createButton col-3 notPressed'">
                            Create Event </button>
                        <!-- <input type="text" class="searchBar col-6" placeholder="search"> -->
                    </div>
                </div>


                <div class="mt-3">

                    <keep-alive>
                        <transition name="create">
                            <create-event v-if="showCreate" class="createEventStyle"></create-event>
                        </transition>
                    </keep-alive>

                </div>

                <router-link to="/forum" class="btn btn-primary mt-4">
                    to Forum
                </router-link>

                <router-link to="/calender" class="btn btn-primary mt-4">
                    to calender
                </router-link>
            </section>

            <!-- Event Cards -->
            <section class="my-5">
                <h2 class="title"> My Events </h2>
                <div class="scroll-container">
                    <!-- row row-cols-2 row-cols-lg-5 g-2 g-lg-3 mt-5 -->
                    <event-cards v-for="event in myEvents" :key="event.id" :eventID="event.id" :title="event.title"
                        :description="event.description" :image="event.imageURL"></event-cards>
                </div>
            </section>

            <!-- Event Cards - Category -->
            <section class="my-5">
                <h2 class="title"> Events By Category </h2>

                <select v-model="selectedCategory" @change="getEventsByCategory" class="form-select">
                    <option disabled value="">Select a category</option>
                    <option value="Holiday">Holiday</option>
                    <option value="Festivals">Festivals</option>
                    <option value="Outdoors">Outdoors</option>
                    <option value="Cultural">Cultural</option>
                    <option value="Meet-ups">Meet-ups</option>
                    <option value="Others">Others</option>
                </select>

                <div class="scroll-container">
                <div v-if="selectedEvents.length == 0">
                    No event in selected category 
                </div>
                <div v-else>
                    <event-cards v-for="event in selectedEvents" :key="event.id" :eventID="event.id"
                        :title="event.title" :image="event.imageURL" :description="event.description"></event-cards>
                </div>
                </div>
            </section>

            <!-- Event Cards -->
            <section class="my-5">
                <h2 class="title"> All Events </h2>
                <div class="allEventlist">
                    <event-cards v-for="event in showAllEvents" :key="event.id" :eventID="event.id" :title="event.title"
                        :description="event.description" :image="event.imageURL"></event-cards>
                </div>

                <button @click="toggleShowAllEvents">
                    {{ displayAllEvents ? 'Show Less' : 'Show More' }}
                </button>

            </section>

        </div> <!-- for container -->

    </div>

</template>

<script>
import EventCards from '../components/eventCard.vue';
import createEvent from '../components/createEvents.vue';
import { collection, getDocs, getDoc, setDoc, query, where, doc } from "firebase/firestore";
import { db } from '../firebase/initialize'


export default {

  components:
    {
        "event-cards": EventCards,
        "create-event": createEvent
    },

    data() {
        return {
            currentEvents:[],
            pastEvents:[],
            myEvents:[],
            allEvents:[],

            selectedEvents: [],
            selectedCategory: '',

            showCreate: false,

            maxVisibleEvents: 2, // Set the initial number of events to display
            displayAllEvents: false, // Toggle to show all events or only limited number

            eventSuggestVisible: false,
            searchQuery: '',
            suggestEvents: []
        }
    },

    mounted() {
        // this.getUser();     
        this.getAllEvents();
    },

    computed: {
        // filteredEvents() {
        //     // Convert search query to lowercase for a case-insensitive search
        //     const query = this.searchQuery.toLowerCase();

        //     // Filter `myEvents` based on `searchQuery`
        //     return this.myEvents.filter(
        //         (event) =>
        //             event.title.toLowerCase().includes(query) ||
        //             event.description.toLowerCase().includes(query)
        //     );
        // },

        showAllEvents() {
            return this.displayAllEvents ? this.allEvents : this.allEvents.slice(0, this.maxVisibleEvents);
        }
    },


    methods: {
        async getUser(){
            const sessionUser = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user'));
            console.log(sessionUser.uid);

            const userId = sessionUser.uid;
            const userDocRef = doc(db, 'finance', userId); // Reference to the user's document

            // Check if the user document exists
            const userDocSnapshot = await getDoc(userDocRef);

            // If the user document doesn't exist, create it (you can optionally add some initial data to it)
            if (!userDocSnapshot.exists()) {
                await setDoc(userDocRef, { userId: userId });
            }
        },

        toggleShowAllEvents() {
        this.displayAllEvents = !this.displayAllEvents;
        },

        async getEventsByCategory(){
            this.selectedEvents = [];
            const eventCategory = this.selectedCategory;
            const q = query(collection(db, "events"), where("category", "==", eventCategory));

            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                console.log(doc.id, " => ", doc.data());
                this.selectedEvents.push({ 
                    id: doc.id,
                    title: doc.data().name,
                    description: doc.data().description, 
                    imageURL: doc.data().imageURL,
                });
            }); 

        },

        async getAllEvents(){
            const querySnapshot = await getDocs(collection(db, "events"));
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                console.log(doc.id, " => ", doc.data());
                this.allEvents.push({ 
                    id: doc.id,
                    title: doc.data().name,
                    description: doc.data().description, 
                    imageURL: doc.data().imageURL,
                });
            });

            this.getPastEvents();
        },

        async getMyEvents(userID){
            console.log(userID)
        },

        async getPastEvents() {
            const querySnapshot = await getDocs(collection(db, "events"));

            const today = new Date();  // Get today's date and time

            querySnapshot.forEach((doc) => {
                // Get event data from Firestore
                const eventDate = doc.data().date.toDate(); 

                // Check if the event date is in the past
                if (eventDate < today) {
                    console.log("i made it")
                    console.log(doc.id, " => ", doc.data());

                    // Push the event into the array if it's in the past
                    this.pastEvents.push({
                        id: doc.id,
                    });
                }
            });

            console.log("Past Events", this.pastEvents)
        },

        allowCreate(){
            this.showCreate = !this.showCreate;
        },

        async getRelevantSearches() {
            console.log(this.searchQuery)
            this.searchQuery = this.searchQuery.toLowerCase()
            this.eventSuggestVisible = true;

            if (!this.searchQuery) {
                this.suggestEvents = []; // Clear results if search is empty
                this.eventSuggestVisible = false;
                return;
            }

            // Fetch events based on partial matches
            const q = query(collection(db, "events"), 
            where("name", ">=", this.searchQuery), where("name", "<=", this.searchQuery + "\uf8ff"));

            try {
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                    // Manually extract fields from doc.data()
                    const eventData = doc.data();
                    const event = {
                        id: doc.id,
                        name: eventData.name,
                    };
                    console.log(event)

                    if (!this.suggestEvents.find(e => e.id === event.id)) {
                        this.suggestEvents.push(event);
                        console.log(this.suggestEvents);
                    }
                });
            } catch (error) {
                console.error("Error fetching related event searches: ", error);
            }
        },

    },

}
</script>

<style scoped>
@import '../css/events.css';

/* for carousel */
.carouselHeaderwidth {
  width: 100%;
  max-height: auto;
  overflow: hidden;
  margin-bottom: 5px;
}


.carousel-inner img {
  object-fit: cover;
  /* Ensure images cover the area without distortion */
  object-position: center;
  /* Center the image */
  height: 300px;
  /* Set a fixed height to control cropping */
}



/* For button pressed and not pressed*/
/* Not pressed state */
.notPressed {
  background-color: #525FE1;
  color: white;
}

/* Pressed state */
.pressed {
  border: 2px solid darkblue;
  color:white;
}


.createEvent {
  padding: 10px 20px;
  /* Adjust padding as needed */
  border: none;
  border-radius: 5px;
  /* Rounded corners */
  /* Smooth transition */
}

.createButton {
  cursor: pointer;
  width: fit-content;
  padding: 10px 20px;
  font-family: 'Poppins';
  border-radius: 5px;
  border: none;
}

</style>