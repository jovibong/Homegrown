<template>

  <div class="container">

    <!-- Header -->

    <h1 class="title row justify-content-center mt-5">{{ title }}</h1>
    <img class="carouselHeaderwidth col-12 mb-5" :src="Image">

    <!-- Event Details -->
    <div class="row">
      <div class="col-12 d-grid grid-template">
        <div class="event-details">
          {{eventDate}}
        </div>

        <div class="event-details">
          {{location}}
        </div>

        <div class="event-details">
          {{eventCategory}}
        </div>
      </div>
    </div>

    <!-- Join Button -->
    <div class="button-container">
      <button @click="animateButton" :class="['joinButton', { active: isLayerActive, inactive: !isLayerActive }]">
      <i :class="iconClass"></i>
      <span class="button-text">{{ buttonText }}</span>
    </button>
    </div>

    <!-- Groups -->
     <div class="groupContainer">
      <h2 class="title"> Groups </h2>
      <button type="button" class="createButton"  
      data-bs-toggle="modal" data-bs-target="#createGroup"> CREATE YOUR OWN GROUP </button>

    </div>
    <!-- create group popup -->

<!-- Modal -->
<div class="modal fade" id="createGroup" tabindex="-1" aria-labelledby="createGroupLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="createGroupLabel">{{ title }}</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <form @submit.prevent="addGroups">
          Timing: <input type="text" name="title"/>
        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" @click="addGroups" class="btn btn-primary">Create Group</button>
      </div>
    </div>
  </div>
</div>
    <!-- to display dynamically the list of created groups -->
    <div v-if="groups.length == 0"> No groups yet. Create your own!
    </div>

    <div v-else>

    </div>

    <!-- Event Cards -->
    <div class="my-5">
      <h2 class="title"> Related Events </h2>
      <div class="scroll-container">
        <!-- row row-cols-2 row-cols-lg-5 g-2 g-lg-3 mt-5 -->
        <div class="card" style="width: 18rem;">
          <img src="img/deepavali.png" class="card-img-top" alt="...">
          <div class="card-body">
            <h5 class="card-title">Card title</h5>
            <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's
              content.</p>
            <a href="#" class="btn btn-primary">Go somewhere</a>
          </div>
        </div>

        <div class="card" style="width: 18rem;">
          <img src="img/deepavali.png" class="card-img-top" alt="...">
          <div class="card-body">
            <h5 class="card-title">Card title</h5>
            <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's
              content.</p>
            <a href="#" class="btn btn-primary">Go somewhere</a>
          </div>
        </div>

        <div class="card" style="width: 18rem;">
          <img src="img/deepavali.png" class="card-img-top" alt="...">
          <div class="card-body">
            <h5 class="card-title">Card title</h5>
            <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's
              content.</p>
            <a href="#" class="btn btn-primary">Go somewhere</a>
          </div>
        </div>

      </div>
    </div>

  </div> <!-- for container -->

</template>

<script>
import { collection, doc, getDoc, getDocs, addDoc, Timestamp } from "firebase/firestore";
import { db } from "../firebase/initialize";

export default {

  data() {
    return {
      eventID: this.$route.params.id,
      title: '',
      eventImage: '',
      description: '',
      eventDate:null,
      eventCategory: '',
      location: '',
      groups: [],

      // for adding groups
      groupName: "",
      groupDesc: "",
      groupTiming:"",
      groupMembers: [],

      // for animation 
      isLayerActive: false,
      iconClass: "bi bi-calendar-plus",
      buttonText: "",
      joinedEvent: false,
    };
  },

  mounted() {
    console.log('Event ID:', this.eventID); // Check if eventID is valid
    this.getEventDetails(this.eventID); // Call the function to get event details
    this.getGroups(this.eventID) // get event groups

    if (this.joinedEvent == false) {
      this.buttonText = "Add to Calendar"
    } else {
      this.iconClass = "bi bi-calendar-minus"
      this.buttonText = "Remove from Calendar"
    }
  },

  methods: {
    async getEventDetails(eventID) {
      try {
        console.log("Firestore instance:", db); // Debugging: Check db initialization
        const docRef = doc(db, "events", eventID); // Create a reference to the specific event document
        const docSnap = await getDoc(docRef); // Get the document snapshot

        if (docSnap.exists()) {
          console.log("Document data:", docSnap.data());
          this.title = docSnap.data().name;
          this.eventCategory = docSnap.data().category;
          this.location = docSnap.data().location;

          if ( docSnap.data().date instanceof Timestamp) {
            this.eventDate = docSnap.data().date.toDate(); // Convert Firestore Timestamp to Date
            console.log("Event Date: ", this.eventDate);
          }
        } else {
          console.log("Unable to retrieve event");
        }
      } catch (error) {
        console.error("Error fetching document:", error); // Catch any errors
      }
    },

    async getEventsByCategory (){

    },

    animateButton() {
      this.isLayerActive = true;

      if (this.joinedEvent == false) {
        setTimeout(() => {
          this.isLayerActive = false;
          this.iconClass = "bi bi-calendar-check";
          this.buttonText = "Added to Calendar";
          this.joinedEvent = !this.joinedEvent;

          setTimeout(() => {
            this.iconClass = "bi bi-calendar-minus";
            this.buttonText = "Remove from Calendar";
          }, 1000)
        }, 1500)

      } else {
        setTimeout(() => {
          this.isLayerActive = false;
          this.iconClass = "bi bi-calendar-check";
          this.buttonText = "Removed from Calendar";
          this.joinedEvent = !this.joinedEvent;

          setTimeout(() => {
            this.iconClass = "bi bi-calendar-plus";
            this.buttonText = "Add to Calendar";
          }, 1000)
        }, 1500)
      }
    },

    async addGroups() {
      const eventID = this.eventID;
      const eventRef = doc(db, "events", eventID);
      const groupsRef = collection(eventRef, "groups");

      // Create a new document in the "groups" subcollection with an auto-generated ID
      const newGroupData = {
        name: this.groupName,
        description: this.groupDesc, 
        timing: this.groupTiming,
        
      
      };

      try {
        const docRef = await addDoc(groupsRef, newGroupData); // Add the document
        console.log("Group created with ID: ", docRef.id); // Log the new document ID
      } catch (error) {
        console.error("Error adding group: ", error); // Handle errors
      }
    },

    async getGroups(eventID){
      const eventRef = doc(db, "events", eventID); // Reference to the specific event document
      const groupsRef = collection(eventRef, "groups"); // Reference to the "groups" subcollection

      try {
        // Get all documents in the "groups" subcollection
        const querySnapshot = await getDocs(groupsRef);

        // Array to hold the group data
        const groups = [];

        // Loop through the documents and extract data
        querySnapshot.forEach((doc) => {
          groups.push({
            id: doc.id, // The auto-generated ID of the document
            ...doc.data(), // The document data
          });
        });

        console.log("Groups retrieved:", groups);
        return groups; // Return the groups array
      } catch (error) {
        console.error("Error fetching groups: ", error);
      }
    }

  }
}


</script>
