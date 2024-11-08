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

        <div class="container">

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
                            :class="showCreate ? 'button col-3 pressed' : 'button col-3 notPressed'"> 
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
                        :description="event.description"></event-cards>
                </div>
            </section>

            <!-- Event Cards - Category -->
            <section class="my-5">
                <h2 class="title"> Events By Category </h2>
                <span><button> Filter By </button></span>
                <div class="scroll-container">
                    <!-- row row-cols-2 row-cols-lg-5 g-2 g-lg-3 mt-5 -->
                    <div class="card" style="width: 18rem;">
                        <img src="img/deepavali.png" class="card-img-top" alt="...">
                        <div class="card-body">
                            <h5 class="card-title">Card title</h5>
                            <p class="card-text">Some quick example text to build on the card title and make up the bulk
                                of
                                the card's content.</p>
                            <a href="#" class="btn btn-primary">Go somewhere</a>
                        </div>
                    </div>

                    <div class="card" style="width: 18rem;">
                        <img src="img/deepavali.png" class="card-img-top" alt="...">
                        <div class="card-body">
                            <h5 class="card-title">Card title</h5>
                            <p class="card-text">Some quick example text to build on the card title and make up the bulk
                                of
                                the card's content.</p>
                            <a href="#" class="btn btn-primary">Go somewhere</a>
                        </div>
                    </div>

                    <div class="card" style="width: 18rem;">
                        <img src="img/deepavali.png" class="card-img-top" alt="...">
                        <div class="card-body">
                            <h5 class="card-title">Card title</h5>
                            <p class="card-text">Some quick example text to build on the card title and make up the bulk
                                of
                                the card's content.</p>
                            <a href="#" class="btn btn-primary">Go somewhere</a>
                        </div>
                    </div>

                </div>
            </section>

            <!-- Event Cards -->
            <section class="my-5">
                <h2 class="title"> All Events </h2>
                <div class="allEventlist">
                    <event-cards v-for="event in myEvents" :key="event.id" :eventID="event.id" :title="event.title"
                        :description="event.description"></event-cards>
                </div>

                <button @click="toggleShowAllEvents">
                    {{ showAllEvents ? 'Show Less' : 'Show More' }}
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
            popularEvents:[],
            pastEvents:[],
            myEvents:[],
            showCreate: false,

            maxVisibleEvents: 4, // Set the initial number of events to display
            showAllEvents: false, // Toggle to show all events or only limited number

            eventSuggestVisible: false,
            searchQuery: '',
            suggestEvents: []
        }
    },

    mounted() {
        const userData = JSON.parse(localStorage.getItem('rememberMe')
            ? localStorage.getItem('user')
            : sessionStorage.getItem('user'));
        console.log(userData)

        this.getAllEvents();
    },

    computed: {
        filteredEvents() {
            // Convert search query to lowercase for a case-insensitive search
            const query = this.searchQuery.toLowerCase();

            // Filter `myEvents` based on `searchQuery`
            return this.myEvents.filter(
                (event) =>
                    event.title.toLowerCase().includes(query) ||
                    event.description.toLowerCase().includes(query)
            );
        },
        displayedEvents() {
            return this.showAllEvents ? this.myEvents : this.myEvents.slice(0, this.maxVisibleEvents);
        }
    },


    methods: {
        toggleShowAllEvents() {
      this.showAllEvents = !this.showAllEvents;
    },


        async getEventsByCategory(){

        },

        async getAllEvents(){
            const querySnapshot = await getDocs(collection(db, "events"));
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                console.log(doc.id, " => ", doc.data());
                this.myEvents.push({ 
                    id: doc.id,
                    title: doc.data().name,
                    description: doc.data().description, });
            });
        },

        async getMyEvents(){
            
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
        }
    },

}
</script>

