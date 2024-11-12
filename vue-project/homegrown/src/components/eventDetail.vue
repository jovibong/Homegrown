<template>
  <!-- Header -->
  <loading-animation v-if="event_loading"></loading-animation>
  <div class="header-container">

    <img class="headerImage" :src="eventImage">
    <h1 class="row justify-content-center m-3 text-primary fw-bold text-center mb-3 display-4">{{ eventTitle }}</h1>

  </div>

  <loading-animation v-if="event_loading"></loading-animation>
  <div v-if="!event_loading" class="container">

    <!-- Event Details -->
    <div class="row">
      <div class="col-12 d-grid grid-template">
        <div class="text-muted mb-4 h5 timing-details">
          {{ eventDay }} |
          {{ eventDate }} |
          {{ eventTime }}
        </div>

        <div class="text-muted mb-4 h5 location-details">
          @
          {{ location }}
        </div>

        <div class="text-muted mb-4 h5 category-details">
          {{ eventCategory }}
        </div>
      </div>
    </div>

    <div class="row eventDesc text-muted mb-4 h5">
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
      <h2 class="text-primary fw-bold text-center mb-3 display-4"> Groups </h2>

      <button type="button" @click="modalVisible = true" class="createButton" data-bs-toggle="modal"
        data-bs-target="#createGroup">
        CREATE YOUR OWN GROUP </button>

    </div>

    <hr>
    <!-- create group popup -->

    <!-- Modal -->
    <div class="modal fade" v-show="modalVisible" id="createGroup" tabindex="-1" aria-labelledby="createGroupLabel"
      aria-hidden="true">
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
                <label for="description" class="col-form-label">Description</label>
                <div class="col-sm-10">
                  <textarea rows="4" cols="50" id="description" v-model="groupDesc" class="form-control"></textarea>

                </div>
              </div>

              <!-- Date and Time -->
              <!-- <div class="row mb-3">
                <label for="date" class="col-sm-2 col-form-label">Date</label>
                <div class="col-sm-4">
                  <input id="date" v-model="groupDate" type="date" class="form-control" />
                </div>

                <label for="time" class="col-sm-2 col-form-label">Time</label>
                <div class="col-sm-4">
                  <input id="time" v-model="groupTime" type="time" class="form-control" />
                </div>
              </div> -->

              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="submit" class="btn btn-primary">Create Group</button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>

    <div v-if="loading" class="loading-overlay">
      <div class="spinner">Loading...</div> <!-- This can be a custom spinner -->
    </div>
    <!-- to display dynamically the list of created groups -->
    <div v-if="!groups_loading && groups.length == 0" class="text-muted mb-4 h5 text-center">
      No groups yet. Create your own!
    </div>

    <div v-if="!groups_loading && !loading && groups.length > 0">
      <div v-for="group in groups" :key="group.id" class="eventGroup">
        <div class="group-info">
          <div class="profile-images">
            <div v-for="member in group.members" :key="member.id">
              <img :src="member.profilePic" class="profile-pic" />
            </div>

            <div v-if="extraCount > 0" class="extra-count">
              +{{ extraCount }}
            </div>
          </div>


          <span id="divider"> | </span>

          <div id="groupName">{{ group.name }}</div>

        </div>

        <button type="button" class="joinGroupButton m-3" @click="joinGroup(group.id)"
          :disabled="isCurrentUserMember(group.members)">
          {{ loading ? 'Joining...' : (isCurrentUserMember(group.members) ? 'Member' : 'JOIN GROUP') }}
        </button>

        <button type="button" class="chatButton" @click="addChat(group.members, group.name)"
          :disabled="group.members.length == 1">
          VIEW CHAT </button>

      </div>
    </div>

    <!-- Event Cards -->
    <div class="my-5 ">
      <h2 class="text-primary fw-bold mb-3 display-4"> Related Events </h2>
      <hr>

      <div class="scroll-container">
        <event-cards v-for="event in relatedEvents" :key="event.id" :eventID="event.id" :title="event.title"
          :description="event.description" :image="event.imageURL"></event-cards>
      </div>
    </div>

  </div> <!-- for container -->

</template>

<script>
import { collection, doc, getDoc, getDocs, addDoc, query, where, updateDoc, arrayUnion, arrayRemove, setDoc } from "firebase/firestore";
import { db } from "../firebase/initialize";
import EventCards from '../components/eventCard.vue';
import loadingAnimation from "../components/loadingAnimation.vue";


export default {
  components:
  {
    "event-cards": EventCards,
    loadingAnimation,
  },

  data() {
    return {
      modalVisible: false,

      event_loading: true,
      groups_loading: true,
      loading: false,

      eventID: this.$route.params.id,
      eventTitle: '',
      eventImage: '',
      eventDescription: '',
      eventTiming: null,
      eventDay: '',
      eventDate: '',
      eventTime: '',
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
      joinedEvent: null,
    };
  },

  async mounted() {
    console.log('Event ID:', this.eventID); // Check if eventID is valid

    await this.getUserEvent();
    

    this.getEventDetails(this.eventID); // Call the function to get event details
    this.getGroups(this.eventID); // get event groups


    if (this.joinedEvent == false) {
      this.buttonText = "Join Event"
    } else {
      this.iconClass = "bi bi-calendar-minus"
      this.buttonText = "Leave Event"
    } 
  },

  computed: {
    visibleMembers() {
      // Display only the first three members
      return this.groups.slice(0, 3);
    },
    extraCount() {
      // Calculate the remaining members beyond the first three
      return this.groups.length > 3 ? this.groups.length - 3 : 0;
    }
  },

  methods: {
    isCurrentUserMember(members) {
      const sessionUser = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user'));
      return members.some(member => member.uid === sessionUser.uid);
    },

    async getUserEvent() {
      const sessionUser = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user'));

      try {
        const eventDocRef = doc(db, "events", this.eventID); // Replace 'this.eventID' with the actual event ID
        const eventDocSnap = await getDoc(eventDocRef);

        console.log(this.joinedEvent)
        if (eventDocSnap.exists()) {
          const data = eventDocSnap.data();

          // Check if the user has joined this event
          if (data.joined && data.joined.includes(sessionUser.uid)) {
            this.joinedEvent = true; // Set to true if the user is in the joined array
          } else {
            this.joinedEvent = false; // Set to false if the user is not in the joined array
          }
        } else {
          console.log("No such event!");
          this.joinedEvent = false;
        }

        console.log(this.joinedEvent); // Log final value
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    },

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

          this.relatedEvents = [];
          this.getRelatedEvents();
        } else {
          console.log("Unable to retrieve event");
        }
      } catch (error) {
        console.error("Error fetching document:", error); // Catch any errors
      } finally {
        this.event_loading = false;
      }
    },


    async addGroups() {
      const eventID = this.eventID;
      const sessionUser = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user'));
      const eventRef = doc(db, "events", eventID);
      const groupsRef = collection(eventRef, "groups");

      // Create a new document in the "groups" subcollection with an auto-generated ID

      const newGroupData = {
        groupName: this.groupName,
        description: this.groupDesc,
        members: [sessionUser.uid],
      };

      try {
        const docRef = await addDoc(groupsRef, newGroupData); // Add the document
        console.log("Group created with ID: ", docRef.id); // Log the new document ID
        window.location.reload();

      } catch (error) {
        console.error("Error adding group: ", error); // Handle errors
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

    async getGroups(eventID) {
      const eventRef = doc(db, "events", eventID); // Reference to the specific event document
      const groupsRef = collection(eventRef, "groups"); // Reference to the "groups" subcollection

      try {
        // Get all documents in the "groups" subcollection
        const querySnapshot = await getDocs(groupsRef);

        // Loop through the documents and extract data
        querySnapshot.forEach(async (doc) => {
          const groupMembers = []; // Array to hold members with their UID and profile picture

          // Loop through each member in the group
          for (const userID of doc.data().members) {
            const userInfo = await this.fetchUserProfile(userID); // Fetch user info using getUserInfo

            // Push member info including their UID and profile picture
            groupMembers.push({
              uid: userID,
              username: userInfo.username,
              profilePic: userInfo.profilePic, // Assuming getUserInfo returns an object with a profilePic field
            });
          }


          this.groups.push({
            id: doc.id,
            name: doc.data().groupName,
            groupDesc: doc.data().description,
            members: groupMembers,
          });
        });

        console.log("Groups retrieved:", this.groups);
        return
      } catch (error) {
        console.error("Error fetching groups: ", error);
      } finally {
        this.groups_loading = false;
      }
    },

    async getRelatedEvents() {
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
        console.log("related events", this.relatedEvents);
      });

    },

    async addMyEvent() {
      // push into user's events
      const sessionUser = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user'));
      const eventRef = doc(db, "events", this.eventID);

      try {
        const docSnap = await getDoc(eventRef); // Get the document snapshot

        if (docSnap.exists()) {
          const eventData = docSnap.data();
          const joined = eventData.joined || []; // Ensure `joined` is an array
          console.log(docSnap.id)
          console.log(joined);

          // Only add the user ID if it's not already in the array
          if (!joined.includes(sessionUser.uid)) {

            // Update the 'joined' array in Firestore
            await updateDoc(eventRef, {
              joined: arrayUnion(sessionUser.uid)
            });

            console.log("User added to the event.");

          } else {
            console.log("User already joined the event.");
          }
        } else {
          console.log("Event does not exist.");
        }
      } catch (error) {
        console.error("Error adding user to event:", error);
      }
    },

    async removeMyEvent() {
      const sessionUser = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user'));
      const docRef = doc(db, "events", this.eventID); // Create a reference to the specific event document

      try {
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const eventData = docSnap.data();
          const joined = eventData.joined || []; // Ensure `joined` is an array

          // Only add the user ID if it's not already in the array
          if (joined.includes(sessionUser.uid)) {

            await updateDoc(docRef, {
              joined: arrayRemove(sessionUser.uid)
            });

            console.log("User removed the event.");
          } else {
            console.log("User not in event.");
          }
        } else {
          console.log("Event does not exist.");
        }
      } catch (error) {
        console.error("Error removing user to event:", error);
      }
    },

    animateButton() {
      this.isLayerActive = true;

      if (this.joinedEvent == false) {
        setTimeout(() => {
          this.addMyEvent();
          this.isLayerActive = false;
          this.iconClass = "bi bi-calendar-check";
          this.buttonText = "Event Joined";
          this.joinedEvent = !this.joinedEvent;

          setTimeout(() => {
            this.iconClass = "bi bi-calendar-minus";
            this.buttonText = "Leave from Event";
          }, 1000)
        }, 1500)

      } else {
        setTimeout(() => {
          this.isLayerActive = false;
          this.removeMyEvent();
          this.iconClass = "bi bi-calendar-check";
          this.buttonText = "Left from Event";
          this.joinedEvent = !this.joinedEvent;

          setTimeout(() => {
            this.iconClass = "bi bi-calendar-plus";
            this.buttonText = "Join Event";
          }, 1000)
        }, 1500)
      }
    },

    async joinGroup(groupID){
      const sessionUser = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user'));
      const eventRef = doc(db, "events", this.eventID); // Reference to the specific event document
      const groupRef = doc(eventRef, "groups", groupID);

      try{  
        this.loading = true;
        const docSnap = await getDoc(groupRef);
        if (docSnap.exists()) {
          console.log("Group data:", docSnap.data());
          const joinedMembers = docSnap.data().members || []; // Ensure `joined` is an array
          if (!joinedMembers.includes(sessionUser.uid)) {

            // Update the 'joined' array in Firestore
            await updateDoc(groupRef, {
              members: arrayUnion(sessionUser.uid)
            });

            this.loading = false;
        
            console.log(joinedMembers)
            window.location.reload();
        } else {
          console.log("Group already joined!");
        }
      }
      }catch(error){
        console.log("Error finding group", error)
      }
    },

    // async checkMember(groupID) {
    //   try {
    //   const sessionUser = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user'));
    //   const eventRef = doc(db, "events", this.eventID); // Reference to the specific event document
    //   const groupRef = doc(eventRef, "groups", groupID);

    //   const docSnap = await getDoc(groupRef);
    //   console.log("Group data:", docSnap.data());
    //   const joinedMembers = docSnap.data().members || []; // Ensure `joined` is an array
    //   console.log(joinedMembers.includes(sessionUser.uid))
    //   this.$set(this.isMember, groupID, joinedMembers.includes(sessionUser.uid));
    //   return joinedMembers.includes(sessionUser.uid)  
    //   } catch (error) {
    //     console.log("Checking membership", error)
    //   }  
    // },

    // For CHATS
    async checkAndCreateuser(userId, userName, profilePicture) {
      try {
        const userDocRef = doc(db, "chatters", userId);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          console.log("User document exists:", userDocSnap.data());
        } else {
          console.log("Creating new user");
          const newUser = {
            id: userId,
            name: userName || "New User",
            profile_picture: profilePicture || "https://thispersondoesnotexist.com/",
          };
          await setDoc(userDocRef, newUser);
          console.log("User document created successfully:", newUser);
        }
      } catch (error) {
        console.error("Error checking or creating user document:", error);
      }
    },

    async getUserDocument(userId) {
      const collections = ["profiles", "users", "mentors"];
      for (const collectionName of collections) {
        try {
          const docRef = doc(db, collectionName, userId);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            return { data: docSnap.data(), collection: collectionName };
          }
        } catch (error) {
          console.error(`Error retrieving document from ${collectionName}:`, error);
        }
      }
      return { message: "User not found in profiles, users, or mentors collections" };
    },

    async addChat(members, groupChatName) { //chatterIds is an array of Ids (string) and groupChatName is a string (leave as null for default gc name)
      try {
        console.log(members)
        const chatterIds = members.map(member => member.uid);
        console.log(chatterIds);

        this.add_chat_button_disabled = true;

        // Step 1: Ensure all chatters exist by checking each ID in the relevant collections
        for (const chatterId of chatterIds) {
          const userDoc = await this.getUserDocument(chatterId);

          if (!userDoc.data) {
            console.log(`User ${chatterId} not found in profiles, users, or mentors, creating a new one.`);
            await this.checkAndCreateuser(chatterId, "New User", "https://thispersondoesnotexist.com/");
          } else {
            console.log(`User ${chatterId} found in ${userDoc.collection} collection.`);
          }
        }

        // Step 2: Check if a chat with the exact group of users already exists
        const chatsCollection = collection(db, "chats");
        const chatQuery = query(
          chatsCollection,
          where("chat_type", "==", "group")
        );
        const chatSnapshot = await getDocs(chatQuery);

        let existingChat = null;
        chatSnapshot.forEach((doc) => {
          const data = doc.data();
          if (
            data.group_members &&
            data.group_members.length === chatterIds.length &&
            chatterIds.every(id => data.group_members.includes(id))
          ) {
            existingChat = { id: doc.id, ...data };
          }
        });

        // If an existing chat is found, navigate to it and return
        if (existingChat) {
          console.log("Chat already exists with ID:", existingChat.id);
          this.$router.push({ name: "chatPage", params: { chatId: existingChat.id } });
          return;
        }

        // Step 3: Create a new chat document if no existing chat was found
        const newChatRef = await addDoc(collection(db, "chats"), {
          chat_type: "group",
          chat_name: groupChatName || "Group Chat",
          chat_img: "data:image/png;base64,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",
          group_members: chatterIds,
        });

        const chatId = newChatRef.id;
        console.log("New group chat created with ID:", chatId);

        // Step 4: Add chat ID to each chatter's `chats` array
        for (const chatterId of chatterIds) {
          const chatterRef = doc(db, "chatters", chatterId);
          const chatterDoc = await getDoc(chatterRef);

          if (chatterDoc.exists()) {
            await updateDoc(chatterRef, {
              chats: arrayUnion(chatId),
            });
          } else {
            await setDoc(chatterRef, {
              chats: [chatId],
            });
          }
          console.log(`Chat ID ${chatId} added to chatter ${chatterId}`);
        }

        console.log("Group chat successfully created and added to all chatters.");
        this.$router.push({ name: "chatPage", params: { chatId } });
      } catch (error) {
        console.error("Error creating group chat:", error);
      } finally {
        this.add_chat_button_disabled = false;
      }
    }
  },

  watch: {
    '$route.params.id': {
      handler(newID) {
        this.getEventDetails(newID); // call a method to fetch the new event details
      },
      immediate: true // load data on initial render as well
    }
}
}


</script>

<style scoped>
@import '../css/events.css';

/* group container */

.eventGroup {
  border: 2px solid #525FE1;
  border-radius: 55px;
  width: 100%;
  margin: 10px;
  padding: 10px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.group-info {
  display: flex;
  align-items: center;
  flex: 1;
  /* Makes the group info take available space */
}

#groupName {
  font-weight: bold;
  margin-left: 15px;
  display: flex;
  color: #525FE1;
}

.divider {
  font-weight: bold;
  color: #525FE1;
}


/* for the pfp of members displayed for each group*/

.profile-images {
  display: flex;
  align-items: center;
  margin-right: 15px;
  /* Space between profile images and group name */
}

.profile-pic {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid #fff;
  margin-left: -10px;
  /* To create overlapping effect */
  object-fit: cover;
}


.chatButton {
  background-color: #525fe1;
  color: white;
  font-size: 14px;
  padding: 6px 12px;
  font-family: 'Poppins';
  border: none;
  border-radius: 20px;
  cursor: pointer;
}

.joinGroupButton {
  background-color: #525fe1;
  color: white;
  font-size: 14px;
  padding: 6px 12px;
  font-family: 'Poppins';
  border: none;
  border-radius: 20px;
  cursor: pointer;
}

/* Disabled button styling */
.joinGroupButton:disabled,
.chatButton:disabled {
  background-color: #bdc3c7;  /* Gray background */
  color: #7f8c8d;             /* Gray text */
  cursor: not-allowed;        /* Change cursor to indicate disabled state */
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


/* to center the remaining member count within the circle */
.extra-count {
  background-color: #ccc;
  color: #fff;
  font-weight: bold;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: -10px;
}

.headerImage {
  width: 100%;
  height: 400px;
  object-fit: cover;
  object-position: center;
}

.headerTitle {
  font-family: 'Poppins';
  color: #525FE1;
  font-weight: bold;
}

.timing-details {
  padding: 3px;
  border: 3px solid #fb8500;
  border-radius: 8px;
  margin-right: 10px;
  height: 70px;
  text-align: center;
  align-content: center;
}

.location-details {
  border: 3px solid #355070;
  border-radius: 8px;
  margin-right: 10px;
  height: 70px;
  text-align: center;
  align-content: center;
}

.category-details {
  border: 3px solid  #023047;
  border-radius: 8px;
  margin-right: 10px;
  height: 70px;
  text-align: center;
  align-content: center;
}

.eventDesc {
  border: 3px solid #5e14c6;
  border-radius: 8px;
  height: fit-content;
  padding: 10px;
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
