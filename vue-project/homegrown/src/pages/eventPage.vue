
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
                        <img src="../img/cultural.jpg" class="d-block w-100" alt="...">
                        <div class="carousel-caption d-none d-md-block">
                        </div>
                    </div>

                    <div class="carousel-item">
                        <img src="../img/heritagewalk.jpg" class="d-block w-100" alt="...">
                        <div class="carousel-caption d-none d-md-block">
                        </div>
                    </div>
                    <div class="carousel-item">
                        <img src="../img/volunteering.jpeg" class="d-block w-100" alt="...">
                        <div class="carousel-caption d-none d-md-block">
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

        <div class="container mt-3">

            <!-- Explore more or Search -->
            <section class="row">
                <h2 class="text-primary fw-bold mb-3 display-4 my-3">Explore more here</h2>
                <hr>

                <div class="container text-center">
                    <div class="row align-items-center">

                        <div class="col-12 col-sm-6 search-container">
                            <input type="text" class="searchBar" id="dropdownTextbox"
                                :aria-expanded="(filteredEvents.length > 0).toString()" placeholder="Search for events"
                                @keyup.enter="eventSearch" v-model="searchQuery" 
                                autocomplete="off"/>

                            <!-- Dropdown for search results -->
                            <ul v-show="searchQuery.length > 0 && filteredEvents.length > 0" class="dropdown-content"
                                aria-labelledby="dropdownTextbox">
                                <li v-for="event in filteredEvents" :key="event.id" @click="selectEvent(event.title, event.id)">{{ event.title }}
                                </li>
                            </ul>
                        </div>

                        <span class="text-muted h5 col-1"> OR </span>

                        <router-link to="/forum" class="btn btn-primary col-2">
                            Go to Forum
                        </router-link>

                        <span class="text-muted h5 col-1"> OR </span>

                        <button @click="allowCreate"
                            :class="showCreate ? 'createButton col-2 pressed' : 'createButton col-2 notPressed'">
                            Create Event </button>
                    </div>
                </div>


                <div class="mt-3">

                    <keep-alive>
                        <transition name="create">
                            <create-event v-if="showCreate" class="createEventStyle"></create-event>
                        </transition>
                    </keep-alive>

                </div>

            </section>

            <!-- Event Cards -->
            <section class="my-5">
                <h2 class="text-primary fw-bold mb-3 display-4"> My Events </h2>
                <hr>
                <div v-if="myEvents.length == 0" class="text-center text-muted mb-4 h5">
                    You have yet to join an event!
                </div>
                <div v-else>
                    <div class="scroll-container">
                        <event-cards v-for="event in myEvents" :key="event.id" :eventID="event.id"
                            :title="event.title" :image="event.imageURL" :description="event.description"></event-cards>
                    </div>
                </div>
            </section>

            <!-- Event Cards - Category -->
            <section class="my-5">
                <h2 class="text-primary fw-bold mb-3 display-4"> Events By Category </h2>

                <select v-model="selectedCategory" @change="getEventsByCategory" class="form-select">
                    <option disabled value="">Select a category</option>
                    <option value="Holidays">Holidays</option>
                    <option value="Festivals">Festivals</option>
                    <option value="Outdoors">Outdoors</option>
                    <option value="Cultural">Cultural</option>
                    <option value="Meet-ups">Meet-ups</option>
                    <option value="Others">Others</option>
                </select>


                <div v-if="selectedEvents.length == 0" class="text-center text-muted mb-4 h5">
                    No event in selected category
                </div>
                <div v-else>
                    <div class="scroll-container">
                        <event-cards v-for="event in selectedEvents" :key="event.id" :eventID="event.id"
                            :title="event.title" :image="event.imageURL" :description="event.description"></event-cards>
                    </div>
                </div>
            </section>

            <!-- Event Cards -->
            <section class="my-5">
                <h2 class="text-primary fw-bold mb-3 display-4"> All Events </h2>
                <hr>
                <transition-group name="fade" tag="div" class="event-grid">
                    <event-cards v-for="event in showAllEvents" :key="event.id" :eventID="event.id" :title="event.title"
                        :description="event.description" :image="event.imageURL"></event-cards>
                </transition-group>

                <button class="showButton m-2" @click="toggleShowAllEvents">
                    {{ displayAllEvents ? 'Show Less' : 'Show More' }}
                </button>

            </section>

        </div> <!-- for container -->

    </div>

</template>

<script>
import EventCards from '../components/eventCard.vue';
import createEvent from '../components/createEvents.vue';
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from '../firebase/initialize'


export default {

  components:
    {
        "event-cards": EventCards,
        "create-event": createEvent
    },

    data() {
        return {
            currentUser: "",

            pastEvents:[],
            myEvents:[],
            allEvents:[],

            //search bar
            searchedEventTitle: '',
            searchedEventID:'',

            // category filter
            selectedEvents: [],
            selectedCategory: '',

            showCreate: false,

            maxVisibleEvents: 3, // Set the initial number of events to display
            displayAllEvents: false, // Toggle to show all events or only limited number

            eventSuggestVisible: false,
            searchQuery: '',
        }
    },

    mounted() {
        this.getMyEvents();  
        this.getAllEvents();
    },

    computed: {
        filteredEvents() {
            // Convert search query to lowercase for a case-insensitive search
            const query = this.searchQuery.toLowerCase();

            // Filter `myEvents` based on `searchQuery`
            return this.allEvents.filter(
                (event) =>
                    event.title.toLowerCase().includes(query) 
                    // || event.description.toLowerCase().includes(query)
            );
        },

        showAllEvents() {
            return this.displayAllEvents ? this.allEvents : this.allEvents.slice(0, this.maxVisibleEvents);
        }
    },


    methods: {

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

        async getMyEvents(){
            const sessionUser = await(JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user')));
            const currentUser = sessionUser.uid

            console.log("user is",currentUser)

            const querySnapshot = await getDocs(collection(db, 'events'));

            querySnapshot.docs
                .filter(doc => doc.data().joined && doc.data().joined.includes(currentUser))
                .forEach(doc => {
                    console.log(doc.id, " => ", doc.data());
                    this.myEvents.push({
                        id: doc.id,
                        title: doc.data().name,
                        description: doc.data().description,
                        imageURL: doc.data().imageURL,
                    })
                console.log("my event", this.myEvents)
            })  
        },

        async getPastEvents() {
            const querySnapshot = await getDocs(collection(db, "events"));

            const today = new Date();  // Get today's date and time

            querySnapshot.forEach((doc) => {
                // Get event data from Firestore
                const eventDate = doc.data().date.toDate(); 

                // Check if the event date is in the past
                if (eventDate < today) {
                    console.log("successful check of eventDate<today")
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

        async eventSearch(){
            this.$router.push({ name: 'eventDetail', params: { id: this.selectedEventID } });
        },

        selectEvent(selectedTitle, selectedID){
            this.searchQuery = selectedTitle; // Update searchQuery with the selected title
            this.selectedEventID = selectedID;
        }
        // async getRelevantSearches() {
        //     console.log(this.searchQuery)
        //     this.searchQuery = this.searchQuery.toLowerCase()
        //     this.eventSuggestVisible = true;

        //     if (!this.searchQuery) {
        //         this.suggestEvents = []; // Clear results if search is empty
        //         this.eventSuggestVisible = false;
        //         return;
        //     }

        //     // Fetch events based on partial matches
        //     const q = query(collection(db, "events"), 
        //     where("name", ">=", this.searchQuery), where("name", "<=", this.searchQuery + "\uf8ff"));

        //     try {
        //         const querySnapshot = await getDocs(q);
        //         querySnapshot.forEach((doc) => {
        //             // Manually extract fields from doc.data()
        //             const eventData = doc.data();
        //             const event = {
        //                 id: doc.id,
        //                 name: eventData.name,
        //             };
        //             console.log(event)

        //             if (!this.suggestEvents.find(e => e.id === event.id)) {
        //                 this.suggestEvents.push(event);
        //                 console.log(this.suggestEvents);
        //             }
        //         });
        //     } catch (error) {
        //         console.error("Error fetching related event searches: ", error);
        //     }
        // },

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

.showButton {
    width: 100%;
    cursor: pointer;
    font-family: 'Poppins';
    background-color: #525FE1;
    color: white;
}

.event-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); /* Responsive columns */
    gap: 20px; /* Space between cards */
    max-width: 100%; /* Ensures grid is responsive */
}

@media (min-width: 992px) {
    .event-grid {
        grid-template-columns: repeat(3, 1fr); /* 3 cards per row on large screens */
    }
}

.fade-enter-active {
    transition: opacity 0.5s ease, transform 0.5s ease;
}

.fade-enter-from {
    opacity: 0;
    transform: translateY(10px); /* Start slightly lower */
}

.fade-enter-to {
    opacity: 1;
    transform: translateY(0); /* End at the original position */
}

.search-container {
    position: relative;
    width: 100%;
    max-width: 400px; /* Optional: set a maximum width */
}

.searchBar {
  padding-left: 30px;
  border: 2px solid #525FE1;
  height: 50px;
  width: 100%;
}

.dropdown-content {
    position: absolute;
    top: 100%; /* Position directly below the input */
    left: 0;
    width: 100%;
    background-color: white;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    z-index: 10;

    list-style-type: none; /* Remove bullet points */
    padding: 0;
    max-height: 200px; /* Limit height for scrolling */
    overflow-y: auto;
    border-radius: 4px;
}

.dropdown-content li {
    cursor: pointer;
    padding: 5px;
    text-align: start;
}

.dropdown-content li:hover {
    background-color: #f1f1f1;
}


</style>