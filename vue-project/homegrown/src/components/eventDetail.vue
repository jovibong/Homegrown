<template>


    <!-- Header -->
    <div class="header-container">

    <img class="headerImage" :src="eventImage">
    <h1 class="row justify-content-center m-3 headerTitle">{{ eventTitle }}</h1>

    </div>

    <div class="container">

    <!-- Event Details -->
    <div class="row">
      <div class="col-12 d-grid grid-template">
        <div class="event-details">
          {{eventDay}}
          {{eventDate}}
          {{eventTime}} 
        </div>

        <div class="event-details">
          {{location}}
        </div>

        <div class="event-details">
          {{eventCategory}}
        </div>
      </div>
    </div>

    <div class="row eventDesc m-4">
      {{ eventDescription }}
    </div>

    <!-- Join Button -->
    <div class="button-container">
      <button @click="animateButton" :class="['joinButton', { active: isLayerActive, inactive: !isLayerActive }]">
        <i :class="iconClass"></i>
        <span class="button-text">{{ buttonText }}</span>
      </button>
    </div>

    <!-- Groups -->
    <div class="groupContainer mt-4">
      <h2 class="title"> Groups </h2>
      <button type="button" @click="modalVisible = true" class="createButton" data-bs-toggle="modal" data-bs-target="#createGroup"> CREATE YOUR OWN
        GROUP </button>

    </div>
    <!-- create group popup -->

    <!-- Modal -->
    <div class="modal fade" v-show="modalVisible" id="createGroup" tabindex="-1" aria-labelledby="createGroupLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">

          <div class="modal-body">
            <form @submit.prevent="addGroups">
              <!-- Event Title -->
              <div>
                <h2 class="title d-flex justify-content-center my-3"> {{ eventTitle }} </h2>
              </div>

              <div class="row mb-3">
                <label for="Name" class="col-form-label"> Group Name : </label>
                <div class="col-sm-9">
                  <input id="Name" v-model="groupName" type="text" class="form-control" />
                </div>
              </div>

              <!-- Description -->
              <div class="row mb-3">
                <label for="description" class="col-sm-2 col-form-label">Description</label>
                <div class="col-sm-10">
                  <textarea rows="4" cols="50" id="description" v-model="groupDesc" class="form-control"></textarea>

                </div>
              </div>

              <!-- Date and Time -->
              <div class="row mb-3">
                <label for="date" class="col-sm-2 col-form-label">Date</label>
                <div class="col-sm-4">
                  <input id="date" v-model="groupDate" type="date" class="form-control" />
                </div>

                <label for="time" class="col-sm-2 col-form-label">Time</label>
                <div class="col-sm-4">
                  <input id="time" v-model="groupTime" type="time" class="form-control" />
                </div>
              </div>

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
      <div v-for="group in groups" :key="group.name" class="eventGroup">
        <div id="groupName">{{ group.name }}</div>
      </div>
    </div>

    <!-- Event Cards -->
    <div class="my-5">
      <h2 class="title"> Related Events </h2>
      <div class="scroll-container">
        <!-- row row-cols-2 row-cols-lg-5 g-2 g-lg-3 mt-5 -->
        <event-cards v-for="event in relatedEvents" :key="event.id" :eventID="event.id" :title="event.title"
          :description="event.description" :image="event.imageURL"></event-cards>
      </div>
    </div>

  </div> <!-- for container -->

</template>

<script>
import { collection, doc, getDoc, getDocs, addDoc, query, where, Timestamp } from "firebase/firestore";
import { db } from "../firebase/initialize";
import EventCards from '../components/eventCard.vue';
import { gapi } from 'gapi-script';

export default {
  components:
    {
        "event-cards": EventCards,
    },

  data() {
    return {
      modalVisible: false,

      eventID: this.$route.params.id,
      eventTitle: '',
      eventImage: '',
      eventDescription: '',
      eventTiming:null,
      eventDay:'',
      eventDate:'',
      eventTime:'',
      eventCategory: '',
      location: '',
      groups: [],

      // for adding groups
      groupName: "",
      groupDesc: "",
      groupDate: null,
      groupTime: null,
      groupMembers: [],

      // for related events
      relatedEvents: [],

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
          this.eventTitle = docSnap.data().name;
          this.eventCategory = docSnap.data().category;
          this.location = docSnap.data().location;
          this.eventDescription = docSnap.data().description;
          this.eventImage = docSnap.data().imageURL;
          this.eventTiming = docSnap.data().date.toDate();

          this.eventDay = this.eventTiming.toLocaleString('en-us', { weekday: 'long' });

          // Get the date (e.g., 25)
          this.eventDate = this.eventTiming.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

          // Get the time (e.g., 18:00:00)
          this.eventTime = this.eventTiming.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

          console.log(this.eventDay, this.eventDate, this.eventTime)

          this.getRelatedEvents();
        } else {
          console.log("Unable to retrieve event");
        }
      } catch (error) {
        console.error("Error fetching document:", error); // Catch any errors
      }
    },


    async addGroups() {
      const eventID = this.eventID;
      const eventRef = doc(db, "events", eventID);
      const groupsRef = collection(eventRef, "groups");

      // Create a new document in the "groups" subcollection with an auto-generated ID
      const dateTimeString = `${this.groupDate}T${this.groupTime}`;
      const combinedDateTime = new Date(dateTimeString);

      const newGroupData = {
        name: this.groupName,
        description: this.groupDesc, 
        timing: Timestamp.fromDate(new Date(combinedDateTime)),
      
      };

      try {
        const docRef = await addDoc(groupsRef, newGroupData); // Add the document
        console.log("Group created with ID: ", docRef.id); // Log the new document ID
        this.modalVisible = false;

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

        // Loop through the documents and extract data
        querySnapshot.forEach((doc) => {
          const timing = doc.data().date.toDate();

          // Get the date 
          const groupDate = timing.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

          // Get the time (e.g., 18:00:00)
          const groupTime = timing.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });


          this.groups.push({ 
            id: doc.id,
            name: doc.data().groupName,
            groupDesc: doc.data().description,
            date: groupDate,
            time: groupTime,
          });
        });

        console.log("Groups retrieved:", this.groups);
        return
      } catch (error) {
        console.error("Error fetching groups: ", error);
      }
    },

    async getRelatedEvents(){
      console.log(this.eventCategory);
      const q = query(collection(db, "events"), where("category", "==", this.eventCategory));

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          console.log(doc.id, " => ", doc.data());
          this.relatedEvents.push({ 
              id: doc.id,
              title: doc.data().name,
              description: doc.data().description, 
              imageURL: doc.data().imageURL,
          });
          console.log(this.relatedEvents);
      }); 

  },

  async addMyEvent(){
    // add to calendar
    // push into user's events
    const addedEvent = {
      summary: this.eventTitle,
      location: this.location,
      description: "Description of the event.",
      start: {
        date: '2024-11-20', // Only the date, no specific time
        timeZone: 'America/Los_Angeles'
      },
      end: {
        date: '2024-11-20', // Same date for an all-day event
        timeZone: 'America/Los_Angeles'
      },
      attendees: [
        { email: 'example@example.com' },
      ]
    };


    gapi.client.calendar.events.insert({
      calendarId: 'primary',  // 'primary' is the user's default calendar
      resource: addedEvent
    }).then(function (response) {
      console.log('Event created: ', response);
    }, function (error) {
      console.error('Error creating event: ', error);
    });
  },

  async removeMyEvent(){

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


  // loadClient() {
  //     const CLIENT_ID = '748881168394-maspb08ner814udj63b7fdieikgh2gev.apps.googleusercontent.com';
  //     const API_KEY = 'AIzaSyAiOMsPpvQqYh276xDd3wFxSRCg_Msf_6E';

  //     gapi.client.init({
  //       apiKey: API_KEY,
  //       clientId:CLIENT_ID,
  //       discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
  //       scope: "https://www.googleapis.com/auth/calendar.events",
  //     }).then(function () {
  //       // Check if the user is signed in
  //       if (gapi.auth2.getAuthInstance().isSignedIn.get()) {
  //         console.log("User is signed in");
  //       } else {
  //         gapi.auth2.getAuthInstance().signIn();
  //       }
  //     });
  //   },

  // handleClientLoad() {
  //       gapi.load('client:auth2', loadClient);
  //   },

  }
}


</script>

<style scoped>
@import '../css/events.css';

/* .header-container {
  position: relative;
  width: 100%;                 
  max-height: 300px;           
  overflow: hidden;
} */

.headerImage {
  width: 100%;
  height: 300px;
  object-fit: cover;
  object-position: center;
}

.headerTitle {
  font-family: 'Poppins';
  color: #525FE1;
  font-weight: bold;

  /* position: absolute;
  top: 20%;
  left: 50%;
  transform: translate(-50%, -50%); 
  color: white;                   
  font-size: 2.5rem;              
  text-align: center;
  z-index: 1;                      */
}


.event-details {
  border: 2px solid #525FE1;
  margin-right: 10px;
  height: 70px;
  color: black;
  text-align: center;
}

.eventDesc {
  border: 2px solid #525FE1;
  height: fit-content;
  color: black;
  padding: 10px;
}

.createButton {
  width: fit-content;
  padding: 5px;
  padding-left: 20px;
  padding-right: 20px;
  background-color: #525FE1;
  color: yellow;
  font-family: 'Poppins';
  border-radius: 55px;
  border: 0px;
}

/* Grid template for responsive layout - for eventDetails */
.grid-template {
  display: grid;
  grid-template-columns: 1fr;
  /* Single column by default */
  gap: 1rem;
  /* Adjust spacing as needed */
}

@media (min-width: 768px) {
  .grid-template {
    grid-template-columns: repeat(3, 1fr);
    /* Three equal columns for medium and larger screens */
  }
}


/* Add to Calendar button animation*/

.button-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.joinButton .inactive {
  /* Return to original height and width with a slight delay */
  height: 95px;
  width: 500px;
  transition: all 0.3s ease;
}

.joinButton {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  height: 60px;
  width: 500px;
  background: #5e14c6;
  border-radius: 55px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  overflow: hidden;
  padding: 10px;
}

/* Active state changes for the button */
.joinButton.active {
  height: 20px;
  width: 500px;
}

/* Background animation layer */
.joinButton::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  height: 100%;
  width: 100%;
  background: #525FE1;
  border-radius: 55px;
  transition: all 6s ease-in-out;
}

.joinButton.active::before {
  animation: layer 1.5s ease-in-out forwards;
}

@keyframes layer {
  100% {
    left: 0%;
  }
}

/* Icon and text styles within the button */
.joinButton i,
.joinButton .button-text {
  color: #fff;
  font-size: 20px;
  /* Adjusted to a consistent size */
  font-weight: 500;
  transition: transform 0.2s ease;
}

/* Adjust the icon margin */
.joinButton .button-text {
  margin-left: 8px;
}

/* Transform text when button is active */
.joinButton.active i,
.joinButton.active .button-text {
  transform: translateY(60px);
}

.joinButton.inactive i,
.joinButton.inactive .button-text {
  transform: translateY(0);
}

</style>
