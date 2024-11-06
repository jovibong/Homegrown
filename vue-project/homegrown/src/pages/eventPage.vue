<!-- how to lead to personal page, under profile? 
-->

<template>
    <!-- For overall root element -->
    <div>

        <!-- For Carousel -->
        <section class="row">

            <div id="carouselHeader" class="carousel slide mx-auto carouselHeaderwidth"
                data-bs-ride="carousel">

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
            <div class="d-flex align-items-center">
                <input type="text" class="searchBar col-6 me-3" placeholder="explore">
                <span class="ml-2 title me-3"> or </span>

                <button @click="allowCreate" :class="showCreate ? 'button pressed' : 'button notPressed'"> Create Event </button>
                <!-- <input type="text" class="searchBar col-6" placeholder="search"> -->
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
                <event-cards 
                v-for="event in myEvents" 
                :key="event.id" 
                :eventID = "event.id"
                :title = "event.title"
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
                        <p class="card-text">Some quick example text to build on the card title and make up the bulk of
                            the card's content.</p>
                        <a href="#" class="btn btn-primary">Go somewhere</a>
                    </div>
                </div>

                <div class="card" style="width: 18rem;">
                    <img src="img/deepavali.png" class="card-img-top" alt="...">
                    <div class="card-body">
                        <h5 class="card-title">Card title</h5>
                        <p class="card-text">Some quick example text to build on the card title and make up the bulk of
                            the card's content.</p>
                        <a href="#" class="btn btn-primary">Go somewhere</a>
                    </div>
                </div>

                <div class="card" style="width: 18rem;">
                    <img src="img/deepavali.png" class="card-img-top" alt="...">
                    <div class="card-body">
                        <h5 class="card-title">Card title</h5>
                        <p class="card-text">Some quick example text to build on the card title and make up the bulk of
                            the card's content.</p>
                        <a href="#" class="btn btn-primary">Go somewhere</a>
                    </div>
                </div>

            </div>
        </section>

        <!-- Event Cards -->
        <section class="my-5">
            <h2 class="title"> Past Events </h2>
            <div class="scroll-container">
                <!-- row row-cols-2 row-cols-lg-5 g-2 g-lg-3 mt-5 -->
                <div class="card" style="width: 18rem;">
                    <img src="img/deepavali.png" class="card-img-top" alt="...">
                    <div class="card-body">
                        <h5 class="card-title">Card title</h5>
                        <p class="card-text">Some quick example text to build on the card title and make up the bulk of
                            the card's content.</p>
                        <a href="#" class="btn btn-primary">Go somewhere</a>
                    </div>
                </div>

                <div class="card" style="width: 18rem;">
                    <img src="img/deepavali.png" class="card-img-top" alt="...">
                    <div class="card-body">
                        <h5 class="card-title">Card title</h5>
                        <p class="card-text">Some quick example text to build on the card title and make up the bulk of
                            the card's content.</p>
                        <a href="#" class="btn btn-primary">Go somewhere</a>
                    </div>
                </div>

                <div class="card" style="width: 18rem;">
                    <img src="img/deepavali.png" class="card-img-top" alt="...">
                    <div class="card-body">
                        <h5 class="card-title">Card title</h5>
                        <p class="card-text">Some quick example text to build on the card title and make up the bulk of
                            the card's content.</p>
                        <a href="#" class="btn btn-primary">Go somewhere</a>
                    </div>
                </div>

            </div>
        </section>

    </div> <!-- for container -->

</div>

</template>

<script>
import EventCards from '../components/eventCard.vue';
import createEvent from '../components/createEvents.vue';
import { collection, getDocs } from "firebase/firestore";
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
        }
    },

    mounted() {
        const userData = JSON.parse(localStorage.getItem('rememberMe')
            ? localStorage.getItem('user')
            : sessionStorage.getItem('user'));
        console.log(userData)

        this.getAllEvents();
    },


    methods: {

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
        }
    },

 
}
</script>

<style scoped="">
/* Scoped styles specific to Events.vue */
@import "../css/events.css";
</style>